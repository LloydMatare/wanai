import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public: browsing listings and auth pages. Everything else requires sign-in.
const isPublicRoute = createRouteMatcher([
  "/",
  "/browse(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
