"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { setPasswordAction } from "@/app/dashboard/actions";

import QRCode from "react-qr-code";

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
  twoFactorEnabled: boolean;
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
  twoFactorEnabled,
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

  const [totpPassword, setTotpPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpMessage, setTotpMessage] = useState<string | null>(null);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [totpSetup, setTotpSetup] = useState<{ totpURI: string } | null>(null);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [isSettingUpTotp, setIsSettingUpTotp] = useState(false);
  const [isVerifyingTotp, setIsVerifyingTotp] = useState(false);
  const [isDisablingTotp, setIsDisablingTotp] = useState(false);

  const { user } = session;
  const canUseTotp = hasPassword;

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

  async function startTotpSetup() {
    if (!totpPassword.trim()) {
      setTotpError("Enter your current password to continue:");
      return;
    }

    setTotpError(null);
    setTotpMessage(null);
    setTotpSetup(null);
    setTotpUri(null);
    setIsSettingUpTotp(true);

    const enableResult = await authClient.twoFactor.enable({
      password: totpPassword.trim(),
    });

    setIsSettingUpTotp(false);

    if (enableResult.error) {
      setTotpError(enableResult.error.message ?? "Failed to enable TOTP.");
      return;
    }

    const generatedUri = enableResult.data?.method === "totp"
      ? enableResult.data.totpURI ?? null
      : null;

    if (!generatedUri) {
      setTotpError("Failed to prepare TOTP setup.");
      return;
    }

    setTotpPassword("");
    setTotpSetup({
      totpURI: generatedUri,
    });
    setTotpUri(generatedUri);
  }

  async function verifyTotpSetup() {
    if (!totpSetup) {
      return;
    }

    setTotpError(null);
    setTotpMessage(null);
    setIsVerifyingTotp(true);

    const result = await authClient.twoFactor.verifyTotp({
      code: totpCode.trim(),
    });

    setIsVerifyingTotp(false);

    if (result.error) {
      setTotpError(result.error.message ?? "Failed to verify TOTP code.");
      return;
    }

    setTotpCode("");
    setTotpSetup(null);
    setTotpMessage("TOTP enabled successfully.");
    router.refresh();
  }

  async function disableTotp() {
    if (!totpPassword.trim()) {
      setTotpError("Enter your current password to continue:");
      return;
    }

    setTotpError(null);
    setTotpMessage(null);
    setIsDisablingTotp(true);

    const result = await authClient.twoFactor.disable({
      password: totpPassword.trim(),
    });

    setIsDisablingTotp(false);

    if (result.error) {
      setTotpError(result.error.message ?? "Failed to disable TOTP.");
      return;
    }

    setTotpPassword("");
    setTotpMessage("TOTP disabled successfully.");
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
              disabled={!password.trim() || !passwordConfirm.trim()}
              className="mt-3 w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enable Password Login
            </button>
          </>
        )}
      </section>

      {canUseTotp && (
        <section className="w-full rounded-md border border-neutral-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              Two-factor authentication
            </h2>

            {twoFactorEnabled ? (
              <span className="text-sm text-green-400">
                ✓ Enabled
              </span>
            ) : (
              <span className="text-sm text-yellow-400">
                ⚠ Disabled
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-neutral-400">
            Secure your account with a TOTP authenticator app.
          </p>

          {totpMessage && (
            <p className="mt-3 text-sm text-green-400">
              {totpMessage}
            </p>
          )}

          {totpError && (
            <p className="mt-3 text-sm text-red-400">
              {totpError}
            </p>
          )}

          <input
            type="password"
            value={totpPassword}
            onChange={(e) => {
              setTotpPassword(e.target.value);
              setTotpError(null);
            }}
            placeholder="Current password"
            className="mt-3 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
          />

          {twoFactorEnabled ? (
            <button
              onClick={disableTotp}
              disabled={isDisablingTotp || !totpPassword.trim()}
              className="mt-3 w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDisablingTotp ? "Disabling..." : "Disable TOTP"}
            </button>
          ) : (
            <>
              <button
                onClick={startTotpSetup}
                disabled={isSettingUpTotp || !totpPassword.trim()}
                className="mt-3 w-full rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSettingUpTotp ? "Preparing..." : "Enable TOTP"}
              </button>

              {totpSetup && (
                <div className="mt-3 space-y-3 rounded-md border border-neutral-800 p-3">
                  <p className="text-sm text-neutral-300">
                    Scan the QR code in your authenticator app or enter the secret manually.
                  </p>

                  {totpUri && (
                    <div className="flex justify-center rounded-md border border-neutral-800 bg-neutral-950 p-3">
                      <div className="rounded-md bg-white p-3">
                        <QRCode value={totpUri ?? totpSetup?.totpURI ?? ""} size={220} level="M" />
                      </div>
                    </div>
                  )}

                  <textarea
                    readOnly
                    value={totpSetup.totpURI}
                    className="min-h-24 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs"
                  />

                  <input
                    value={totpCode}
                    onChange={(e) => {
                      setTotpCode(e.target.value);
                      setTotpError(null);
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
                  />

                  <button
                    onClick={verifyTotpSetup}
                    disabled={isVerifyingTotp || totpCode.trim().length < 6}
                    className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isVerifyingTotp ? "Verifying..." : "Verify & Enable"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

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
