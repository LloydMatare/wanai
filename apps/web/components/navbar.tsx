"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PlusCircle, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/browse", label: "Browse found" },
  { href: "/report", label: "Report" },
  { href: "/my-reports", label: "My reports" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Solidify the bar once the page has moved, so it reads against content.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div
        className={cn(
          "container mx-auto flex items-center px-4 transition-all duration-300",
          scrolled ? "h-14" : "h-16"
        )}
      >
        <Link href="/" className="group mr-8 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:scale-105">
            <Shield className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight">Wanai</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-brand" />
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/report">
              <PlusCircle />
              Report
            </Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                    <Shield className="h-4 w-4 text-white" />
                  </span>
                  Wanai
                </SheetTitle>
              </SheetHeader>

              <Separator className="my-6" />

              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <Separator className="my-6" />

              <SheetClose asChild>
                <Button asChild variant="gradient" className="w-full">
                  <Link href="/browse">
                    <Search />
                    Browse found documents
                  </Link>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
