import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth, twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey"
import { getPrisma } from "@/lib/prisma";

export function getAuth() {
  return betterAuth({
    database: prismaAdapter(getPrisma(), {
      provider: "postgresql",
    }),
    appName: "SamariumTCG",
    emailAndPassword: {
      enabled: true,
      resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
      sendResetPassword: async ({user, url}) => {
        // await sendResetPasswordEmail(
        // 	user.name,
        //   user.email,
        //   url,
        // );
        return;
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60,
      },
    },
    plugins: [
      twoFactor({
        issuer: "SamariumTCG",
        totpOptions: {
          period: 30, // seconds
          digits: 6,
        },
        backupCodeOptions: {
          amount: 0,
        }
      }),
      passkey({
        rpID: new URL(process.env.BETTER_AUTH_URL!).hostname,
        rpName: "SamariumTCG",
        origin: process.env.BETTER_AUTH_URL,
      }),
      genericOAuth({
        config: [
          {
              providerId: process.env.AUTH_OIDC_PROVIDER_ID!,
              clientId: process.env.AUTH_OIDC_CLIENT_ID!,
              clientSecret: process.env.AUTH_OIDC_CLIENT_SECRET!,
              discoveryUrl: `${process.env.AUTH_OIDC_ISSUER}/.well-known/openid-configuration`,
              scopes: (process.env.AUTH_OIDC_SCOPE || "openid profile email groups offline_access").trim().split(/\s+/),
          },
        ]
      })
    ],
    account: {
        accountLinking: {
            enabled: true, 
            updateUserInfoOnLink: true,
            trustedProviders: [
              process.env.AUTH_OIDC_PROVIDER_ID!
            ]
        }
    },
  });
}
