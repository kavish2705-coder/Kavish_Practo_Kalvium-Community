import { Role } from "@prisma/client";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

// Doctor schedule slot
export type TimeSlot = {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
};

// Appointment booking request payload
export type BookAppointmentRequest = {
  doctorId: string;
  startTime: string; // ISO string
  patientNotes?: string;
};

// Doctor dashboard appointment
export type DoctorAppointment = {
  id: string;
  patient: Pick<SafeUser, "id" | "name">;
  startTime: Date;
  endTime: Date;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  patientNotes: string | null;
};

// Doctor card data
export type DoctorCardData = {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: number; // in years
  fee: number; // consultation fee
  clinicInfo: string;
  avatarUrl?: string;
  rating: number;
  totalReviews: number;
  nextAvailableSlot: string;
  about?: string;
};

export type Specialty = {
  id: string;
  name: string;
  description: string;
  iconName: string;
  doctorCount: number;
};

export type DoctorFilterState = {
  search: string;
  specialization: string;
  minExperience: number;
  maxFee: number;
  sortBy: "experience-desc" | "fee-asc" | "rating-desc";
};
