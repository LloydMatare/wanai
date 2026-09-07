"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, AlertCircle, CheckCircle, ImageIcon } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

const DOCUMENT_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "passport", label: "Passport" },
  { value: "vehicle_registration", label: "Vehicle Registration" },
  { value: "other", label: "Other" },
];

const CITIES = [
  "Harare", "Bulawayo", "Chinhoyi", "Mutare", "Gweru",
  "Masvingo", "Kwekwe", "Kadoma", "Marondera", "Bindura", "Other"
];

interface ReportFormProps {
  type: "lost" | "found";
}

export function ReportForm({ type }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    documentType: "",
    city: "",
    location: "",
    partialIdentifier: "",
    description: "",
    eventDate: new Date().toISOString().split("T")[0],
    // Only for lost items
    fullDocumentNumber: "",
    dateOfBirth: "",
    phone: "",
  });

  const reportLost = useMutation(api.items.reportLost);
  const reportFound = useMutation(api.items.reportFound);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const eventTimestamp = new Date(formData.eventDate).getTime();

      if (type === "lost") {
        await reportLost({
          documentType: formData.documentType,
          city: formData.city,
          location: formData.location,
          partialIdentifier: formData.partialIdentifier.slice(-4),
          description: formData.description,
          eventDate: eventTimestamp,
          fullDocumentNumber: formData.fullDocumentNumber,
          dateOfBirth: formData.dateOfBirth || undefined,
          phone: formData.phone || undefined,
          photoUrl: photoUrl || undefined,
        });
      } else {
        await reportFound({
          documentType: formData.documentType,
          city: formData.city,
          location: formData.location,
          partialIdentifier: formData.partialIdentifier.slice(-4),
          description: formData.description,
          eventDate: eventTimestamp,
          phone: formData.phone || undefined,
          photoUrl: photoUrl || undefined,
        });
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card variant="glow" className="mx-auto max-w-lg">
        <CardContent className="flex flex-col items-center pt-10 pb-10 text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
            <CheckCircle className="h-7 w-7" />
          </span>
          <h3 className="text-xl font-semibold">
            {type === "lost" ? "Lost" : "Found"} report submitted
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We&apos;ll notify you as soon as we find a match. You can also browse found
            documents yourself in the meantime.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                documentType: "",
                city: "",
                location: "",
                partialIdentifier: "",
                description: "",
                eventDate: new Date().toISOString().split("T")[0],
                fullDocumentNumber: "",
                dateOfBirth: "",
                phone: "",
              });
              setPhotoUrl(null);
            }}
          >
            Submit another report
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Report {type === "lost" ? "lost" : "found"} document</CardTitle>
          <Badge variant={type === "lost" ? "destructive" : "success"}>
            {type === "lost" ? "Lost" : "Found"}
          </Badge>
        </div>
        <CardDescription>
          {type === "lost"
            ? "We'll help you find your document. Enter the last 4 digits of your ID number."
            : "Help someone reunite with their document. Enter any visible digits."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type *</Label>
            <Select
              value={formData.documentType}
              onValueChange={(v) => setFormData({ ...formData, documentType: v })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((doc) => (
                  <SelectItem key={doc.value} value={doc.value}>
                    {doc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Select
              value={formData.city}
              onValueChange={(v) => setFormData({ ...formData, city: v })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              {type === "lost" ? "Where did you lose it?" : "Where did you find it?"} *
            </Label>
            <Input
              id="location"
              placeholder="e.g., Borrowdale Road, OK Mart"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partialIdentifier">
              {type === "lost" ? "Last 4 digits of ID number" : "Visible digits (if any)"}
            </Label>
            <Input
              id="partialIdentifier"
              placeholder="Last 4 characters"
              maxLength={4}
              value={formData.partialIdentifier}
              onChange={(e) => setFormData({ ...formData, partialIdentifier: e.target.value.toUpperCase() })}
            />
            <p className="text-xs text-muted-foreground">
              Only last 4 digits will be displayed publicly
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">
              {type === "lost" ? "When did you lose it?" : "When did you find it?"} *
            </Label>
            <Input
              id="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Description</Label>
            <Textarea
              id="description"
              placeholder="Any other details that might help identify the document..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+263 77 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              So people who find your document can reach you.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Photo of document</Label>
            {photoUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <Image
                  src={photoUrl}
                  alt="Uploaded document"
                  width={400}
                  height={200}
                  className="h-48 w-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 bg-background/80 backdrop-blur"
                  onClick={() => setPhotoUrl(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border p-6 text-center">
                <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="mb-3 text-sm text-muted-foreground">
                  Upload a photo of the document to help with identification
                </p>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { ufsUrl: string }[]) => {
                    if (res?.[0]?.ufsUrl) setPhotoUrl(res[0].ufsUrl);
                  }}
                  onUploadError={(error: Error) => {
                    setError(error.message);
                  }}
                />
              </div>
            )}
          </div>

          {type === "lost" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullDocumentNumber">Full Document Number *</Label>
                <Input
                  id="fullDocumentNumber"
                  placeholder="Your full ID/passport number"
                  value={formData.fullDocumentNumber}
                  onChange={(e) => setFormData({ ...formData, fullDocumentNumber: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Required for verification. Stored securely, never shown publicly.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth (optional)</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              `Report ${type === "lost" ? "lost" : "found"} document`
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}