"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, User } from "lucide-react"

interface AdSettings {
  destinationUrl: string
  position: string
  delay: string
  profileName: string
  description: string
  buttonText: string
  buttonLink: string
  logoText: string
}

export default function SlugPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [settings, setSettings] = useState<AdSettings | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (!slug) return
    const raw = localStorage.getItem(`ad_${slug}`)
    if (!raw) return
    const parsed = JSON.parse(raw)
    setSettings(parsed)
    const delayMs = Number(parsed.delay || 0) * 1000
    const timer = setTimeout(() => setShowPopup(true), delayMs)
    return () => clearTimeout(timer)
  }, [slug])

  if (!settings) return <div className="p-10 text-center">Invalid or expired link.</div>

  const getPopupPosition = () => {
    switch (settings.position) {
      case "top":
        return "top-4 left-1/2 transform -translate-x-1/2"
      case "left":
        return "left-4 top-1/2 transform -translate-y-1/2"
      case "right":
        return "right-4 top-1/2 transform -translate-y-1/2"
      default:
        return "bottom-4 left-1/2 transform -translate-x-1/2"
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Destination site */}
      <iframe
        src={settings.destinationUrl}
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-forms"
        title="Destination"
      />

      {/* Popup */}
      {showPopup && (
        <Card className={`absolute ${getPopupPosition()} w-80 shadow-lg z-10 border-2 bg-white`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="font-semibold text-sm">{settings.profileName}</div>
                <div className="text-sm text-muted-foreground">{settings.description}</div>
                <Button size="sm" className="w-full" asChild>
                  <a href={settings.buttonLink} target="_blank" rel="noopener noreferrer">
                    {settings.buttonText}
                  </a>
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setShowPopup(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {settings.logoText && (
              <div className="mt-3 pt-3 border-t text-xs text-center text-muted-foreground">
                {settings.logoText}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
