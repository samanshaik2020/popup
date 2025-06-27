'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      console.log('Current session:', data.session)
      
      if (data.session) {
        console.log('User already logged in, redirecting to dashboard')
        router.push('/dashboard')
      }
    }
    
    checkSession()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">popiup</h1>
          </div>
        </div>
      </header>

      {/* Centered Login Card */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Log in with your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-4"
              onSubmit={async (e: React.FormEvent) => {
                e.preventDefault()
                setLoading(true)
                setErrorMsg(null)
                setDebugInfo(null)
                
                try {
                  console.log('Attempting login with:', { email })
                  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                  
                  console.log('Login response:', { data, error })
                  setDebugInfo({ data, error })
                  
                  setLoading(false)
                  if (error) {
                    setErrorMsg(`Error: ${error.message} (Code: ${error.status || 'unknown'})`)
                  } else if (data.user) {
                    console.log('Login successful, redirecting to:', redirectPath)
                    router.push(redirectPath)
                  } else {
                    setErrorMsg('Login successful but no user data returned. This is unexpected.')
                  }
                } catch (err: any) {
                  console.error('Unexpected error during login:', err)
                  setLoading(false)
                  setErrorMsg(`Unexpected error: ${err.message || 'Unknown error'}`)
                  setDebugInfo(err)
                }
              }}
            >
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)} />
        
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)} />
        
              {errorMsg && (
                <div className="text-red-500 text-sm space-y-1">
                  <p>{errorMsg}</p>
                  <p className="text-xs">If you just confirmed your email, try refreshing this page before logging in.</p>
                </div>
              )}
              
              {debugInfo && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground text-center w-full">
              By signing in, you agree to our{' '}
              <a href="#" className="underline hover:text-foreground">
                Terms of Service
              </a>{' '}and{' '}
              <a href="#" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
            <p className="text-xs text-center w-full">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
