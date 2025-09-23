"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { User as UserType } from "@/types"

interface AuthContextType {
  user: User | null
  userProfile: UserType | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  setUserProfile: (profile: UserType) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserType)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user profile in Firestore
    const userProfile: UserType = {
      id: user.uid,
      email: user.email!,
      name,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      favoriteProperties: [],
    }
    
    await setDoc(doc(db, "users", user.uid), userProfile)
    setUserProfile(userProfile)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(auth, provider)
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, "users", user.uid))
    if (!userDoc.exists()) {
      const userProfile: UserType = {
        id: user.uid,
        email: user.email!,
        name: user.displayName || "User",
        avatar: user.photoURL || undefined,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteProperties: [],
      }
      
      await setDoc(doc(db, "users", user.uid), userProfile)
      setUserProfile(userProfile)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    setUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
