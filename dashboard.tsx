"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Book, ChevronsRight, LinkIcon, Hash, Star, Copy, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import CreateAdPage from "./create-ad-page"

export default function Dashboard() {
  const [showAdCreation, setShowAdCreation] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">Rite.ly</h1>
              <span className="text-muted-foreground">/ by RiteKit</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Book className="w-4 h-4 mr-2" />
                Publishing
              </Button>
              <Button variant="ghost" size="sm">
                <ChevronsRight className="w-4 h-4 mr-2" />
                Enhance
              </Button>
              <Button variant="ghost" size="sm">
                <LinkIcon className="w-4 h-4 mr-2" />
                Link ads
              </Button>
              <Button variant="ghost" size="sm">
                <Hash className="w-4 h-4 mr-2" />
                Hashtags
              </Button>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Star className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Ad Placement Section */}
        <Card>
          <CardHeader>
            <CardTitle>Place your ad on any link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input placeholder="Enter destination URL" className="flex-1" />
              <Select defaultValue="default">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Button>Create link with ad</Button>
            </div>
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Links</CardTitle>
              <Button variant="secondary">+ Add custom domain</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead>Link clicks</TableHead>
                  <TableHead>Ad clicks</TableHead>
                  <TableHead>% Ad CTR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>http://rite.kit/KY3K</span>
                      <Button variant="ghost" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ads Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ads</CardTitle>
              <Button onClick={() => setShowAdCreation(true)}>+ Create new ad</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad</TableHead>
                  <TableHead>Link clicks</TableHead>
                  <TableHead>Ad views</TableHead>
                  <TableHead>Ad Clicks</TableHead>
                  <TableHead>% Ad CTR</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Sample Ad Campaign</TableCell>
                  <TableCell>125</TableCell>
                  <TableCell>1,250</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>1.2%</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Holiday Promotion</TableCell>
                  <TableCell>89</TableCell>
                  <TableCell>890</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>1.3%</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div>
              <h3 className="font-semibold mb-4">WEB APPS</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    RiteTag
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    RiteBoost
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    RiteKit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Rite.ly
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">EXTENSIONS</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Chrome
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Firefox
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Edge
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">MOBILE APPS</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    iOS App
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Android App
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Windows Phone
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">FOR DEVELOPERS</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    SDKs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Webhooks
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Status Page
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">GENERAL</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">STAY IN TOUCH</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RiteKit. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {showAdCreation && <CreateAdPage onClose={() => setShowAdCreation(false)} />}
    </div>
  )
}
