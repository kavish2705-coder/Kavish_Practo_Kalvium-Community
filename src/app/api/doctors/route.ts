import { NextRequest } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import type { DoctorCardData } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const specialization = searchParams.get("specialization")?.trim();
    const minExperience = Number.parseInt(searchParams.get("minExperience") || "0", 10);
    const maxFee = Number.parseInt(searchParams.get("maxFee") || "10000", 10);
    const sortBy = searchParams.get("sortBy") || "rating-desc";
    const doctorId = searchParams.get("id")?.trim();

    const profileWhere: Prisma.DoctorProfileWhereInput = {
      user: {
        role: Role.DOCTOR,
      },
    };

    if (doctorId) {
      profileWhere.userId = doctorId;
    }

    if (specialization) {
      profileWhere.specialization = {
        equals: specialization,
        mode: "insensitive",
      };
    }

    if (minExperience > 0) {
      profileWhere.experience = {
        gte: minExperience,
      };
    }

    if (maxFee < 10000) {
      profileWhere.fee = {
        lte: maxFee,
      };
    }

    if (search) {
      profileWhere.OR = [
        { specialization: { contains: search, mode: "insensitive" } },
        { clinicInfo: { contains: search, mode: "insensitive" } },
        { qualification: { contains: search, mode: "insensitive" } },
        { user: { is: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const doctorProfiles = await prisma.doctorProfile.findMany({
      where: profileWhere,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            reviewsAsDoctor: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    const formattedDoctors: DoctorCardData[] = doctorProfiles.map((profile) => {
      const user = profile.user;
      const reviews = user.reviewsAsDoctor || [];
      const totalReviews = reviews.length;
      const avgRating =
        totalReviews > 0
          ? Number(
              (
                reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) /
                totalReviews
              ).toFixed(1),
            )
          : 4.8; // Default rating if no reviews yet

      const name = user.name.startsWith("Dr.") ? user.name : `Dr. ${user.name}`;

      return {
        id: user.id,
        userId: user.id,
        name,
        email: user.email,
        specialization: profile.specialization,
        qualification: profile.qualification,
        experience: profile.experience,
        fee: profile.fee,
        clinicInfo: profile.clinicInfo,
        rating: avgRating,
        totalReviews,
        nextAvailableSlot: "Today at 04:00 PM",
        about: `${name} is a dedicated ${profile.specialization} specialist with ${profile.experience} years of clinical experience.`,
      };
    });

    // Sorting in memory for combined flexibility
    if (sortBy === "rating-desc") {
      formattedDoctors.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience-desc") {
      formattedDoctors.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === "fee-asc") {
      formattedDoctors.sort((a, b) => a.fee - b.fee);
    }

    return successResponse(formattedDoctors);
  } catch (error: unknown) {
    console.error("GET /api/doctors error:", error);
    return errorResponse("Failed to fetch doctors from database", 500);
  }
}
