import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function POST() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = getPrisma();

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      emailVerified: true,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
