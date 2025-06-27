import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, MousePointerClick, BarChart2, Twitter, Facebook, Linkedin, Github } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">popiup</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Add a Call-to-Action to Every Link You Share</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our tool shortens your links and overlays your custom ad, turning every shared link into a powerful
            marketing asset.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/login?redirect=/dashboard">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose popiup?</h2>
            <p className="text-muted-foreground text-lg">Transform your links into powerful marketing tools</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Drive Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Redirect users who click your links back to your website, blog, or online store.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MousePointerClick className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Generate Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Add a newsletter signup form or a contact button directly onto the links you share.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Track Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get detailed analytics on who is clicking your links and interacting with your ads.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works in 3 Simple Steps</h2>
            <p className="text-muted-foreground text-lg">Get started in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Paste any URL</h3>
              <p className="text-muted-foreground">Enter the destination link you want to share.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Ad</h3>
              <p className="text-muted-foreground">Select one of your pre-made ads to overlay on the link.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
              <p className="text-muted-foreground">
                We generate a short link for you to share on social media, in emails, or anywhere else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Links?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of marketers who are already using popiup to boost their engagement.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <Link href="/login?redirect=/dashboard">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">popiup</h3>
              <p className="text-muted-foreground text-sm">Transform every link into a marketing opportunity.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 popiup. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
