"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();

    router.replace("/");
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200"
    >
      Sign Out
    </button>
  );
}
