"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { signIn, signInWithGoogle, userProfile } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      await signIn(email, password)
      router.push("/")
    } catch (error) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    try {
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <CardTitle className="text-2xl font-light text-white tracking-wide">
            Welcome back
          </CardTitle>
          <CardDescription className="text-white/60 font-light">
            Sign in to your PropertySG account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 font-light h-12"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-3">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
              
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-white/20">
                <span className="bg-black/40 text-white/60 relative z-10 px-4 font-light">
                  Or continue with email
                </span>
              </div>
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-white/80 font-light">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 font-light h-12"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-white/80 font-light">
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="ml-auto text-sm text-white/60 hover:text-white underline-offset-4 hover:underline font-light"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 font-light h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-light h-12 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
              
              <div className="text-center text-sm space-y-2">
                <p className="text-white/60 font-light">
                  Do not have an account?{" "}
                  <Link href="/register" className="text-white hover:text-white/80 underline underline-offset-4 font-light">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-white/40 text-center text-xs text-balance font-light">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="text-white/60 hover:text-white underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-white/60 hover:text-white underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}
