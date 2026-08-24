import { Role, AppointmentStatus } from '@prisma/client';

export type ApiResponse<T = any> = {
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
