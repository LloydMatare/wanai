# Wanai Documents App — Project Plan

A platform to help people find lost national IDs, driver's licences, passports, and
other documents, built with React Native (Expo), Next.js, Convex, shadcn/ui, and Clerk.

## 1. Scope

- **Launch market:** Zimbabwe only (single country/region for v1)
- **Platforms:** Mobile (Expo) + Web (Next.js), sharing one Convex backend
- **Document types:** National ID, driver's licence, passport, vehicle registration, other

## 2. Tech stack

| Layer | Choice | Role |
|---|---|---|
| Mobile | React Native (Expo) | Reporting on the go, camera capture, push notifications |
| Web | Next.js | Browsing, admin dashboard, SEO-friendly public pages |
| Backend | Convex | Database, server functions, file storage, real-time sync |
| Auth | Clerk | Shared identity across mobile + web via JWT template |
| UI (web) | shadcn/ui | Component library |
| UI (mobile) | NativeWind or react-native-reusables | shadcn-style parity on Expo |

## 3. Architecture overview

```
Expo (mobile)  ─┐
                 ├─→ Clerk (shared auth) ─→ Convex (DB, functions, storage, real-time)
Next.js (web)  ─┘
```

Both clients authenticate through Clerk, then talk to the same Convex deployment.
Convex pushes real-time updates (new matches, messages) back to whichever client
is open.

## 4. Data model (Convex)

- **users** — synced from Clerk (name, phone, avatar, role)
- **items** — public-safe listing data: kind (lost/found), document type, country,
  city, location, partial identifier (last 4 chars only), description, event date,
  photo, status
- **verificationSecrets** — full document number + DOB, write-once by the lost-item
  reporter, never exposed to client queries
- **matches** — system-suggested or confirmed links between a lost and found item,
  with a confidence score
- **messages** — unlocked after verification, so finder and claimant can coordinate
  handover without exposing phone numbers up front
- **notifications** — real-time alerts for matches, verification results, messages

## 5. Core flows

1. **Report** — lost or found, with photo, document type, location, date
2. **Auto-suggest matching** — a Convex function scores new items against open
   opposite-kind items (date proximity, city, partial ID overlap); matches above
   threshold notify both parties; either side can confirm interest or reject
3. **Verification** — claimant submits full document number + DOB; a Convex action
   compares it server-side against the stored secret and returns only true/false;
   locks after 3 failed attempts and routes to admin review
4. **Handover** — verified match unlocks in-app messaging / WhatsApp contact
5. **Admin moderation** — review flagged posts, locked/disputed claims, stale listings

## 6. Build phases

1. Foundations — Clerk auth wired into both apps, Convex schema + CRUD
2. Core reporting flow — forms, photo upload, listing feed
3. Matching + verification — scoring function, verification action
4. Notifications — real-time subscriptions, Expo push, in-app chat
5. Admin dashboard — moderation, disputed claims, cleanup
6. Polish — rate limiting, abuse reporting, analytics

## 7. Features to make it stand out

**Trust & credibility**
- Partner with police / Registrar-General's office for informal notification ties
- "Verified finder" badge for institutions (banks, schools, transport companies, malls)
  that consistently report found items
- Public trust stats on the landing page (e.g. "1,240 documents reunited since launch")

**Reach & accessibility**
- WhatsApp bot front-end (report/search via chat) alongside the app — likely higher
  reach than the app alone in this market
- Offline-friendly reporting — queue reports locally on patchy data connections, sync
  when back online
- SMS/USSD fallback for users without smartphones
- Shona and Ndebele language support, especially for verification prompts

**Practical**
- Institutional drop-off points (bus terminuses, banks, malls) shown on a map as
  physical found-document collection points

## 8. AI integration suggestions

1. **Photo → auto-fill (highest priority)** — vision model extracts document type,
   last-4-digits, and first name from a found-document photo, cutting reporting
   friction and typo-driven match misses. Full extracted data must be truncated
   before it ever reaches a client-readable field.
2. **Semantic matching layer** — embed free-text descriptions and use similarity
   as an extra signal in the matching function, catching matches structured
   fields alone would miss.
3. **AI-assisted flow support** — a lightweight chat assistant to guide users
   through reporting/claiming steps. UX only — never used for actual identity
   verification, which stays in the deterministic Convex verification action.
4. **Fraud/spam detection** — flag suspicious posting patterns (bulk found-item
   posts, copy-pasted descriptions) and route to admin review instead of
   auto-publishing.

**Recommended first priorities:** photo auto-fill + WhatsApp integration — both
directly reduce friction and widen reach for the target users.

## 9. Naming shortlist

- **FoundID** — short, memorable, credible
- **ID Return ZW** — literal, trust-forward
- **Tsvaga** — Shona for "search/look for"
- **Dzoka** — Shona for "return/come back"
- **Retrieve263** — subtle local marker (263 = Zimbabwe country code)
- **Backpocket** — evokes "where your ID should be"

Check domain (`.co.zw` / `.com`) and app store availability before committing.
Consider keeping "Zimbabwe"/"ZW" as a tagline rather than baked into the core
brand, to leave room for future multi-country expansion.

## 10. Next steps

- [ ] Pick app name and check domain/app-store availability
- [ ] Build the report form (mobile: camera + form; web: form + optional photo)
- [ ] Build match-confirmation + verification UI
- [ ] Add admin route gated by `role === "admin"`
- [ ] Wire Expo push + WhatsApp deep link as post-verification contact method
- [ ] Scope and prototype photo auto-fill (vision AI) action
