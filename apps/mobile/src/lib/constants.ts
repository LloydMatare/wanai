export const DOCUMENT_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "passport", label: "Passport" },
  { value: "vehicle_registration", label: "Vehicle Registration" },
  { value: "other", label: "Other" },
] as const;

export const DOCUMENT_LABELS: Record<string, string> = {
  national_id: "National ID",
  drivers_license: "Driver's licence",
  passport: "Passport",
  vehicle_registration: "Vehicle registration",
  other: "Other document",
};

export const CITIES = [
  "Harare",
  "Bulawayo",
  "Chinhoyi",
  "Mutare",
  "Gweru",
  "Masvingo",
  "Kwekwe",
  "Kadoma",
  "Marondera",
  "Bindura",
  "Other",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  matched: "Matched",
  pending_verification: "Pending verification",
  claimed: "Claimed",
  closed: "Closed",
};

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDocType(value: string): string {
  return DOCUMENT_LABELS[value] || value.replace(/_/g, " ");
}
