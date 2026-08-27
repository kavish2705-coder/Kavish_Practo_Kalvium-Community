import { Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocalDayBounds, parseLocalDate } from "@/lib/scheduling";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Authentication required", 401);
  }

  if (user.role !== Role.DOCTOR) {
    return errorResponse("Only doctors can view doctor appointments", 403);
  }

  const dateValue = new URL(request.url).searchParams.get("date");
  const date = dateValue ? parseLocalDate(dateValue) : new Date();

  if (!date) {
    return errorResponse("Invalid date", 400, {
      date: "Use a valid YYYY-MM-DD date",
    });
  }

  try {
    const { start, end } = getLocalDayBounds(date);
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: user.id,
        startTime: { gte: start, lt: end },
      },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        patientNotes: true,
        patient: { select: { id: true, name: true } },
      },
    });

    return successResponse(appointments);
  } catch {
    return errorResponse("Unable to load doctor appointments", 500);
  }
}
