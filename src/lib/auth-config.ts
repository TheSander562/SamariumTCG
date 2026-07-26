import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { getPrisma } from "@/lib/prisma";

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

function optionalGoogle() {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  if (!clientId || !clientSecret) return null;
  return Google({ clientId, clientSecret });
}

function optionalGitHub() {
  const clientId = process.env.AUTH_GITHUB_ID;
  const clientSecret = process.env.AUTH_GITHUB_SECRET;
  if (!clientId || !clientSecret) return null;
  return GitHub({ clientId, clientSecret });
}

export const authConfig = {
  adapter: isBuildPhase ? undefined : PrismaAdapter(getPrisma()),
  providers: [optionalGoogle(), optionalGitHub()].filter(
    (provider): provider is NonNullable<typeof provider> => provider !== null,
  ),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: isBuildPhase ? "jwt" : "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.theme = user.theme;
        session.user.locale = user.locale;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export function configuredOAuthProviders(): string[] {
  const names: string[] = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    names.push("google");
  }
  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    names.push("github");
  }
  return names;
}
