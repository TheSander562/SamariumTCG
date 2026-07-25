import type { Theme, UserRole } from "@/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      theme: Theme;
      locale: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    theme: Theme;
    locale: string;
  }
}
