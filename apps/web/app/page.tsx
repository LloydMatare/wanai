"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, PlusCircle, Shield, Users, ArrowRight } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Lost Documents
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Wanai helps Zimbabweans reunite with lost national IDs, driver's licenses,
            passports, and other important documents. Report lost or found items and
            get notified when there's a match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link href="/sign-in">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/report">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Report Document
                </Button>
              </Link>
            </SignedIn>
            <Link href="/browse">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <Search className="w-5 h-5 mr-2" />
                Browse Found
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">1,240+</div>
              <p className="text-muted-foreground">Documents Reunited</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <p className="text-muted-foreground">Active Listings</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">10</div>
              <p className="text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-blue-600">1</span>
                </div>
                <CardTitle>Report</CardTitle>
                <CardDescription>
                  Report a lost or found document with details like location, date, and any visible identifiers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-blue-600">2</span>
                </div>
                <CardTitle>Get Matched</CardTitle>
                <CardDescription>
                  Our system automatically suggests matches based on document type, location, and identifiers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-blue-600">3</span>
                </div>
                <CardTitle>Reunite</CardTitle>
                <CardDescription>
                  Verify ownership with secure questions and coordinate handover through our platform.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-4">What We Help Find</h2>
          <p className="text-muted-foreground text-center mb-12">
            We help reunite all types of identity documents
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "National ID",
              "Driver's License",
              "Passport",
              "Vehicle Registration",
            ].map((type) => (
              <Card key={type} className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">{type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Help?</h2>
          <p className="mb-8 opacity-90">
            Whether you've found a document or lost one, your action can help someone
            avoid the stress and inconvenience of replacing important identification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link href="/sign-in">
                <Button size="lg" variant="secondary" className="text-lg">
                  Sign In to Report
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/report">
                <Button size="lg" variant="secondary" className="text-lg">
                  Report Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>
    </main>
  );
}