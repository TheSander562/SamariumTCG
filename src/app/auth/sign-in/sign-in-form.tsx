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
};

export default function SignInForm({
  oidcEnabled,
  oidcProviderId,
  oidcName,
  oidcLoginOnly,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [isSubmittingTwoFactor, setIsSubmittingTwoFactor] = useState(false);
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");
  const authErrorMessage = authError
    ? authError === "account_not_linked"
      ? "The email of the local account is not verified. Please sign in with the local account and verify the email or use a different email."
      : authErrorDescription || "Authentication failed. Please try again."
    : null;

  const effectiveError = error ?? authErrorMessage;

  async function handleOIDCSignIn() {
    await authClient.signIn.social({
      provider: oidcProviderId,
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/sign-in",
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

    const requiresTwoFactor = (result.data as { twoFactorRedirect?: boolean } | undefined)?.twoFactorRedirect;

    if (requiresTwoFactor) {
      setShowTwoFactor(true);
      setTwoFactorError(null);
      return;
    }

    router.replace("/dashboard");
  }

  async function handleTwoFactorSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTwoFactorError(null);
    setIsSubmittingTwoFactor(true);

    const result = await authClient.twoFactor.verifyTotp({
      code: twoFactorCode.trim(),
    });

    setIsSubmittingTwoFactor(false);

    if (result.error) {
      setTwoFactorError(result.error.message ?? "Invalid verification code.");
      return;
    }

    setTwoFactorCode("");
    setTwoFactorError(null);
    setShowTwoFactor(false);
    router.replace("/dashboard");
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center mx-auto max-w-md space-y-4 p-6 text-white">
      <h1 className="text-2xl font-bold">
        Sign In
      </h1>

      {effectiveError && (
        <p className="text-red-500">
          {effectiveError}
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
            method="post"
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

      {showTwoFactor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-lg border border-neutral-700 bg-neutral-900 p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white">
              Enter authenticator code
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Open your authenticator app and enter the current 6-digit code.
            </p>

            <form onSubmit={handleTwoFactorSubmit} className="mt-4 space-y-4">
              <input
                value={twoFactorCode}
                onChange={(e) => {
                  setTwoFactorCode(e.target.value);
                  if (twoFactorError) {
                    setTwoFactorError(null);
                  }
                }}
                placeholder="123456"
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2"
              />

              {twoFactorError && (
                <p className="text-sm text-red-500">
                  {twoFactorError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingTwoFactor || twoFactorCode.trim().length < 6}
                className="w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmittingTwoFactor ? "Verifying..." : "Verify"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setShowTwoFactor(false);
                setTwoFactorCode("");
                setTwoFactorError(null);
              }}
              className="mt-3 text-sm text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
