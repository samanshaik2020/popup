'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">popiup</h1>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Sign up to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-4"
              onSubmit={async (e: React.FormEvent) => {
                e.preventDefault()
                setLoading(true)
                setErrorMsg(null)
                setSuccessMsg(null)
                const { error } = await supabase.auth.signUp({ 
                  email, 
                  password,
                  options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                  }
                })
                setLoading(false)
                if (error) {
                  setErrorMsg(error.message)
                } else {
                  setSuccessMsg('Please check your email for a verification link. After confirming your email, you will be automatically redirected to your dashboard.')
                }
              }}
            >
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
              {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating...' : 'Sign up'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <p className="text-xs text-center w-full">
              Already have an account?{' '}
              <a href="/login" className="underline">
                Login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
