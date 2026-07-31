"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { setPasswordAction } from "@/app/dashboard/actions";

import SignOutButton from "@/app/dashboard/sign-out-button";

type Props = {
  session: {
    user: {
      name?: string | null;
      email: string;
    };
  };
  emailVerified: boolean;
  accounts: {
    providerId: string;
  }[];
  hasPassword: boolean;
  passkeys: {
    id: string;
    name: string | null;
  }[];
};

export default function DashboardClient({
  session,
  emailVerified,
  accounts,
  hasPassword,
  passkeys,
}: Props) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [passkeyMessage, setPasskeyMessage] = useState<string | null>(null);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [passkeyName, setPasskeyName] = useState("");

  const { user } = session;

  async function verifyEmail() {
    const response = await fetch("/api/account/verify-email", {
      method: "POST",
    });

    if (response.ok) {
      window.location.reload();
    }
  }

  async function addPassword() {
    setPasswordError(null);
    setPasswordMessage(null);

    if (password !== passwordConfirm) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const result = await setPasswordAction(password);

    if (result.error) {
      setPasswordError(result.error);
      return;
    }

    setPassword("");
    setPasswordConfirm("");
    setPasswordMessage("Password login enabled.");

    router.refresh();
  }

  async function addPasskey() {
    if (!passkeyName.trim()) {
      setPasskeyError("Please enter a passkey name.");
      return;
    }

    const { error } = await authClient.passkey.addPasskey({
      name: passkeyName.trim(),
    });

    if (error) {
      setPasskeyError(error.message ?? "Failed to add passkey.");
      return;
    }

    setPasskeyName("");
    setPasskeyMessage("Passkey added successfully.");
    setPasskeyError(null);
    router.refresh();
  }

  async function removePasskey(id: string) {
    const { error } = await authClient.passkey.deletePasskey({
      id,
    });

    if (error) {
      setPasskeyError(error.message ?? "Failed to remove passkey.");
      return;
    }

    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center space-y-4 p-6 text-white">
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <p>
        Welcome, {user.name || "User"}!
      </p>

      <p>
        Email: {user.email}
      </p>

      <section className="w-full rounded-md border border-neutral-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Email status
          </h2>

          {emailVerified ? (
            <span className="text-sm text-green-400">
              ✓ Verified
            </span>
          ) : (
            <span className="text-sm text-yellow-400">
              ⚠ Not verified
            </span>
          )}
        </div>

        {!emailVerified && (
          <button
            onClick={verifyEmail}
            className="mt-3 w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200"
          >
            Verify Email
          </button>
        )}
      </section>

      <section className="w-full rounded-md border border-neutral-700 p-4">
        <h2 className="font-medium">
          Linked accounts
        </h2>

        {accounts.length === 0 ? (
          <p className="mt-2 text-neutral-400">
            No linked accounts.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {accounts.map((account) => (
              <div
                key={account.providerId}
                className="flex justify-between"
              >
                <span>
                  {account.providerId}
                </span>

                <span className="text-green-400">
                  ✓ Connected
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="w-full rounded-md border border-neutral-700 p-4">
        <h2 className="font-medium">
          Password login
        </h2>

        {hasPassword ? (
          <p className="mt-2 text-green-400">
            ✓ Password login enabled
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-neutral-400">
              Add a password so you can also login with email and password.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-3 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
            />

            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm password"
              className="mt-3 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
            />

            {passwordError && (
              <p className="mt-2 text-sm text-red-400">
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p className="mt-2 text-sm text-green-400">
                {passwordMessage}
              </p>
            )}

            <button
              onClick={addPassword}
              className="mt-3 w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200"
            >
              Enable Password Login
            </button>
          </>
        )}
      </section>

      <section className="w-full rounded-md border border-neutral-700 p-4">
        <h2 className="font-medium">
          Passkeys
        </h2>

        {passkeys.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">
            No passkeys registered.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {passkeys.map((passkey) => (
              <div
                key={passkey.id}
                className="flex items-center justify-between rounded-md border border-neutral-800 px-3 py-2"
              >
                <span>
                  {passkey.name || "Unnamed Passkey"}
                </span>

                <button
                  onClick={() => removePasskey(passkey.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Remove passkey"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {passkeyMessage && (
          <p className="mt-2 text-sm text-green-400">
            {passkeyMessage}
          </p>
        )}

        {passkeyError && (
          <p className="mt-2 text-sm text-red-400">
            {passkeyError}
          </p>
        )}

        <input
          value={passkeyName}
          onChange={(e) => {
            setPasskeyName(e.target.value);
            setPasskeyError(null);
          }}
          placeholder="Passkey name (e.g. MacBook Touch ID)"
          required
          className="mt-3 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
        />

        <button
          onClick={addPasskey}
          disabled={!passkeyName.trim()}
          className="mt-3 w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Passkey
        </button>
      </section>

      <button
        onClick={() => router.replace("/")}
        className="w-full rounded-md border border-neutral-700 px-4 py-2 font-medium hover:bg-neutral-800"
      >
        Go Home
      </button>

      <SignOutButton />
    </main>
  );
}
