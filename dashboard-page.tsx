"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">popiup</h1>
          <Button variant="ghost" asChild>
            <Link href="/create">Create New Ad</Link>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <p className="text-muted-foreground mb-6">
          Manage your ads and view statistics.
        </p>
        <Button asChild>
          <Link href="/create">Create New Ad</Link>
        </Button>
      </main>
    </div>
  );
}
