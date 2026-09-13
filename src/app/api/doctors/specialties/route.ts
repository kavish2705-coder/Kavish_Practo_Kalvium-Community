import { Role } from "@prisma/client";
import { successResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { MOCK_SPECIALTIES } from "@/lib/mockData";

export async function GET() {
  const fallbackSpecialties = MOCK_SPECIALTIES.map((s) => s.name);

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

    if (specialties.length === 0) {
      return successResponse(fallbackSpecialties);
    }

    return successResponse(specialties);
  } catch (error: unknown) {
    console.warn("GET /api/doctors/specialties database fallback to mock data:", error);
    return successResponse(fallbackSpecialties);
  }
}
