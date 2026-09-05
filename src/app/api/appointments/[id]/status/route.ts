import { AppointmentStatus, Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set<AppointmentStatus>([
  AppointmentStatus.COMPLETED,
  AppointmentStatus.CANCELLED,
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Authentication required", 401);
  }

  if (user.role !== Role.DOCTOR) {
    return errorResponse("Only doctors can update appointment status", 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const status =
    typeof body === "object" && body !== null && "status" in body
      ? body.status
      : undefined;

  if (
    typeof status !== "string" ||
    !allowedStatuses.has(status as AppointmentStatus)
  ) {
    return errorResponse("Status must be COMPLETED or CANCELLED", 400);
  }

  const { id } = await params;
  const appointment = await prisma.appointment.findFirst({
    where: { id, doctorId: user.id },
    select: { id: true },
  });

  if (!appointment) {
    return errorResponse("Appointment not found", 404);
  }

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: status as AppointmentStatus },
      select: {
        id: true,
        patientId: true,
        doctorId: true,
        startTime: true,
        endTime: true,
        status: true,
        patientNotes: true,
        createdAt: true,
      },
    });

    return successResponse(updatedAppointment);
  } catch {
    return errorResponse("Unable to update appointment status", 500);
  }
}
