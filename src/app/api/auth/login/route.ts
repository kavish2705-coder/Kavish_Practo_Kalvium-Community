import bcrypt from "bcryptjs";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SafeUser } from "@/types";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };

  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return errorResponse("Email and password are required", 400, {
      ...(email ? {} : { email: "Email is required" }),
      ...(password ? {} : { password: "Password is required" }),
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return errorResponse("Invalid email or password", 401);
    }

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const response = successResponse(safeUser);
    response.cookies.set(
      SESSION_COOKIE,
      await createSessionToken(safeUser),
      sessionCookieOptions(),
    );
    return response;
  } catch {
    return errorResponse("Unable to authenticate", 500);
  }
}
