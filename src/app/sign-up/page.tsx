import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import SignUpForm from "@/app/sign-up/sign-up-form";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}
