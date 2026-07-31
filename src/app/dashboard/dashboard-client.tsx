"use client";

import { useRouter } from "next/navigation";
import SignOutButton from "@/app/dashboard/sign-out-button";

type Props = {
  session: {
    user: {
      name?: string | null;
      email: string;
    };
  };
};

export default function DashboardClient({ session }: Props) {
  const router = useRouter();
  const { user } = session;

  return (
    <main className="mx-auto flex h-screen max-w-md flex-col items-center justify-center space-y-4 p-6 text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>Welcome, {user.name || "User"}!</p>

      <p>Email: {user.email}</p>

      <button
        onClick={() => router.push("/")}
        className="w-full rounded-md border border-neutral-700 px-4 py-2 font-medium hover:bg-neutral-800"
      >
        Go Home
      </button>

      <SignOutButton />
    </main>
  );
}
