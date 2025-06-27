"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloud, X, User, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"

export default function EditLinkPage() {
  const router = useRouter();
  const params = useParams();
  const linkId = params.id as string;
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linkData, setLinkData] = useState<any>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  
  const [adSettings, setAdSettings] = useState({
    adName: "",
    adType: "text",
    position: "top",
    showAfter: "5",
    profileName: "",
    profileUrl: "",
    profilePicture: "",
    description: "",
    buttonText: "Learn More",
    buttonLink: "",
    logoLink: "",
    logoText: "",
    destinationUrl: "",
    delay: "0",
    bgColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#6366f1",
    videoUrl: "",
  });

  // Check authentication and fetch link data
  useEffect(() => {
    async function checkAuthAndFetchLink() {
      try {
        // Check if user is authenticated
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session?.user) {
          router.push('/login');
          return;
        }
        
        setUser(session.user);
        
        // Fetch the link data
        const { data: link, error: linkError } = await supabase
          .from('links')
          .select('*')
          .eq('id', linkId)
          .eq('user_id', session.user.id)
          .single();
        
        if (linkError || !link) {
          toast({
            title: "Error",
            description: "Link not found or you don't have permission to edit it",
            variant: "destructive",
          });
          router.push('/dashboard');
          return;
        }
        
        setLinkData(link);
        setOriginalUrl(link.original_url);
        setShortCode(link.short_code);
        
        // Parse content if available
        if (link.content) {
          try {
            const content = JSON.parse(link.content);
            setAdSettings({
              adName: content.adName || "",
              adType: content.adType || "text",
              position: content.position || "top",
              showAfter: content.showAfter || "5",
              profileName: content.profileName || "",
              profileUrl: content.profileUrl || "",
              profilePicture: content.profilePicture || "",
              description: content.description || "",
              buttonText: content.buttonText || "Learn More",
              buttonLink: content.buttonLink || "",
              logoLink: content.logoLink || "",
              logoText: content.logoText || "",
              destinationUrl: content.destinationUrl || "",
              delay: content.delay || "0",
              bgColor: content.bgColor || "#ffffff",
              textColor: content.textColor || "#000000",
              buttonColor: content.buttonColor || "#6366f1",
              videoUrl: content.videoUrl || "",
            });
          } catch (e) {
            console.error("Error parsing link content:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching link data:", error);
        toast({
          title: "Error",
          description: "Failed to load link data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    checkAuthAndFetchLink();
  }, [linkId, router, toast]);

  const updateSetting = (key: string, value: string) => {
    setAdSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getPopupPosition = () => {
    switch (adSettings.position) {
      case "top":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "left":
        return "left-4 top-1/2 transform -translate-y-1/2";
      case "right":
        return "right-4 top-1/2 transform -translate-y-1/2";
      default:
        return "top-4 left-1/2 transform -translate-x-1/2";
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Prepare content JSON
      const contentJson = JSON.stringify({
        adName: adSettings.adName,
        adType: adSettings.adType,
        position: adSettings.position,
        showAfter: adSettings.showAfter,
        profileName: adSettings.profileName,
        profileUrl: adSettings.profileUrl,
        profilePicture: adSettings.profilePicture,
        description: adSettings.description,
        buttonText: adSettings.buttonText,
        buttonLink: adSettings.buttonLink,
        logoLink: adSettings.logoLink,
        logoText: adSettings.logoText,
        destinationUrl: adSettings.destinationUrl,
        delay: adSettings.delay,
        bgColor: adSettings.bgColor,
        textColor: adSettings.textColor,
        buttonColor: adSettings.buttonColor,
        videoUrl: adSettings.videoUrl,
      });
      
      // Update the link in Supabase
      const { error } = await supabase
        .from('links')
        .update({
          original_url: adSettings.destinationUrl,
          content: contentJson,
          updated_at: new Date().toISOString(),
        })
        .eq('id', linkId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Link updated successfully",
      });
      
      // Redirect back to dashboard
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error("Error updating link:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update link",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading link data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Link</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
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
          {/* Link Information */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Short Link:</p>
            <p className="text-sm break-all mb-4">
              {`${window.location.origin}/l/${shortCode}`}
            </p>
            <p className="text-sm font-medium mb-2">Original URL:</p>
            <p className="text-sm break-all">{originalUrl}</p>
          </div>
          
          {/* Ad Name */}
          <div className="space-y-2">
            <Label htmlFor="adName">Ad Name (internal reference only)</Label>
            <Input
              id="adName"
              value={adSettings.adName}
              onChange={(e) => updateSetting("adName", e.target.value)}
              placeholder="My Popup Ad"
            />
          </div>
          
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

          {/* Position */}
          <div className="space-y-2">
            <Label>Popup Position</Label>
            <RadioGroup
              value={adSettings.position}
              onValueChange={(value) => updateSetting("position", value)}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="top" id="top" />
                <Label htmlFor="top">Top</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left">Left</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right">Right</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Profile Name */}
          <div className="space-y-2">
            <Label htmlFor="profileName">Profile Name</Label>
            <Input
              id="profileName"
              value={adSettings.profileName}
              onChange={(e) => updateSetting("profileName", e.target.value)}
              placeholder="John Doe"
            />
          </div>

          {/* Profile URL */}
          <div className="space-y-2">
            <Label htmlFor="profileUrl">Profile URL</Label>
            <Input
              id="profileUrl"
              value={adSettings.profileUrl}
              onChange={(e) => updateSetting("profileUrl", e.target.value)}
              placeholder="https://example.com/profile"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={adSettings.description}
              onChange={(e) => updateSetting("description", e.target.value)}
              placeholder="Check out this amazing content!"
            />
          </div>

          {/* Button Text */}
          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={adSettings.buttonText}
              onChange={(e) => updateSetting("buttonText", e.target.value)}
              placeholder="Learn More"
            />
          </div>

          {/* Button Link */}
          <div className="space-y-2">
            <Label htmlFor="buttonLink">Button Link</Label>
            <Input
              id="buttonLink"
              value={adSettings.buttonLink}
              onChange={(e) => updateSetting("buttonLink", e.target.value)}
              placeholder="https://example.com/action"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex">
                <Input
                  id="bgColor"
                  type="color"
                  value={adSettings.bgColor}
                  onChange={(e) => updateSetting("bgColor", e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input
                  type="text"
                  value={adSettings.bgColor}
                  onChange={(e) => updateSetting("bgColor", e.target.value)}
                  className="flex-1 ml-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex">
                <Input
                  id="textColor"
                  type="color"
                  value={adSettings.textColor}
                  onChange={(e) => updateSetting("textColor", e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input
                  type="text"
                  value={adSettings.textColor}
                  onChange={(e) => updateSetting("textColor", e.target.value)}
                  className="flex-1 ml-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonColor">Button Color</Label>
              <div className="flex">
                <Input
                  id="buttonColor"
                  type="color"
                  value={adSettings.buttonColor}
                  onChange={(e) => updateSetting("buttonColor", e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input
                  type="text"
                  value={adSettings.buttonColor}
                  onChange={(e) => updateSetting("buttonColor", e.target.value)}
                  className="flex-1 ml-2"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              disabled={saving}
              onClick={handleSaveChanges}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
