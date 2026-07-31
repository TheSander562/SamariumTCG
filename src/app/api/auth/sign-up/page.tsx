import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

import SignUpForm from "@/app/api/auth/sign-up/sign-up-form";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <SignUpForm
      oidcEnabled={!!process.env.AUTH_OIDC_PROVIDER_ID}
      oidcProviderId={process.env.AUTH_OIDC_PROVIDER_ID ?? ""}
      oidcName={process.env.AUTH_OIDC_NAME ?? "Single Sign-On"}
      oidcLoginOnly={process.env.AUTH_OIDC_LOGIN_ONLY === "false"}
      registrationEnabled={process.env.REGISTRATION !== "true"}
    />
  );
}
