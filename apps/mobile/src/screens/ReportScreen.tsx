import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useMutation } from "convex/react";
import { api } from "../../lib/convex-api";
import { colors } from "../lib/theme";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { Select } from "../components/ui/Select";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { Camera, CheckCircle, Trash2, Loader2 } from "lucide-react-native";
import { CITIES, DOCUMENT_TYPES } from "../lib/constants";
import { useImageUploader } from "../lib/uploadthing";

export function ReportScreen() {
  const [kind, setKind] = useState<"lost" | "found">("found");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
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

  const reportLost = useMutation(api.items.reportLost as any);
  const reportFound = useMutation(api.items.reportFound as any);

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) {
        setPhotoUrl(res[0].ufsUrl);
      }
    },
    onUploadError: (err) => {
      setError(err.message || "Photo upload failed");
    },
  });

  const pickPhoto = () => {
    openImagePicker({
      source: "library",
      onInsufficientPermissions: () => {
        Alert.alert(
          "Permission needed",
          "Allow photo access to attach a document photo.",
        );
      },
    });
  };

  const handleSubmit = async () => {
    if (!form.documentType || !form.city || !form.location || !form.eventDate) {
      setError("Please fill in the required fields.");
      return;
    }
    if (kind === "lost" && !form.fullDocumentNumber) {
      setError("Please enter your full document number for verification.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const eventDate = new Date(form.eventDate).getTime();
      const partialIdentifier = form.partialIdentifier.slice(-4).toUpperCase();

      if (kind === "lost") {
        await reportLost({
          documentType: form.documentType,
          city: form.city,
          location: form.location,
          partialIdentifier,
          description: form.description,
          eventDate,
          fullDocumentNumber: form.fullDocumentNumber,
          dateOfBirth: form.dateOfBirth || undefined,
          phone: form.phone || undefined,
          photoUrl: photoUrl || undefined,
        });
      } else {
        await reportFound({
          documentType: form.documentType,
          city: form.city,
          location: form.location,
          partialIdentifier,
          description: form.description,
          eventDate,
          phone: form.phone || undefined,
          photoUrl: photoUrl || undefined,
        });
      }
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle size={32} color={colors.success} />
        </View>
        <Text className="mt-5 text-xl font-bold text-foreground">
          {kind === "lost" ? "Lost" : "Found"} report submitted
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          We'll notify you as soon as we find a match. You can browse documents in
          the meantime.
        </Text>
        <View className="mt-6 w-full">
          <Button
            title="Submit another report"
            variant="outline"
            onPress={() => {
              setSubmitted(false);
              setPhotoUrl(null);
              setForm({
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
            }}
          />
        </View>
      </View>
    );
  }

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-10"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-2xl font-bold text-foreground">
        Report a document
      </Text>
      <Text className="mt-1 text-sm text-muted-foreground">
        Share only a partial identifier. We handle matching and verification.
      </Text>

      <View className="mt-4">
        <SegmentedControl
          value={kind}
          onChange={(v) => setKind(v as "lost" | "found")}
          options={[
            { value: "found", label: "I found one" },
            { value: "lost", label: "I lost one" },
          ]}
        />
      </View>

      <View className="mt-4 gap-4">
        <Select
          label="Document type"
          value={form.documentType}
          onValueChange={(v) => set("documentType", v)}
          placeholder="Select document type"
          options={DOCUMENT_TYPES.map((d) => ({ value: d.value, label: d.label }))}
        />

        <Select
          label="City"
          value={form.city}
          onValueChange={(v) => set("city", v)}
          placeholder="Select city"
          options={CITIES.map((c) => ({ value: c, label: c }))}
        />

        <FormField
          label={kind === "lost" ? "Where did you lose it?" : "Where did you find it?"}
          placeholder="e.g. Borrowdale Road, OK Mart"
          value={form.location}
          onChangeText={(v) => set("location", v)}
        />

        <FormField
          label={kind === "lost" ? "Last 4 digits of ID number" : "Visible digits (if any)"}
          placeholder="Last 4 characters"
          maxLength={4}
          autoCapitalize="characters"
          value={form.partialIdentifier}
          onChangeText={(v) => set("partialIdentifier", v)}
          hint="Only the last 4 digits are shown publicly."
        />

        <FormField
          label={kind === "lost" ? "When did you lose it?" : "When did you find it?"}
          placeholder="YYYY-MM-DD"
          value={form.eventDate}
          onChangeText={(v) => set("eventDate", v)}
        />

        <FormField
          label="Additional description"
          placeholder="Any other details that might help identify the document..."
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={form.description}
          onChangeText={(v) => set("description", v)}
          containerClassName="min-h-[90px]"
        />

        <FormField
          label="Phone number"
          placeholder="+263 77 123 4567"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => set("phone", v)}
          hint="So people who find your document can reach you."
        />

        {kind === "lost" ? (
          <>
            <FormField
              label="Full document number"
              placeholder="Your full ID/passport number"
              value={form.fullDocumentNumber}
              onChangeText={(v) => set("fullDocumentNumber", v)}
              hint="Required for verification. Stored securely, never shown publicly."
            />
            <FormField
              label="Date of birth (optional)"
              placeholder="YYYY-MM-DD"
              value={form.dateOfBirth}
              onChangeText={(v) => set("dateOfBirth", v)}
            />
          </>
        ) : null}

        {/* Photo upload */}
        <View className="gap-1.5">
          <Text className="text-sm font-semibold text-foreground">
            Photo (optional)
          </Text>
          {photoUrl ? (
            <View className="overflow-hidden rounded-xl">
              <Image
                source={{ uri: photoUrl }}
                className="h-48 w-full"
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setPhotoUrl(null)}
                className="absolute right-2 top-2 h-9 w-9 items-center justify-center rounded-full bg-black/60"
              >
                <Trash2 size={18} color={colors.white} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={pickPhoto}
              disabled={isUploading}
              className="h-24 items-center justify-center rounded-xl border border-dashed border-input bg-card"
            >
              {isUploading ? (
                <Loader2 size={28} color={colors.mutedForeground} className="animate-spin" />
              ) : (
                <Camera size={28} color={colors.mutedForeground} />
              )}
              <Text className="mt-2 text-sm text-muted-foreground">
                {isUploading ? "Uploading..." : "Add a photo of the document"}
              </Text>
            </Pressable>
          )}
        </View>

        {error ? (
          <View className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        ) : null}

        <Button
          title={submitting ? "Submitting..." : `Report ${kind} document`}
          onPress={handleSubmit}
          loading={submitting}
        />
      </View>
    </ScrollView>
  );
}
