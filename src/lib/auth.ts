import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";
import { getPrisma } from "@/lib/prisma";

export function getAuth() {
  return betterAuth({
    database: prismaAdapter(getPrisma(), {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      genericOAuth({
        config: [
          {
              providerId: process.env.AUTH_OIDC_ISSUER!,
              clientId: process.env.AUTH_OIDC_CLIENT_ID!,
              clientSecret: process.env.AUTH_OIDC_CLIENT_SECRET!,
              discoveryUrl: `${process.env.AUTH_OIDC_ISSUER}/.well-known/openid-configuration`,
              scopes: (process.env.AUTH_OIDC_SCOPE ?? "openid profile email").trim().split(/\s+/),
          },
        ]
      })
    ],
  });
}
