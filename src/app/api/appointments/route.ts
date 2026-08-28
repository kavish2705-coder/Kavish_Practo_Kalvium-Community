import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "upcoming";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "2", 10);

    if (type === "upcoming") {
      const dbAppointments = await prisma.appointment.findMany({
        where: { status: "CONFIRMED" },
        include: { doctor: { include: { doctorProfile: true } }, patient: true },
        orderBy: { startTime: "asc" },
      });

      const formatted: AppointmentRecord[] = dbAppointments.map((apt) => ({
        id: apt.id,
        referenceId: `PRAC-${apt.id.slice(0, 5).toUpperCase()}`,
        doctorId: apt.doctorId,
        doctorName: apt.doctor.name,
        specialty: apt.doctor.doctorProfile?.specialization || "General Medicine",
        clinicInfo: apt.doctor.doctorProfile?.clinicInfo || "Practo Clinic, Bengaluru",
        appointmentDate: format(new Date(apt.startTime), "dd MMM yyyy"),
        timeSlot: `${format(new Date(apt.startTime), "hh:mm a")} - ${format(new Date(apt.endTime), "hh:mm a")}`,
        fee: apt.doctor.doctorProfile?.fee || 500,
        status: "Confirmed",
        notes: apt.patientNotes || undefined,
        patientName: apt.patient.name,
        patientEmail: apt.patient.email,
        createdAt: apt.createdAt.toISOString(),
      }));

      return successResponse({
        appointments: formatted,
        total: formatted.length,
      });
    }

    if (type === "past") {
      const skip = (page - 1) * limit;
      const [dbPast, total] = await Promise.all([
        prisma.appointment.findMany({
          where: { status: { in: ["COMPLETED", "CANCELLED"] } },
          include: { doctor: { include: { doctorProfile: true } }, patient: true },
          orderBy: { startTime: "desc" },
          skip,
          take: limit,
        }),
        prisma.appointment.count({
          where: { status: { in: ["COMPLETED", "CANCELLED"] } },
        }),
      ]);

      const formatted: AppointmentRecord[] = dbPast.map((apt) => ({
        id: apt.id,
        referenceId: `PRAC-${apt.id.slice(0, 5).toUpperCase()}`,
        doctorId: apt.doctorId,
        doctorName: apt.doctor.name,
        specialty: apt.doctor.doctorProfile?.specialization || "General Medicine",
        clinicInfo: apt.doctor.doctorProfile?.clinicInfo || "Practo Clinic, Bengaluru",
        appointmentDate: format(new Date(apt.startTime), "dd MMM yyyy"),
        timeSlot: `${format(new Date(apt.startTime), "hh:mm a")} - ${format(new Date(apt.endTime), "hh:mm a")}`,
        fee: apt.doctor.doctorProfile?.fee || 500,
        status: apt.status === "COMPLETED" ? "Completed" : "Cancelled",
        notes: apt.patientNotes || undefined,
        patientName: apt.patient.name,
        patientEmail: apt.patient.email,
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

    return errorResponse("Invalid appointment type specified", 400);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database fetch failed";
    return errorResponse(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, startTime, patientNotes } = body;

    if (!doctorId) {
      return errorResponse("Missing required booking fields", 400);
    }

    let startIso = new Date();
    let endIso = new Date(startIso.getTime() + 30 * 60000);

    if (startTime) {
      try {
        startIso = new Date(startTime);
        endIso = new Date(startIso.getTime() + 30 * 60000);
      } catch {
        // Fallback to current time
      }
    }

    const createdApt = await prisma.appointment.create({
      data: {
        doctorId,
        patientId: "patient-1",
        startTime: startIso,
        endTime: endIso,
        status: "CONFIRMED",
        patientNotes: patientNotes || "",
      },
      include: { doctor: { include: { doctorProfile: true } }, patient: true },
    });

    const formatted: AppointmentRecord = {
      id: createdApt.id,
      referenceId: `PRAC-${createdApt.id.slice(0, 5).toUpperCase()}`,
      doctorId: createdApt.doctorId,
      doctorName: createdApt.doctor.name,
      specialty: createdApt.doctor.doctorProfile?.specialization || "General Medicine",
      clinicInfo: createdApt.doctor.doctorProfile?.clinicInfo || "Practo Clinic, Bengaluru",
      appointmentDate: format(new Date(createdApt.startTime), "dd MMM yyyy"),
      timeSlot: `${format(new Date(createdApt.startTime), "hh:mm a")} - ${format(new Date(createdApt.endTime), "hh:mm a")}`,
      fee: createdApt.doctor.doctorProfile?.fee || 500,
      status: "Confirmed",
      notes: createdApt.patientNotes || undefined,
      patientName: createdApt.patient.name,
      patientEmail: createdApt.patient.email,
      createdAt: createdApt.createdAt.toISOString(),
    };

    return successResponse(formatted, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to persist appointment to database";
    return errorResponse(message, 500);
  }
}
