import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams, origin } = requestUrl
  const code = searchParams.get('code')
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  const next = searchParams.get('next') || '/dashboard'
  
  console.log('Auth callback received:', { 
    hasCode: !!code, 
    hasAccessToken: !!accessToken,
    path: requestUrl.pathname,
    search: requestUrl.search ? 'present' : 'none',
    next
  })

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  try {
    // Handle code exchange flow (OAuth or magic link)
    if (code) {
      console.log('Processing code exchange flow')
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth code exchange error:', error)
        return NextResponse.redirect(`${origin}/auth-error?error=${encodeURIComponent(error.message)}&type=code_exchange`)
      }
    } 
    // Handle access token flow (email confirmation)
    else if (accessToken) {
      console.log('Processing access token flow')
      // The session should be automatically set by Supabase's detectSessionInUrl
      // but we can manually set it as well to be sure
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      })
      
      if (error) {
        console.error('Auth token setting error:', error)
        return NextResponse.redirect(`${origin}/auth-error?error=${encodeURIComponent(error.message)}&type=token_setting`)
      }
    } else {
      console.error('No authentication code or token provided')
      return NextResponse.redirect(`${origin}/auth-error?error=no_auth_credentials`)
    }
    
    // Verify the session was created successfully
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.error('No session after authentication flow')
      return NextResponse.redirect(`${origin}/auth-error?error=session_not_created`)
    }
    
    // For email confirmation flow, explicitly refresh the session
    if (accessToken) {
      // Force a refresh of the session
      await supabase.auth.refreshSession()
      
      // Wait a moment to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('Authentication successful, redirecting to:', next)
    // Successful authentication, redirect to dashboard with timestamp to prevent caching
    return NextResponse.redirect(`${origin}${next}?t=${Date.now()}`)
    
  } catch (err: any) {
    console.error('Unexpected error in auth callback:', err)
    return NextResponse.redirect(`${origin}/auth-error?error=${encodeURIComponent(err.message || 'unexpected_error')}`)
  }

  // No code provided
  return NextResponse.redirect(`${origin}/auth-error?error=no_code_provided`)
}
