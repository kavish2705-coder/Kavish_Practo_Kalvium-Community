import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/profile
 * Returns authenticated patient profile details
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    if (user.role !== Role.PATIENT) {
      return errorResponse("Access denied: Patient role required", 403);
    }

    const patientData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!patientData) {
      return errorResponse("Patient profile not found", 404);
    }

    return successResponse(patientData);
  } catch (error: unknown) {
    console.error("GET /api/patient/profile error:", error);
    return errorResponse("Failed to fetch patient profile", 500);
  }
}

/**
 * PATCH /api/patient/profile
 * Updates authenticated patient personal information (e.g. name)
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    if (user.role !== Role.PATIENT) {
      return errorResponse("Access denied: Patient role required", 403);
    }

    let body: { name?: string };
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON payload", 400);
    }

    const fieldErrors: Record<string, string> = {};

    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      fieldErrors.name = "Full name is required";
    } else if (name.length < 2) {
      fieldErrors.name = "Name must be at least 2 characters long";
    } else if (name.length > 100) {
      fieldErrors.name = "Name cannot exceed 100 characters";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return errorResponse("Validation failed", 400, fieldErrors);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error: unknown) {
    console.error("PATCH /api/patient/profile error:", error);
    return errorResponse("Failed to update profile", 500);
  }
}
