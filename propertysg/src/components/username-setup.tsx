"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const FormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name must be less than 50 characters.",
  }),
})

interface UsernameSetupProps {
  className?: string
}

export function UsernameSetup({ className }: UsernameSetupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user, userProfile, setUserProfile } = useAuth()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: userProfile?.name || "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user || !userProfile) return
    
    setIsLoading(true)
    try {
      // Update user profile in Firestore
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        name: data.displayName,
        updatedAt: new Date(),
      })

      // Update local user profile state
      setUserProfile({
        ...userProfile,
        name: data.displayName,
        updatedAt: new Date(),
      })

      toast.success("Welcome to PropertySG!", {
        description: `Great to meet you, ${data.displayName}!`,
      })

      // Redirect to home page after username is set
      setTimeout(() => {
        router.push("/")
      }, 1500)

    } catch (error) {
      toast.error("Failed to update your name", {
        description: "Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center p-6 md:p-10 pt-40 md:pt-36", className)}>
      <div className="w-full max-w-md">
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="text-2xl font-light text-white tracking-wide">
              Welcome to PropertySG! 🎉
            </CardTitle>
            <CardDescription className="text-white/60 font-light">
              What should we call you?
            </CardDescription>
            <CardDescription className="text-white/60 font-light">
              Pick a unique username for your PropertySG profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 font-light">Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field}
                          disabled={isLoading}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 font-light h-12"
                        />
                      </FormControl>
                      <FormDescription className="text-white/50 font-light">
                        This is how other users will see you on PropertySG.
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-light h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Setting up..." : "Continue to PropertySG"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="text-white/40 text-center text-xs text-balance font-light mt-8">
          You can change your name later in your profile settings.
        </div>
      </div>
    </div>
  )
}