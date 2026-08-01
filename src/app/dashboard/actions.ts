"use server";

import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export async function setPasswordAction(password: string) {
  if (!password || password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
    };
  }

  try {
    await getAuth().api.setPassword({
      body: {
        newPassword: password,
      },
      headers: await headers(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Set password error:", error);

    return {
      error: "Failed to set password.",
    };
  }
}
