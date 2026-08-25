import { z } from "zod";

export const bookingFormSchema = z.object({
  doctorId: z.string().min(1, "Doctor selection is required"),
  appointmentDate: z.string().min(1, "Please select an appointment date"),
  startTime: z.string().min(1, "Please select a time slot"),
  patientName: z.string().min(2, "Full name must be at least 2 characters"),
  patientEmail: z.string().email("Please enter a valid email address"),
  patientPhone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  patientNotes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
