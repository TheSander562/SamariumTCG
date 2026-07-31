"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

type Props = {
  session: unknown;
};

export function LandingButtons({ session }: Props) {
  const router = useRouter();
  async function handleSignOut() {
    await signOut();

    router.replace("/");
  }

  if (session) {
    return (
      <>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-md bg-white px-6 py-2 font-medium text-black hover:bg-gray-200"
        >
          Dashboard
        </button>

        <button
          onClick={handleSignOut}
          className="rounded-md border border-white px-6 py-2 font-medium text-white hover:bg-neutral-800"
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => router.push("/sign-up")}
        className="rounded-md bg-white px-6 py-2 font-medium text-black hover:bg-gray-200"
      >
        Sign Up
      </button>

      <button
        onClick={() => router.push("/sign-in")}
        className="rounded-md border border-white px-6 py-2 font-medium text-white hover:bg-neutral-800"
      >
        Sign In
      </button>
    </>
  );
}
