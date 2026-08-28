import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SafeUser } from "@/types";

const SESSION_COOKIE = "session";

async function getSessionSecret() {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const sessionToken = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<{ sub?: string; role?: Role }>(
      sessionToken,
      await getSessionSecret(),
    );

    if (!payload.sub) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });

    return user;
  } catch {
    return null;
  }
}
