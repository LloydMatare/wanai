# Modernize UI with Shadcn, Three.js, and GSAP

## Context
The user wants to modernize the UI of the `wanai` application, which is currently a functional but "plain" Next.js web application. The goal is to:
1. Replace standard components with Shadcn UI for a more modern appearance.
2. Integrate GSAP for smooth page transitions and interaction animations.
3. Incorporate Three.js for visual enhancements (e.g., interactive backgrounds on the landing page).

The project already has these dependencies in `apps/web/package.json`.

## Implementation Strategy
- **Phase 1: Setup and Theming**
  - Ensure Tailwind CSS configuration is clean and set up for Shadcn (using `components.json` or equivalent patterns).
  - Define a global animation framework using GSAP (context Provider or utility hooks).
  - Setup a base `Three.js` scene component template to be reused on the homepage.
- **Phase 2: Component Refinement**
  - Migrate the existing Navbar (`apps/web/components/navbar.tsx`) to use Shadcn `navigation-menu` or similar.
  - Refactor cards and buttons in `apps/web/app/page.tsx` as needed.
- **Phase 3: Animation Integration**
  - Add GSAP scroll and entrance animations to the homepage hero and stats sections.
  - Integrate a subtle Three.js Canvas background into the Hero section to add depth.
- **Phase 4: Site-Wide Consistency**
  - Apply updated Shadcn components to Browse Found, Report, and Auth pages.

## Verification
- Test all pages for responsiveness after component migration.
- Verify Three.js scene loads correctly without blocking main thread interactions.
- Ensure animations are smooth across browsers.
