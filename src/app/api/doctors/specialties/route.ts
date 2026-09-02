import { Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.doctorProfile.findMany({
      where: {
        user: {
          role: Role.DOCTOR,
        },
      },
      select: {
        specialization: true,
      },
      distinct: ["specialization"],
    });

    const specialties = profiles.map((p) => p.specialization).filter(Boolean);

    return successResponse(specialties);
  } catch (error: unknown) {
    console.error("GET /api/doctors/specialties error:", error);
    return errorResponse("Failed to fetch specialties", 500);
  }
}
