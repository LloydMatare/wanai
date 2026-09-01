# Lost & Found Documents (Zimbabwe)

Monorepo layout:

```
lost-found-app/
  convex/           shared backend — used by BOTH apps/web and apps/mobile
    schema.ts
    users.ts
    items.ts
    matches.ts
    verification.ts
    verificationInternal.ts
    notifications.ts
    auth.config.ts
  apps/
    web/            Next.js app (browsing, admin, SEO landing pages)
    mobile/          Expo app (reporting on the go, push notifications)
```

Both apps point at the **same** Convex deployment, so a report made on mobile
shows up instantly on web and vice versa.

## 1. Convex

```bash
cd lost-found-app
npm install convex
npx convex dev        # creates a dev deployment, prints NEXT_PUBLIC_CONVEX_URL
```

Keep `npx convex dev` running while you build — it hot-reloads schema and
function changes and gives you a dashboard link to inspect data.

## 2. Clerk

1. Create an application at https://dashboard.clerk.com
2. In Clerk, add a **JWT template** named `convex` (Clerk has a built-in
   Convex template preset) — this is what `convex/auth.config.ts` validates.
3. Copy the issuer domain into `CLERK_JWT_ISSUER_DOMAIN` for Convex:
   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-app.clerk.accounts.dev
   ```
4. Grab your publishable + secret keys for both apps' env files.

## 3. Web app (Next.js)

```bash
cd apps/web
npm install
cp .env.local.example .env.local   # fill in Convex + Clerk keys
npx shadcn@latest init             # pick your style, this wires up components.json + tailwind
npm run dev
```

`app/browse/page.tsx` is a working example of a real-time query
(`useQuery(api.items.listOpen, ...)`) — the list updates live as new found
items are reported, no refresh needed.

## 4. Mobile app (Expo)

Not scaffolded here since it needs `npx create-expo-app`, but it reuses the
exact same `convex/` folder. Steps:

```bash
npx create-expo-app apps/mobile
cd apps/mobile
npm install convex @clerk/clerk-expo expo-secure-store expo-notifications expo-image-picker
```

Wire Convex + Clerk the same way as web, using Expo's secure token cache:

```tsx
// apps/mobile/app/_layout.tsx
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

For UI parity with the shadcn web components, use **NativeWind**
(Tailwind for React Native) or **react-native-reusables** (a shadcn-style
component set built for Expo) — both read the same design tokens you set up
in `apps/web/tailwind.config.ts`.

For push notifications: call `expo-notifications` to register a push token
on sign-in, store it on the `users` row (add a `pushToken` field), and send
from a Convex action using Expo's push API when a `notifications` row is
inserted.

## Backend module guide

| File | Purpose |
|---|---|
| `schema.ts` | All tables. `verificationSecrets` is the only table holding full document numbers — never queried from the client. |
| `items.ts` | Report a lost/found item, browse open listings, generate photo upload URLs. |
| `matches.ts` | Scores new items against open opposite-kind items, writes `matches` rows above threshold, lets users confirm/reject a suggestion. |
| `verification.ts` + `verificationInternal.ts` | The claim-verification action. Compares a claimant's submitted document number/DOB against the stored secret server-side, locks after 3 failed attempts. |
| `notifications.ts` | Real-time unread notifications feed for the bell icon / push trigger. |

## Next build steps

1. Flesh out the report form (mobile: camera + form; web: form + optional photo)
2. Build the match-confirmation + verification UI (`confirmInterest` → prompt for document number → `verifyClaim` action)
3. Add an admin route (`/admin`) gated by `role === "admin"` for manual review of locked/disputed claims
4. Wire Expo push + WhatsApp deep link (`https://wa.me/263...`) as the post-verification contact method
