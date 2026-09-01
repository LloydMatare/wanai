export default {
  providers: [
    {
      // Value of your Clerk JWT template issuer domain, e.g.
      // https://your-app-name.clerk.accounts.dev
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
