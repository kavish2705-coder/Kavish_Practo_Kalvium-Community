import { Prisma, Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scheduleInputSchema } from "@/lib/validations/schedule";

const scheduleSelect = {
  id: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  slotDurationMins: true,
} as const;

async function getDoctorProfile() {
  const user = await getCurrentUser();

  if (!user) return { error: errorResponse("Authentication required", 401) };
  if (user.role !== Role.DOCTOR) {
    return { error: errorResponse("Only doctors can manage schedules", 403) };
  }

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!doctorProfile) {
    return { error: errorResponse("Doctor profile not found", 404) };
  }

  return { doctorProfile };
}

async function parseScheduleBody(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { error: errorResponse("Request body must be valid JSON", 400) };
  }

  const result = scheduleInputSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { error: errorResponse("Validation failed", 400, fieldErrors) };
  }

  return { data: result.data };
}

export async function GET() {
  try {
    const { doctorProfile, error } = await getDoctorProfile();
    if (error) return error;

    const schedules = await prisma.schedule.findMany({
      where: { doctorId: doctorProfile.id },
      orderBy: { dayOfWeek: "asc" },
      select: scheduleSelect,
    });
    return successResponse(schedules);
  } catch {
    return errorResponse("Unable to load schedules", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { doctorProfile, error } = await getDoctorProfile();
    if (error) return error;

    const parsed = await parseScheduleBody(request);
    if (parsed.error) return parsed.error;

    const schedule = await prisma.schedule.create({
      data: { doctorId: doctorProfile.id, ...parsed.data },
      select: scheduleSelect,
    });
    return successResponse(schedule, 201);
  } catch (caughtError) {
    if (
      caughtError instanceof Prisma.PrismaClientKnownRequestError &&
      caughtError.code === "P2002"
    ) {
      return errorResponse("A schedule already exists for this day", 409);
    }
    return errorResponse("Unable to create schedule", 500);
  }
}

async function updateSchedule(request: Request, method: "PATCH" | "PUT") {
  try {
    const { doctorProfile, error } = await getDoctorProfile();
    if (error) return error;

    const scheduleId = new URL(request.url).searchParams.get("id")?.trim();
    const parsed = await parseScheduleBody(request);
    if (parsed.error) return parsed.error;

    const existing = await prisma.schedule.findFirst({
      where: scheduleId
        ? { id: scheduleId, doctorId: doctorProfile.id }
        : { doctorId: doctorProfile.id, dayOfWeek: parsed.data.dayOfWeek },
      select: { id: true },
    });

    if (!existing) return errorResponse("Schedule not found", 404);

    const schedule = await prisma.schedule.update({
      where: { id: existing.id },
      data: parsed.data,
      select: scheduleSelect,
    });
    return successResponse(schedule);
  } catch (caughtError) {
    if (
      caughtError instanceof Prisma.PrismaClientKnownRequestError &&
      caughtError.code === "P2002"
    ) {
      return errorResponse("A schedule already exists for this day", 409);
    }
    return errorResponse(
      `Unable to ${method === "PUT" ? "replace" : "update"} schedule`,
      500,
    );
  }
}

export async function PATCH(request: Request) {
  return updateSchedule(request, "PATCH");
}

export async function PUT(request: Request) {
  return updateSchedule(request, "PUT");
}

export async function DELETE(request: Request) {
  try {
    const { doctorProfile, error } = await getDoctorProfile();
    if (error) return error;

    const url = new URL(request.url);
    const scheduleId = url.searchParams.get("id")?.trim();
    const dayValue = url.searchParams.get("dayOfWeek");
    const dayOfWeek = dayValue === null ? null : Number(dayValue);

    if (
      !scheduleId &&
      (dayOfWeek === null ||
        !Number.isInteger(dayOfWeek) ||
        dayOfWeek < 0 ||
        dayOfWeek > 6)
    ) {
      return errorResponse("Provide a valid schedule id or dayOfWeek", 400);
    }

    const existing = await prisma.schedule.findFirst({
      where: scheduleId
        ? { id: scheduleId, doctorId: doctorProfile.id }
        : { doctorId: doctorProfile.id, dayOfWeek: dayOfWeek as number },
      select: { id: true },
    });

    if (!existing) return errorResponse("Schedule not found", 404);

    await prisma.schedule.delete({ where: { id: existing.id } });
    return successResponse({ message: "Schedule deleted successfully" });
  } catch {
    return errorResponse("Unable to delete schedule", 500);
  }
}
