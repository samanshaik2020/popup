'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with your authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            We couldn't complete the authentication process. This could be due to:
          </p>
          <ul className="list-disc text-left pl-6 space-y-1">
            <li>An expired confirmation link</li>
            <li>A previously used confirmation link</li>
            <li>A network issue during authentication</li>
          </ul>
          <p>
            Please try logging in again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
