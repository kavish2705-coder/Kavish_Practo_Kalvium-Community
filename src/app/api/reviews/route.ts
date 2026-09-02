import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/reviews
 * Fetch reviews for a specific appointment, doctor, or patient
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId")?.trim();
    const doctorId = searchParams.get("doctorId")?.trim();

    if (appointmentId) {
      const review = await prisma.review.findUnique({
        where: { appointmentId },
        include: {
          patient: {
            select: { name: true },
          },
        },
      });
      return successResponse(review);
    }

    if (doctorId) {
      const reviews = await prisma.review.findMany({
        where: { doctorId },
        include: {
          patient: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return successResponse(reviews);
    }

    // Default: fetch patient's own reviews if authenticated
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    const reviews = await prisma.review.findMany({
      where: { patientId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(reviews);
  } catch (error: unknown) {
    console.error("GET /api/reviews error:", error);
    return errorResponse("Failed to fetch reviews", 500);
  }
}

/**
 * POST /api/reviews
 * Submit a review for a completed appointment
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Authentication required. Please log in to submit a review.", 401);
    }

    if (user.role !== Role.PATIENT) {
      return errorResponse("Only patients can submit appointment reviews.", 403);
    }

    let body: { appointmentId?: string; rating?: number; comment?: string };
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON payload", 400);
    }

    const fieldErrors: Record<string, string> = {};

    const appointmentId = typeof body.appointmentId === "string" ? body.appointmentId.trim() : "";
    const rating = typeof body.rating === "number" ? body.rating : Number.parseInt(String(body.rating), 10);
    const comment = typeof body.comment === "string" ? body.comment.trim() : undefined;

    if (!appointmentId) {
      fieldErrors.appointmentId = "Appointment ID is required";
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      fieldErrors.rating = "Rating must be between 1 and 5 stars";
    }

    if (comment && comment.length > 1000) {
      fieldErrors.comment = "Review comment cannot exceed 1000 characters";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return errorResponse("Validation failed", 400, fieldErrors);
    }

    // Find appointment in database
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return errorResponse("Appointment record not found", 404);
    }

    // SECURITY CHECK 1: Ensure patient owns this appointment
    if (appointment.patientId !== user.id) {
      return errorResponse("Security Error: You are not authorized to review this appointment", 403);
    }

    // SECURITY CHECK 2: Ensure appointment is Completed (database status COMPLETED)
    if (appointment.status !== "COMPLETED") {
      return errorResponse(
        "Reviews can only be submitted for completed consultations",
        400,
      );
    }

    // SECURITY CHECK 3: Ensure duplicate reviews are prevented
    const existingReview = await prisma.review.findUnique({
      where: { appointmentId },
    });

    if (existingReview) {
      return errorResponse("A review has already been submitted for this appointment", 409);
    }

    // Create review record
    const newReview = await prisma.review.create({
      data: {
        appointmentId: appointment.id,
        patientId: user.id,
        doctorId: appointment.doctorId,
        rating,
        comment: comment || null,
      },
    });

    return successResponse(newReview, 201);
  } catch (error: unknown) {
    console.error("POST /api/reviews error:", error);
    return errorResponse("Failed to submit review. Please try again later.", 500);
  }
}
