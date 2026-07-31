"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import Link from "next/link";

type Props = {
  oidcEnabled: boolean;
  oidcProviderId: string;
  oidcName: string;
  oidcLoginOnly: boolean;
};

export default function SignInForm({
  oidcEnabled,
  oidcProviderId,
  oidcName,
  oidcLoginOnly,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleOIDCSignIn() {
    await authClient.signIn.oauth2({
      providerId: oidcProviderId,
      callbackURL: "/dashboard",
    });
  }

  async function loginWithPasskey() {
    const { error } = await authClient.signIn.passkey();

    if (error) {
      setError(error.message ?? "Passkey login failed.");
      return;
    }

    router.replace("/dashboard");
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (result.error) {
      setError(result.error.message ?? "Something went wrong.");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center mx-auto max-w-md space-y-4 p-6 text-white">
      <h1 className="text-2xl font-bold">
        Sign In
      </h1>

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {oidcEnabled && (
        <button
          type="button"
          onClick={handleOIDCSignIn}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Continue with {oidcName}
        </button>
      )}

      <button
        type="button"
        onClick={loginWithPasskey}
        className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
      >
        Sign in with Passkey
      </button>

      {!oidcLoginOnly && (
        <>
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-neutral-700" />
            <span className="text-sm text-neutral-400">
              or
            </span>
            <div className="h-px flex-1 bg-neutral-700" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4"
          >
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
            />

            <button
              type="submit"
              className="w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200"
            >
              Sign In
            </button>
          </form>
        </>
      )}

      <p className="text-sm text-neutral-400">
        Don&apos;t have an account?&nbsp;
        <Link
          href="/auth/sign-up"
          className="text-white hover:underline"
        >
          Create one
        </Link>
      </p>
    </main>
  );
}
