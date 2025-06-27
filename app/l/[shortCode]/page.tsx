'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LinkRedirect() {
  const params = useParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [popupContent, setPopupContent] = useState<any>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(true)
  const shortCode = params.shortCode as string

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        // Call our API route to handle the redirection and analytics
        const response = await fetch(`/api/redirect/${shortCode}`)
        const data = await response.json()
        
        if (!response.ok) {
          setError(data.error || 'Link not found')
          return
        }
        
        // Store the original URL for later redirection
        setOriginalUrl(data.url)
        
        // If there's popup content, parse and display it
        if (data.content) {
          try {
            const content = JSON.parse(data.content)
            setPopupContent(content)
          } catch (e) {
            console.error('Error parsing popup content:', e)
          }
        }
      } catch (error: any) {
        console.error('Error fetching link data:', error.message)
        setError('Error loading link data')
      } finally {
        setLoading(false)
      }
    }

    fetchLinkData()
  }, [shortCode])

  const handleClose = () => {
    setShowPopup(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Link Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <a 
            href="/" 
            className="text-blue-600 hover:underline"
          >
            Return to homepage
          </a>
        </div>
      </div>
    )
  }

  // If popup is closed, redirect to the original URL
  if (!showPopup && originalUrl) {
    window.location.href = originalUrl;
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Iframe to load the destination site */}
      {originalUrl && (
        <iframe 
          src={originalUrl}
          className="w-full h-screen border-0"
          title="Destination website"
          sandbox="allow-same-origin allow-scripts"
        />
      )}
      
      {/* Popup overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Popup header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                {popupContent?.adName || 'Advertisement'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Popup content */}
            <div className="p-4">
              {popupContent?.adImage && (
                <div className="mb-4">
                  <img 
                    src={popupContent.adImage} 
                    alt={popupContent.adName || 'Advertisement'}
                    className="w-full h-auto rounded-md" 
                  />
                </div>
              )}
              
              {popupContent?.adDescription && (
                <p className="text-gray-700 mb-4">{popupContent.adDescription}</p>
              )}
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={handleClose}>Skip</Button>
                <Button onClick={handleClose}>Continue to Site</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
