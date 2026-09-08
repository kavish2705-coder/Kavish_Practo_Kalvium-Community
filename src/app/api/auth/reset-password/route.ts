import { NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON payload", 400);
    }

    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string") {
          fieldErrors[fieldName] = issue.message;
        }
      });
      return errorResponse(
        fieldErrors.confirmPassword ||
          fieldErrors.password ||
          fieldErrors.token ||
          "Validation failed",
        400,
        fieldErrors
      );
    }

    const { token, password } = validation.data;

    // Hash the supplied token to look it up securely
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetTokenRecord) {
      return errorResponse("Invalid or expired password reset token.", 400);
    }

    if (resetTokenRecord.usedAt !== null) {
      return errorResponse("This password reset token has already been used.", 400);
    }

    if (resetTokenRecord.expiresAt < new Date()) {
      return errorResponse("This password reset token has expired. Please request a new one.", 400);
    }

    if (!resetTokenRecord.user) {
      return errorResponse("User associated with this reset token no longer exists.", 404);
    }

    // Hash the new password using the existing bcrypt implementation
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(password, saltRounds);

    // Atomically update user password and consume the reset token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetTokenRecord.userId },
        data: { passwordHash: newPasswordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetTokenRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return successResponse({
      message: "Password has been successfully reset. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("[ResetPasswordAPI] Error resetting password:", error);
    return errorResponse("An unexpected error occurred. Please try again later.", 500);
  }
}
