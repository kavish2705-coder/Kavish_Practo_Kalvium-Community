import { Prisma, Role } from "@prisma/client";
import { NextRequest } from "next/server";
import { format } from "date-fns";

import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getLocalDayBounds,
  getScheduleSlot,
} from "@/lib/scheduling";
import type { BookAppointmentRequest } from "@/types";

export interface AppointmentRecord {
  id: string;
  referenceId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  clinicInfo: string;
  appointmentDate: string;
  timeSlot: string;
  fee: number;
  status: "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  createdAt: string;
}

/**
 * GET /api/appointments
 *
 * Supported query parameters:
 * - type=upcoming
 * - type=past
 * - page=1
 * - limit=2
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") || "upcoming";

    const pageValue = Number.parseInt(
      searchParams.get("page") || "1",
      10,
    );

    const limitValue = Number.parseInt(
      searchParams.get("limit") || "2",
      10,
    );

    const page = Number.isFinite(pageValue) && pageValue > 0
      ? pageValue
      : 1;

    const limit = Number.isFinite(limitValue) && limitValue > 0
      ? Math.min(limitValue, 100)
      : 2;

    /**
     * Upcoming appointments
     */
    if (type === "upcoming") {
      const dbAppointments = await prisma.appointment.findMany({
        where: {
          status: "CONFIRMED",
          startTime: {
            gte: new Date(),
          },
        },
        include: {
          doctor: {
            include: {
              doctorProfile: true,
            },
          },
          patient: true,
        },
        orderBy: {
          startTime: "asc",
        },
      });

      const formatted: AppointmentRecord[] = dbAppointments.map((apt) => ({
        id: apt.id,

        referenceId: `PRAC-${apt.id
          .slice(0, 5)
          .toUpperCase()}`,

        doctorId: apt.doctorId,

        doctorName: apt.doctor.name,

        specialty:
          apt.doctor.doctorProfile?.specialization ||
          "General Medicine",

        clinicInfo:
          apt.doctor.doctorProfile?.clinicInfo ||
          "Practo Clinic, Bengaluru",

        appointmentDate: format(
          new Date(apt.startTime),
          "dd MMM yyyy",
        ),

        timeSlot: `${format(
          new Date(apt.startTime),
          "hh:mm a",
        )} - ${format(
          new Date(apt.endTime),
          "hh:mm a",
        )}`,

        fee: apt.doctor.doctorProfile?.fee || 500,

        status: "Confirmed",

        notes: apt.patientNotes || undefined,

        patientName: apt.patient.name,

        patientEmail: apt.patient.email,

        patientPhone: (apt.patient as { phone?: string }).phone || undefined,

        createdAt: apt.createdAt.toISOString(),
      }));

      return successResponse({
        appointments: formatted,
        total: formatted.length,
      });
    }

    /**
     * Past appointments
     */
    if (type === "past") {
      const skip = (page - 1) * limit;

      const [dbPast, total] = await Promise.all([
        prisma.appointment.findMany({
          where: {
            status: {
              in: ["COMPLETED", "CANCELLED"],
            },
          },
          include: {
            doctor: {
              include: {
                doctorProfile: true,
              },
            },
            patient: true,
          },
          orderBy: {
            startTime: "desc",
          },
          skip,
          take: limit,
        }),

        prisma.appointment.count({
          where: {
            status: {
              in: ["COMPLETED", "CANCELLED"],
            },
          },
        }),
      ]);

      const formatted: AppointmentRecord[] = dbPast.map((apt) => ({
        id: apt.id,

        referenceId: `PRAC-${apt.id
          .slice(0, 5)
          .toUpperCase()}`,

        doctorId: apt.doctorId,

        doctorName: apt.doctor.name,

        specialty:
          apt.doctor.doctorProfile?.specialization ||
          "General Medicine",

        clinicInfo:
          apt.doctor.doctorProfile?.clinicInfo ||
          "Practo Clinic, Bengaluru",

        appointmentDate: format(
          new Date(apt.startTime),
          "dd MMM yyyy",
        ),

        timeSlot: `${format(
          new Date(apt.startTime),
          "hh:mm a",
        )} - ${format(
          new Date(apt.endTime),
          "hh:mm a",
        )}`,

        fee: apt.doctor.doctorProfile?.fee || 500,

        status:
          apt.status === "COMPLETED"
            ? "Completed"
            : "Cancelled",

        notes: apt.patientNotes || undefined,

        patientName: apt.patient.name,

        patientEmail: apt.patient.email,

        patientPhone: (apt.patient as { phone?: string }).phone || undefined,

        createdAt: apt.createdAt.toISOString(),
      }));

      return successResponse({
        appointments: formatted,
        page,
        limit,
        hasMore: skip + limit < total,
        total,
      });
    }

    return errorResponse(
      "Invalid appointment type specified",
      400,
    );
  } catch (error: unknown) {
    console.error("GET /api/appointments error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Database fetch failed";

    return errorResponse(message, 500);
  }
}

/**
 * POST /api/appointments
 *
 * Creates a new appointment.
 *
 * Requirements:
 * - User must be authenticated
 * - User must have PATIENT role
 * - Doctor must exist
 * - Doctor must have a schedule
 * - Requested time must be a valid schedule slot
 * - Appointment cannot be in the past
 * - Slot cannot already be booked
 */
export async function POST(request: Request) {
  /**
   * Authenticate user
   */
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse(
      "Authentication required",
      401,
    );
  }

  /**
   * Only patients can book appointments
   */
  if (user.role !== Role.PATIENT) {
    return errorResponse(
      "Only patients can book appointments",
      403,
    );
  }

  /**
   * Parse request body
   */
  let body: Partial<BookAppointmentRequest>;

  try {
    body = (await request.json()) as Partial<BookAppointmentRequest>;
  } catch {
    return errorResponse(
      "Request body must be valid JSON",
      400,
    );
  }

  /**
   * Validate input
   */
  const fieldErrors: Record<string, string> = {};

  const doctorId =
    typeof body.doctorId === "string"
      ? body.doctorId.trim()
      : "";

  const startTimeValue =
    typeof body.startTime === "string"
      ? body.startTime
      : "";

  if (!doctorId) {
    fieldErrors.doctorId = "Doctor is required";
  }

  if (
    !startTimeValue ||
    Number.isNaN(Date.parse(startTimeValue))
  ) {
    fieldErrors.startTime =
      "Valid appointment time is required";
  }

  if (
    body.patientNotes !== undefined &&
    typeof body.patientNotes !== "string"
  ) {
    fieldErrors.patientNotes =
      "Patient notes must be text";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse(
      "Validation failed",
      400,
      fieldErrors,
    );
  }

  const requestedStart = new Date(startTimeValue);

  try {
    /**
     * Find doctor
     */
    const doctor = await prisma.user.findUnique({
      where: {
        id: doctorId,
      },
      select: {
        id: true,
        name: true,
        role: true,
        doctorProfile: true,
      },
    });

    if (
      !doctor ||
      doctor.role !== Role.DOCTOR ||
      !doctor.doctorProfile
    ) {
      return errorResponse(
        "Doctor not found",
        404,
      );
    }

    /**
     * Get start/end of requested day
     */
    const {
      start: dayStart,
      end: dayEnd,
    } = getLocalDayBounds(requestedStart);

    /**
     * Find doctor's schedule for that day.
     *
     * requestedStart.getDay():
     * 0 = Sunday
     * 1 = Monday
     * ...
     * 6 = Saturday
     */
    const schedule = await prisma.schedule.findUnique({
      where: {
        doctorId_dayOfWeek: {
          doctorId: doctor.doctorProfile.id,
          dayOfWeek: requestedStart.getDay(),
        },
      },
    });

    if (!schedule) {
      return errorResponse(
        "Doctor has no schedule for this date",
        400,
      );
    }

    /**
     * Validate requested time against schedule
     */
    const slot = getScheduleSlot(
      schedule,
      requestedStart,
      requestedStart,
    );

    if (!slot) {
      return errorResponse(
        "Appointment is outside the doctor schedule or not a valid slot boundary",
        400,
      );
    }

    /**
     * Prevent booking appointments in the past
     */
    if (slot.startTime <= new Date()) {
      return errorResponse(
        "Cannot book an appointment in the past",
        400,
      );
    }

    /**
     * Check whether the exact slot is already booked.
     *
     * We restrict the search to:
     * - same doctor
     * - same day
     * - confirmed appointments
     * - exact slot start time
     */
    const existingAppointment =
      await prisma.appointment.findFirst({
        where: {
          doctorId,

          status: "CONFIRMED",

          startTime: {
            gte: dayStart,
            lt: dayEnd,
            equals: slot.startTime,
          },
        },

        select: {
          id: true,
        },
      });

    if (existingAppointment) {
      return errorResponse(
        "This appointment slot is already booked",
        409,
      );
    }

    /**
     * Create appointment
     */
    const appointment =
      await prisma.appointment.create({
        data: {
          patientId: user.id,
          doctorId,

          startTime: slot.startTime,
          endTime: slot.endTime,

          status: "CONFIRMED",

          patientNotes:
            body.patientNotes?.trim() || null,
        },

        include: {
          doctor: {
            include: {
              doctorProfile: true,
            },
          },

          patient: true,
        },
      });

    /**
     * Return the same AppointmentRecord format
     * used by GET.
     */
    const formatted: AppointmentRecord = {
      id: appointment.id,

      referenceId: `PRAC-${appointment.id
        .slice(0, 5)
        .toUpperCase()}`,

      doctorId: appointment.doctorId,

      doctorName: appointment.doctor.name,

      specialty:
        appointment.doctor.doctorProfile?.specialization ||
        "General Medicine",

      clinicInfo:
        appointment.doctor.doctorProfile?.clinicInfo ||
        "Practo Clinic, Bengaluru",

      appointmentDate: format(
        new Date(appointment.startTime),
        "dd MMM yyyy",
      ),

      timeSlot: `${format(
        new Date(appointment.startTime),
        "hh:mm a",
      )} - ${format(
        new Date(appointment.endTime),
        "hh:mm a",
      )}`,

      fee:
        appointment.doctor.doctorProfile?.fee ||
        500,

      status: "Confirmed",

      notes:
        appointment.patientNotes ||
        undefined,

      patientName:
        appointment.patient.name,

      patientEmail:
        appointment.patient.email,

      patientPhone:
        (appointment.patient as { phone?: string }).phone ||
        undefined,

      createdAt:
        appointment.createdAt.toISOString(),
    };

    return successResponse(
      formatted,
      201,
    );
  } catch (error: unknown) {
    /**
     * Prisma unique constraint.
     *
     * This protects against two requests attempting
     * to book the same slot simultaneously, assuming
     * the database has the appropriate unique constraint.
     */
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return errorResponse(
        "This appointment slot is already booked",
        409,
      );
    }

    console.error(
      "POST /api/appointments error:",
      error,
    );

    return errorResponse(
      "Unable to book appointment",
      500,
    );
  }
}