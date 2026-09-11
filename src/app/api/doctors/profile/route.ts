import { Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { doctorProfileInputSchema } from "@/lib/validations/doctorProfile";

const profileSelect = {
  id: true,
  userId: true,
  specialization: true,
  qualification: true,
  experience: true,
  fee: true,
  clinicInfo: true,
} as const;

async function getAuthenticatedDoctorProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: errorResponse("Authentication required", 401) };
  }

  if (user.role !== Role.DOCTOR) {
    return {
      error: errorResponse("Only doctors can access this profile", 403),
    };
  }

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: user.id },
    select: profileSelect,
  });

  if (!doctorProfile) {
    return { error: errorResponse("Doctor profile not found", 404) };
  }

  return { doctorProfile };
}

export async function GET() {
  try {
    const result = await getAuthenticatedDoctorProfile();
    if ("error" in result) {
      return result.error;
    }

    return successResponse(result.doctorProfile);
  } catch {
    return errorResponse("Unable to load doctor profile", 500);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Authentication required", 401);
    }

    if (user.role !== Role.DOCTOR) {
      return errorResponse("Only doctors can update this profile", 403);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Request body must be valid JSON", 400);
    }

    const validation = doctorProfileInputSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      return errorResponse("Validation failed", 400, fieldErrors);
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!doctorProfile) {
      return errorResponse("Doctor profile not found", 404);
    }

    const updatedProfile = await prisma.doctorProfile.update({
      where: { id: doctorProfile.id },
      data: {
        specialization: validation.data.specialization,
        qualification: validation.data.qualification,
        experience: validation.data.experience,
        fee: validation.data.fee,
        clinicInfo: validation.data.clinicInfo,
      },
      select: profileSelect,
    });

    return successResponse(updatedProfile);
  } catch {
    return errorResponse("Unable to update doctor profile", 500);
  }
}
