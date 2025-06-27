import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Helper to prevent redirect loops
const isRedirectLoop = (req: NextRequest): boolean => {
  // Check the referer to prevent redirect loops
  const referer = req.headers.get('referer') || ''
  const path = req.nextUrl.pathname
  
  // If coming from dashboard to login or vice versa, potential loop
  if (path === '/login' && referer.includes('/dashboard')) {
    console.log('⚠️ Potential redirect loop detected: dashboard → login')
    return true
  }
  
  if (path === '/dashboard' && referer.includes('/login')) {
    console.log('⚠️ Potential redirect loop detected: login → dashboard')
    return true
  }
  
  return false
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if URL contains access token (email confirmation flow)
  const hasAccessToken = req.url.includes('#access_token=') || req.url.includes('?access_token=')
  
  // If this is an email confirmation link, redirect to auth callback
  if (hasAccessToken) {
    console.log('Access token detected in URL, redirecting to auth callback')
    
    // Extract the hash portion and convert it to searchParams
    const url = new URL(req.url)
    let tokenParams = ''
    
    if (url.hash && url.hash.includes('access_token=')) {
      // Handle fragment/hash based tokens (#access_token=...)
      tokenParams = url.hash.substring(1) // Remove the # character
    } else if (url.search && url.search.includes('access_token=')) {
      // Handle query param based tokens (?access_token=...)
      tokenParams = url.search.substring(1) // Remove the ? character
    }
    
    // Create a new URL for the auth callback with the token as query params
    const callbackUrl = new URL('/auth/callback', req.url)
    callbackUrl.search = tokenParams
    
    return NextResponse.redirect(callbackUrl)
  }
  
  // Check for redirect loops first before doing anything else
  if (isRedirectLoop(req)) {
    console.log('Preventing redirect loop, allowing request to proceed')
    return res
  }
    
  // Create a Supabase client using auth-helpers-nextjs
  const supabase = createMiddlewareClient({ req, res })
  
  try {
    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession()
    
    // Debug session state with more details
    console.log(`Middleware path: ${req.nextUrl.pathname}, Session exists: ${!!session}`)
    if (session) {
      console.log(`User authenticated: ${session.user.email}`)
    }

    // Check auth condition
    const isAuthRoute = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup'
    const isDashboardRoute = req.nextUrl.pathname === '/dashboard'
    const isAuthCallback = req.nextUrl.pathname === '/auth/callback'
    const hasDashboardQueryParam = req.nextUrl.searchParams.has('t')
    
    // Allow auth callback to proceed
    if (isAuthCallback) {
      return res
    }
    
    // If accessing dashboard without being logged in, redirect to login
    if (isDashboardRoute && !session) {
      console.log('Accessing dashboard without session, redirecting to login')
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Force session refresh when hitting dashboard with timestamp param
    // This helps with email confirmation flow
    if (isDashboardRoute && session && hasDashboardQueryParam) {
      console.log('Dashboard accessed with timestamp query, ensuring fresh session')
      await supabase.auth.refreshSession()
    }
    
    // If accessing login/signup while logged in, redirect to dashboard
    if (isAuthRoute && session) {
      console.log('User already logged in, redirecting to dashboard')
      // Add a timestamp to prevent caching issues
      return NextResponse.redirect(new URL(`/dashboard?t=${Date.now()}`, req.url))
    }
    
    return res
  } catch (error) {
    console.error('Error in middleware:', error)
    // For any errors, just proceed with the request
    return res
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard', 
    '/login', 
    '/signup',
    '/auth/callback',
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
