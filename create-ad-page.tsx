"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloud, X, User } from "lucide-react"

interface CreateAdPageProps {
  onClose?: () => void
}

export default function CreateAdPage({ onClose = () => {} }: CreateAdPageProps) {
  const [adSettings, setAdSettings] = useState({
    adName: "hello",
    adType: "text",
    position: "top",
    showAfter: "5",
    profileName: "John Doe",
    profileUrl: "https://example.com",
    profilePicture: "",
    description: "Check out this amazing content!",
    buttonText: "Learn More",
    buttonLink: "https://example.com",
    logoLink: "https://example.com",
    logoText: "Brand Name",
    destinationUrl: "https://example.com",
    delay: "0",
    bgColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#6366f1",
    videoUrl: "",

  })

  const [generatedLink, setGeneratedLink] = useState<string | null>(null)

  const updateSetting = (key: string, value: string) => {
    setAdSettings((prev) => ({ ...prev, [key]: value }))
  }

  const getPopupPosition = () => {
    switch (adSettings.position) {
      case "top":
        return "top-4 left-1/2 transform -translate-x-1/2"
      case "left":
        return "left-4 top-1/2 transform -translate-y-1/2"
      case "right":
        return "right-4 top-1/2 transform -translate-y-1/2"
      default:
        return "top-4 left-1/2 transform -translate-x-1/2"
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Link Ad</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <Tabs defaultValue="general" className="mt-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            
          </TabsList>
        </Tabs>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Column - Settings Form */}
        <div className="w-1/2 border-r overflow-y-auto p-6 space-y-8">
          {/* Destination URL */}
          <div className="space-y-2">
            <Label htmlFor="dest">Destination URL</Label>
            <Input
              id="dest"
              value={adSettings.destinationUrl}
              onChange={(e) => updateSetting("destinationUrl", e.target.value)}
              placeholder="https://targetsite.com"
            />
          </div>

          {/* Delay */}
          <div className="space-y-2">
            <Label htmlFor="delay">Popup Delay (seconds, optional)</Label>
            <Input
              id="delay"
              type="number"
              min="0"
              value={adSettings.delay}
              onChange={(e) => updateSetting("delay", e.target.value)}
            />
          </div>

          {/* Ad Name Section */}
          <div className="space-y-2">
            <Label htmlFor="adName">Ad Name</Label>
            <Input
              id="adName"
              value={adSettings.adName}
              onChange={(e) => updateSetting("adName", e.target.value)}
              placeholder="hello"
            />
          </div>

          {/* Ad Type Section */}
          <div className="space-y-4">
            <Label>Ad Type</Label>
            <RadioGroup
              value={adSettings.adType}
              onValueChange={(value) => updateSetting("adType", value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video">Video</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="invisible" id="invisible" />
                <Label htmlFor="invisible">Invisible</Label>
              </div>
            </RadioGroup>

            {/* Position Selection */}
            <div className="space-y-2">
              <Label>Popup Position</Label>
              <RadioGroup
                value={adSettings.position}
                onValueChange={(value) => updateSetting("position", value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="top" id="top" />
                  <Label htmlFor="top" className="flex-1">
                    Top
                  </Label>
                  <div className="w-8 h-6 bg-muted rounded border-t-2 border-primary"></div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="left" id="left" />
                  <Label htmlFor="left" className="flex-1">
                    Left
                  </Label>
                  <div className="w-8 h-6 bg-muted rounded border-l-2 border-primary"></div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="right" id="right" />
                  <Label htmlFor="right" className="flex-1">
                    Right
                  </Label>
                  <div className="w-8 h-6 bg-muted rounded border-r-2 border-primary"></div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="exit" id="exit" />
                  <Label htmlFor="exit" className="flex-1">
                    Exit Popup
                  </Label>
                  <div className="w-8 h-6 bg-muted rounded border-2 border-destructive"></div>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="showAfter">Show after:</Label>
              <Input
                id="showAfter"
                value={adSettings.showAfter}
                onChange={(e) => updateSetting("showAfter", e.target.value)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
          </div>

          {/* Text CTA Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">TEXT CTA SETTINGS</h3>

            <div className="space-y-2">
              <Label>Preset</Label>
              <Select defaultValue="custom">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="template1">Template 1</SelectItem>
                  <SelectItem value="template2">Template 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profileName">Profile Name</Label>
                <Input
                  id="profileName"
                  value={adSettings.profileName}
                  onChange={(e) => updateSetting("profileName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileUrl">Profile Url</Label>
                <Input
                  id="profileUrl"
                  value={adSettings.profileUrl}
                  onChange={(e) => updateSetting("profileUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex gap-2">
                  <Input placeholder="Image URL" className="flex-1" />
                  <Button variant="outline">Upload</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={adSettings.description}
                  onChange={(e) => updateSetting("description", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-2">
            <Label>Sound To Play</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sound</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="bell">Bell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">BUTTON SETTINGS</h3>

            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={adSettings.buttonText}
                onChange={(e) => updateSetting("buttonText", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={adSettings.buttonLink}
                onChange={(e) => updateSetting("buttonLink", e.target.value)}
              />
            </div>
          </div>

          {/* Logo Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">LOGO SETTINGS</h3>

            <div className="space-y-2">
              <Label htmlFor="logoLink">Logo Link</Label>
              <Input
                id="logoLink"
                value={adSettings.logoLink}
                onChange={(e) => updateSetting("logoLink", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoText">Logo Text</Label>
              <Input
                id="logoText"
                value={adSettings.logoText}
                onChange={(e) => updateSetting("logoText", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Logo Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <Button variant="outline">Upload</Button>
                  <Button variant="ghost">Grab from site</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Design Customization */}
          <div className="space-y-4">
            <Label>Popup Background Color</Label>
            <Input
              type="color"
              value={adSettings.bgColor}
              onChange={(e) => updateSetting("bgColor", e.target.value)}
              className="w-16 h-8 p-0 border-none bg-transparent"
            />
            <Label>Text Color</Label>
            <Input
              type="color"
              value={adSettings.textColor}
              onChange={(e) => updateSetting("textColor", e.target.value)}
              className="w-16 h-8 p-0 border-none bg-transparent"
            />
            <Label>Button Color</Label>
            <Input
              type="color"
              value={adSettings.buttonColor}
              onChange={(e) => updateSetting("buttonColor", e.target.value)}
              className="w-16 h-8 p-0 border-none bg-transparent"
            />
          </div>

          {/* Uploads */}
          <div className="space-y-4">
            <Label htmlFor="profilePic">Profile Image</Label>
            <Input
              id="profilePic"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => {
                    updateSetting("profilePicture", reader.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />

            <Label htmlFor="videoUpload">Promo Video (optional)</Label>
            <Input
              id="videoUpload"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const url = URL.createObjectURL(file)
                  updateSetting("videoUrl", url)
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                // simple slug
                const slug = Math.random().toString(36).substring(2, 8)
                localStorage.setItem(`ad_${slug}`, JSON.stringify(adSettings))
                setGeneratedLink(`${window.location.origin}/${slug}`)
              }}
            >
              Generate Link
            </Button>
            {generatedLink && (
              <div className="text-sm break-all text-center">
                Your link: <a className="underline text-blue-600" href={generatedLink}>{generatedLink}</a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="w-1/2 p-6 bg-muted/20">
          <div className="h-full relative">
            <h3 className="text-lg font-semibold mb-4">Live Preview</h3>

            {/* Iframe Container */}
            <div className="relative w-full h-[600px] bg-white border rounded-lg overflow-hidden">
              {/* Sample Website in Iframe */}
              <iframe
                src="https://example.com"
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts"
              />

              {/* Ad Popup Overlay */}
              <Card className={`absolute ${getPopupPosition()} w-80 shadow-lg z-10 border-2`} style={{ backgroundColor: adSettings.bgColor, color: adSettings.textColor }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: adSettings.bgColor }}>
                      {adSettings.profilePicture ? (
                        <img src={adSettings.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-sm">{adSettings.profileName}</div>
                      <div className="text-sm text-muted-foreground">{adSettings.description}</div>
                      <Button size="sm" className="w-full" style={{ backgroundColor: adSettings.buttonColor, color: '#ffffff' }}>
                        {adSettings.buttonText}
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {adSettings.logoText && (
                    <div className="mt-3 pt-3 border-t text-xs text-center text-muted-foreground">
                      {adSettings.logoText}
                    </div>
                  )}
                {adSettings.videoUrl && (
                  <video src={adSettings.videoUrl} controls className="mt-2 w-full rounded" />
                )}
                </CardContent>
              </Card>
            </div>

            {/* Preview Controls */}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                Refresh Preview
              </Button>
              <Select defaultValue="example">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="example">Example.com</SelectItem>
                  <SelectItem value="news">News Site</SelectItem>
                  <SelectItem value="blog">Blog Site</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
