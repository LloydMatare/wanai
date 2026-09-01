"use client";

import { useState } from "react";
import { ReportForm } from "@/components/report-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export default function ReportPage() {
  const { user } = useUser();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <SignedOut>
        <Card className="max-w-md mx-auto mt-12">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to sign in to report a lost or found document.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/sign-in" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/browse" className="w-full">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Browse Found Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </SignedOut>

      <SignedIn>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Report a Document</h1>
          <p className="text-muted-foreground">
            Help reunite someone with their important document
          </p>
        </div>

        <Tabs defaultValue="found" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="found">I Found a Document</TabsTrigger>
            <TabsTrigger value="lost">I Lost a Document</TabsTrigger>
          </TabsList>

          <TabsContent value="found">
            <ReportForm type="found" />
          </TabsContent>

          <TabsContent value="lost">
            <ReportForm type="lost" />
          </TabsContent>
        </Tabs>
      </SignedIn>
    </main>
  );
}