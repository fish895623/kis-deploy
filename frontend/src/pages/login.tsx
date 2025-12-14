import { Navigate } from "react-router-dom"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/hooks/useAuth"

export function LoginPage() {
  const { login, isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={login} />
      </div>
    </div>
  )
}
