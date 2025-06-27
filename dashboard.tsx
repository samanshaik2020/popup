"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, ExternalLink, PlusCircle, BarChart3 } from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the current user and their links
    async function fetchUserAndLinks(retryCount = 0) {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { session }, error: userError } = await supabase.auth.getSession();
        
        if (userError) {
          throw userError;
        }
        
        // If no session and we haven't retried too many times, try refreshing
        if (!session && retryCount < 3) {
          console.log(`No session found, refreshing and retrying (attempt ${retryCount + 1})`);
          
          // Try to refresh the session
          await supabase.auth.refreshSession();
          
          // Wait a moment before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Retry with incremented count
          return fetchUserAndLinks(retryCount + 1);
        }
        
        if (session?.user) {
          console.log("Session found, user authenticated:", session.user.email);
          setUser(session.user);
          
          // Fetch user's links
          const { data: linksData, error: linksError } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
            
          if (linksError) {
            throw linksError;
          }
          
          setLinks(linksData || []);
          setError(null); // Clear any previous errors
        } else if (retryCount >= 3) {
          // After retries, if still no session, show error
          throw new Error("Authentication failed. Please try logging in again.");
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load your data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserAndLinks();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUserAndLinks();
      } else if (event === 'SIGNED_OUT') {
        // Handle sign out
        setUser(null);
        setLinks([]);
      }
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);
        
      if (error) throw error;
      
      // Update the local state to remove the deleted link
      setLinks(links.filter(link => link.id !== linkId));
      
    } catch (err: any) {
      console.error("Error deleting link:", err);
      setError("Failed to delete link. Please try again.");
    }
  };

  // Function to format date nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">popiup</h1>
            {user && (
              <p className="text-sm text-muted-foreground">
                Welcome, {user.email?.split('@')[0]}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Account link removed as requested */}
            <Button 
              variant="outline" 
              onClick={async () => {
                try {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                } catch (error) {
                  console.error('Error signing out:', error);
                }
              }}
            >
              Logout
            </Button>
            <Button variant="default" asChild>
              <Link href="/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Link
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your popup links and view analytics
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="links" className="w-full">
          <TabsList>
            <TabsTrigger value="links">My Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-8 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : links.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {links.map((link) => (
                  <Card key={link.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="truncate">{link.content ? JSON.parse(link.content).adName || "Unnamed Link" : "Unnamed Link"}</CardTitle>
                      <CardDescription>
                        Created {formatDate(link.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Type:</span>
                        <span className="text-sm">{link.content ? JSON.parse(link.content).adType || "Text" : "Text"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">URL:</span>
                        <span className="text-sm truncate">
                          {window.location.origin}/l/{link.short_code}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Destination:</span>
                        <span className="text-sm truncate">{link.content ? JSON.parse(link.content).destinationUrl || "#" : "#"}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/edit/${link.id}`}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/l/${link.short_code}`} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-1" /> Visit
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border rounded-lg bg-background">
                <h3 className="text-xl font-semibold mb-2">No links yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first popup link to get started
                </p>
                <Button asChild>
                  <Link href="/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Link
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Link Performance</CardTitle>
                  <CardDescription>
                    See how your popup links are performing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ) : links.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Link</p>
                        <p className="text-sm font-medium">My Views</p>
                        <p className="text-sm font-medium">My Clicks</p>
                        <p className="text-sm font-medium">My CTR</p>
                      </div>
                      <div className="space-y-2">
                        {links.map((link) => (
                          <div key={link.id} className="flex items-center justify-between py-2 border-b">
                            <p className="text-sm truncate max-w-[200px]">{link.content ? JSON.parse(link.content).adName || "Unnamed Link" : "Unnamed Link"}</p>
                            <p className="text-sm">{link.views || 0}</p>
                            <p className="text-sm">{link.clicks || 0}</p>
                            <p className="text-sm">
                              {link.views ? Math.round((link.clicks || 0) / link.views * 100) : 0}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No analytics available yet. Create links to start collecting data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
