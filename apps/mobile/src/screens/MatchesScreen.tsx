import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../lib/convex-api";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { FormField } from "../components/ui/FormField";
import { HeartHandshake, MapPin, PackageSearch, X } from "lucide-react-native";
import { formatDate, formatDocType } from "../lib/constants";

interface MatchRow {
  matchId: string;
  status: string;
  score: number;
  verificationAttempts: number;
  lostItem: any;
  foundItem: any;
}

export function MatchesScreen() {
  const [verifyTarget, setVerifyTarget] = useState<MatchRow | null>(null);

  const matches = useQuery(api.matches.forUser);
  const confirmInterest = useMutation(api.matches.confirmInterest as any);
  const rejectMatch = useMutation(api.matches.reject as any);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="border-b border-slate-200 bg-white px-4 pb-3 pt-4">
        <Text className="text-2xl font-bold text-slate-900">Matches</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Possible connections between your reports and others
        </Text>
      </View>

      {matches === undefined ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-400">Loading matches...</Text>
        </View>
      ) : matches.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <HeartHandshake size={26} color="#1e40af" />
          </View>
          <Text className="text-center text-lg font-semibold text-slate-800">
            No matches yet
          </Text>
          <Text className="text-center text-sm text-slate-500">
            When we find a possible match for one of your reports, it will appear
            here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(m) => m.matchId}
          contentContainerClassName="px-4 pb-8 gap-3"
          renderItem={({ item }) => {
            const otherItem = item.foundItem || item.lostItem;

            return (
              <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <View className="flex-row items-center gap-2">
                  <Badge
                    label={matchStatusLabel(item.status)}
                    tone={matchStatusTone(item.status)}
                  />
                  <Badge
                    label={`${item.score}% match`}
                    tone="primary"
                    className="ml-auto"
                  />
                </View>

                <View className="mt-3 gap-1">
                  <Text className="text-sm font-bold text-slate-900">
                    {formatDocType(otherItem.documentType)}
                  </Text>
                  <View className="flex-row items-center gap-1.5">
                    <MapPin size={14} color="#64748b" />
                    <Text className="text-sm text-slate-600">
                      {otherItem.city}
                      {otherItem.location ? ` · ${otherItem.location}` : ""}
                    </Text>
                  </View>
                  <Text className="text-sm text-slate-500">
                    {otherItem.eventDate ? formatDate(otherItem.eventDate) : ""}
                  </Text>
                  {otherItem.partialIdentifier ? (
                    <Text className="text-sm font-medium text-slate-800 tabular-nums">
                      …{otherItem.partialIdentifier}
                    </Text>
                  ) : null}
                </View>

                {item.status === "suggested" ? (
                  <View className="mt-3 flex-row gap-2">
                    <Button
                      title="Looks like mine"
                      size="sm"
                      className="flex-1"
                      onPress={() => confirmInterest({ matchId: item.matchId })}
                    />
                    <Button
                      title="Not mine"
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onPress={() => rejectMatch({ matchId: item.matchId })}
                    />
                  </View>
                ) : item.status === "pending_verification" ? (
                  <View className="mt-3">
                    <Button
                      title="Verify identity"
                      size="sm"
                      onPress={() => setVerifyTarget(item)}
                    />
                  </View>
                ) : item.status === "verified" ? (
                  <View className="mt-3 rounded-xl bg-green-50 p-3">
                    <Text className="text-sm font-medium text-green-700">
                      Verified! Arrange a handover to reunite the documents.
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
      )}

      <VerifyModal
        match={verifyTarget}
        onClose={() => setVerifyTarget(null)}
      />
    </View>
  );
}

function VerifyModal({ match, onClose }: { match: MatchRow | null; onClose: () => void }) {
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; locked: boolean } | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  const verifyClaim = useAction(api.verification.verifyClaim as any);

  const submit = async () => {
    if (!match) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyClaim({
        matchId: match.matchId,
        submittedDocumentNumber: number,
        submittedDateOfBirth: dob || undefined,
      });
      setResult(res);
      if (!res.success) {
        setAttemptsLeft(Math.max(0, 3 - (match.verificationAttempts + 1)));
      }
    } catch (e: any) {
      setResult({ success: false, locked: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={!!match} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable className="rounded-t-3xl bg-white p-5 pb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">Verify identity</Text>
            <Pressable onPress={onClose} className="h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <X size={18} color="#64748b" />
            </Pressable>
          </View>

          {result && result.success ? (
            <View className="items-center py-6">
              <PackageSearch size={40} color="#16a34a" />
              <Text className="mt-3 text-lg font-bold text-green-700">Identity verified</Text>
              <Text className="mt-1 text-center text-sm text-slate-500">
                Ownership confirmed. The document is now marked as claimed.
              </Text>
              <View className="mt-4 w-full">
                <Button title="Done" onPress={onClose} />
              </View>
            </View>
          ) : (
            <>
              <Text className="mb-3 text-sm text-slate-500">
                Enter the full document number (and date of birth if you have it) to
                confirm this is yours.
              </Text>
              <View className="gap-3">
                <FormField
                  label="Full document number"
                  placeholder="e.g. 63-1234567A56"
                  value={number}
                  onChangeText={setNumber}
                  autoCapitalize="characters"
                />
                <FormField
                  label="Date of birth (optional)"
                  placeholder="YYYY-MM-DD"
                  value={dob}
                  onChangeText={setDob}
                />
              </View>

              {result && !result.success ? (
                <View className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                  <Text className="text-sm text-red-600">
                    {result.locked
                      ? "Too many attempts. This case has been locked for admin review."
                      : attemptsLeft !== null
                      ? `Verification failed. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`
                      : "Verification failed. Check the details and try again."}
                  </Text>
                </View>
              ) : null}

              <View className="mt-4 flex-row gap-2">
                <Button title="Cancel" variant="outline" className="flex-1" onPress={onClose} disabled={loading} />
                <Button title="Verify" className="flex-1" onPress={submit} loading={loading} />
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function matchStatusLabel(status: string): string {
  switch (status) {
    case "suggested":
      return "Suggested";
    case "pending_verification":
      return "Pending verification";
    case "verified":
      return "Verified";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

function matchStatusTone(status: string): "primary" | "success" | "danger" | "neutral" {
  switch (status) {
    case "suggested":
      return "primary";
    case "pending_verification":
      return "neutral";
    case "verified":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "neutral";
  }
}
