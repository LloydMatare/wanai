"use client";

import Link from "next/link";
import { useAuth, UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Shield } from "lucide-react";

export function Navbar() {
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-bold text-xl">Wanai</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/browse" className="transition-colors hover:text-foreground/80">
              Browse Found
            </Link>
            {userId && (
              <Link href="/my-reports" className="transition-colors hover:text-foreground/80">
                My Reports
              </Link>
            )}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Sign In</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Started</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/report">
              <Button variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Report
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}