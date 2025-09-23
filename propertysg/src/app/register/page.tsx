import { SignUpForm } from "@/components/signup-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 pt-40 md:pt-36">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}