import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import DashboardClient from "@/app/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const db = getPrisma();

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      emailVerified: true,
      accounts: {
        select: {
          id: true,
          providerId: true,
        },
      },
      passkeys: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const accounts = user?.accounts ?? [];

  return (
    <DashboardClient
      session={session}
      emailVerified={user?.emailVerified ?? false}
      accounts={accounts.map((account) => ({
        providerId: account.providerId,
      }))}
      hasPassword={accounts.some(
        (account) => account.providerId === "credential"
      )}
      passkeys={user?.passkeys ?? []}
    />
  );
}
