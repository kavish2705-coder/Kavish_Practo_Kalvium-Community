import { Prisma, Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocalDayBounds, getScheduleSlot } from "@/lib/scheduling";
import type { BookAppointmentRequest } from "@/types";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Authentication required", 401);
  }

  if (user.role !== Role.PATIENT) {
    return errorResponse("Only patients can book appointments", 403);
  }

  let body: Partial<BookAppointmentRequest>;

  try {
    body = (await request.json()) as Partial<BookAppointmentRequest>;
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const fieldErrors: Record<string, string> = {};
  const doctorId =
    typeof body.doctorId === "string" ? body.doctorId.trim() : "";
  const startTimeValue =
    typeof body.startTime === "string" ? body.startTime : "";

  if (!doctorId) {
    fieldErrors.doctorId = "Doctor is required";
  }

  if (!startTimeValue || Number.isNaN(Date.parse(startTimeValue))) {
    fieldErrors.startTime = "Valid appointment time is required";
  }

  if (
    body.patientNotes !== undefined &&
    typeof body.patientNotes !== "string"
  ) {
    fieldErrors.patientNotes = "Patient notes must be text";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse("Validation failed", 400, fieldErrors);
  }

  const requestedStart = new Date(startTimeValue);

  try {
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      select: { role: true, doctorProfile: true },
    });

    if (!doctor || doctor.role !== Role.DOCTOR || !doctor.doctorProfile) {
      return errorResponse("Doctor not found", 404);
    }

    const { start: dayStart, end: dayEnd } = getLocalDayBounds(requestedStart);
    const schedule = await prisma.schedule.findUnique({
      where: {
        doctorId_dayOfWeek: {
          doctorId: doctor.doctorProfile.id,
          dayOfWeek: requestedStart.getDay(),
        },
      },
    });

    if (!schedule) {
      return errorResponse("Doctor has no schedule for this date", 400);
    }

    const slot = getScheduleSlot(schedule, requestedStart, requestedStart);

    if (!slot) {
      return errorResponse(
        "Appointment is outside the doctor schedule or not a valid slot boundary",
        400,
      );
    }

    if (slot.startTime <= new Date()) {
      return errorResponse("Cannot book an appointment in the past", 400);
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: "CONFIRMED",
        startTime: { gte: dayStart, lt: dayEnd, equals: slot.startTime },
      },
      select: { id: true },
    });

    if (existingAppointment) {
      return errorResponse("This appointment slot is already booked", 409);
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: user.id,
        doctorId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        patientNotes: body.patientNotes?.trim() || null,
      },
      select: {
        id: true,
        doctorId: true,
        patientId: true,
        startTime: true,
        endTime: true,
        status: true,
        patientNotes: true,
        createdAt: true,
      },
    });

    return successResponse(appointment, 201);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return errorResponse("This appointment slot is already booked", 409);
    }

    return errorResponse("Unable to book appointment", 500);
  }
}
