import { Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import {
  generateAvailableSlots,
  getLocalDayBounds,
  parseLocalDate,
} from "@/lib/scheduling";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId")?.trim();
  const dateValue = searchParams.get("date")?.trim();

  if (!doctorId || !dateValue) {
    return errorResponse("Doctor and date are required", 400, {
      doctorId: "Doctor is required",
      date: "Date is required in YYYY-MM-DD format",
    });
  }

  const date = parseLocalDate(dateValue);

  if (!date) {
    return errorResponse("Invalid date", 400, {
      date: "Use a valid YYYY-MM-DD date",
    });
  }

  try {
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      select: { role: true, doctorProfile: { include: { schedules: true } } },
    });

    if (!doctor || doctor.role !== Role.DOCTOR || !doctor.doctorProfile) {
      return errorResponse("Doctor not found", 404);
    }

    const schedule = doctor.doctorProfile.schedules.find(
      (item) => item.dayOfWeek === date.getDay(),
    );

    if (!schedule) {
      return successResponse([]);
    }

    const { start, end } = getLocalDayBounds(date);
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        status: "CONFIRMED",
        startTime: { gte: start, lt: end },
      },
      select: { startTime: true },
    });

    const bookedStartTimes = new Set(
      appointments.map(({ startTime }) => startTime.getTime()),
    );
    return successResponse(
      generateAvailableSlots(schedule, date, bookedStartTimes),
    );
  } catch {
    return errorResponse("Unable to load doctor slots", 500);
  }
}
