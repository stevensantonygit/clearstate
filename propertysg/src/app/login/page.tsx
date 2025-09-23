import { Building2 } from "lucide-react"
import Link from "next/link"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-gray-900 flex flex-col items-center justify-center gap-8 p-6 md:p-10 pt-40 md:pt-36">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <Link href="/" className="flex items-center gap-3 self-center">
          <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-light text-white tracking-wide">PropertySG</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
