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
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";

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
          partialIdentifier: formData.partialIdentifier.slice(-4), // Only last 4 chars
          description: formData.description,
          eventDate: eventTimestamp,
          fullDocumentNumber: formData.fullDocumentNumber,
          dateOfBirth: formData.dateOfBirth || undefined,
        });
      } else {
        await reportFound({
          documentType: formData.documentType,
          city: formData.city,
          location: formData.location,
          partialIdentifier: formData.partialIdentifier.slice(-4),
          description: formData.description,
          eventDate: eventTimestamp,
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
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {type === "lost" ? "Lost" : "Found"} Report Submitted!
          </h3>
          <p className="text-muted-foreground mb-4">
            We'll notify you if we find a match. You can also browse found documents to check for yourself.
          </p>
          <Button onClick={() => {
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
            });
          }}>
            Submit Another Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Report {type === "lost" ? "Lost" : "Found"} Document
          </CardTitle>
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
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              `Report ${type === "lost" ? "Lost" : "Found"} Document`
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}