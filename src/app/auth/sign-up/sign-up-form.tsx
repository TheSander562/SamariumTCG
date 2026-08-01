"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import Link from "next/link";

type Props = {
  oidcEnabled: boolean;
  oidcProviderId: string;
  oidcName: string;
  oidcLoginOnly: boolean;
  registrationEnabled: boolean;
};

export default function SignUpForm({
  oidcEnabled,
  oidcProviderId,
  oidcName,
  oidcLoginOnly,
  registrationEnabled,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");
  const authErrorMessage = authError
    ? authError === "account_not_linked"
      ? "The email of the local account is not verified. Please sign in with the local account and verify the email or use a different email."
      : authErrorDescription || "Authentication failed. Please try again."
    : null;

  const effectiveError = error ?? authErrorMessage;

  async function handleOIDCSignUp() {
    await authClient.signIn.social({
      provider: oidcProviderId,
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/sign-up",
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await authClient.signUp.email({
      name: formData.get("name") as string,
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
        Sign Up
      </h1>

      {effectiveError && (
        <p className="text-red-500">
          {effectiveError}
        </p>
      )}

      {oidcEnabled && (
        <button
          type="button"
          onClick={handleOIDCSignUp}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Continue with {oidcName}
        </button>
      )}

      {!registrationEnabled && (
        <p className="text-center text-sm text-yellow-400">
          Email/password registration is disabled.
        </p>
      )}

      {!oidcLoginOnly && registrationEnabled && (
        <>
          {oidcEnabled && (
            <div className="flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-neutral-700" />
              <span className="text-sm text-neutral-400">
                or
              </span>
              <div className="h-px flex-1 bg-neutral-700" />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            method="post"
            className="w-full space-y-4"
          >
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
            />

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
              minLength={8}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
            />

            <button
              type="submit"
              className="w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200"
            >
              Create Account
            </button>
          </form>
        </>
      )}

      <p className="text-sm text-neutral-400">
        Already have an account?&nbsp;
        <Link
          href="/auth/sign-in"
          className="text-white hover:underline"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
