import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { emailService } from "@/lib/email";

const GENERIC_RESPONSE_MESSAGE =
  "If an account exists with that email, a password reset link has been sent.";

export async function POST(request: NextRequest) {
  try {
    let body: { email?: unknown };
    try {
      body = (await request.json()) as { email?: unknown };
    } catch {
      return errorResponse("Invalid JSON payload", 400);
    }

    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    const validation = forgotPasswordSchema.safeParse({ email: rawEmail });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string") {
          fieldErrors[fieldName] = issue.message;
        }
      });
      return errorResponse(
        "Invalid email address.",
        400,
        fieldErrors
      );
    }

    const email = validation.data.email;

    // Find the user by normalized email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // If user does not exist, return generic response without revealing account existence
    if (!user) {
      return successResponse({ message: GENERIC_RESPONSE_MESSAGE });
    }

    // Cryptographically secure token generation
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Invalidate previous unused reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    // Store only the token hash in the database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Construct the reset URL
    const origin =
      request.nextUrl.origin ||
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${rawToken}`;

    // Send the password reset email via the email abstraction
    const emailResult = await emailService.sendPasswordResetEmail({
      to: user.email,
      resetUrl,
    });

    const isDev = process.env.NODE_ENV !== "production";

    return successResponse({
      message: GENERIC_RESPONSE_MESSAGE,
      ...(isDev && emailResult.devResetUrl ? { devResetUrl: emailResult.devResetUrl } : {}),
    });
  } catch (error) {
    console.error("[ForgotPasswordAPI] Error processing request:", error);
    return errorResponse("An unexpected error occurred. Please try again later.", 500);
  }
}
