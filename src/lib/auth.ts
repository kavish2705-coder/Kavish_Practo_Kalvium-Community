import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SafeUser } from "@/types";

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

async function getSessionSecret() {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: Pick<SafeUser, "id" | "role">) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(await getSessionSecret());
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
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
