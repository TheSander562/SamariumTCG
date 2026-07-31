import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import SignInForm from "@/app/sign-in/sign-in-form";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignInForm />;
}
