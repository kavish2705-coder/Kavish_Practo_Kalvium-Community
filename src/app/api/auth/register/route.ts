// removed unused NextResponse import
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { Role } from "@prisma/client";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return errorResponse("Missing required fields", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("User with this email already exists", 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: Role.PATIENT,
      },
    });

    // Create session token
    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const response = successResponse(safeUser);
    
    // Set cookie
    response.cookies.set(
      SESSION_COOKIE,
      await createSessionToken(safeUser),
      sessionCookieOptions()
    );

    return response;

  } catch (error) {
    console.error("[RegisterAPI] Error:", error);
    return errorResponse("Failed to register user", 500);
  }
}
