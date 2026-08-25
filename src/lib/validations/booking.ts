import { z } from "zod";

export const bookingFormSchema = z.object({
  doctorId: z.string().min(1, "Doctor selection is required"),
  appointmentDate: z.string().min(1, "Please select an appointment date"),
  startTime: z.string().min(1, "Please select a time slot"),
  patientName: z.string().min(2, "Please enter your name."),
  patientEmail: z.string().email("Please enter a valid email address."),
  patientPhone: z
    .string()
    .regex(/^[0-9]{10}$/, "Please enter a valid phone number."),
  patientAge: z
    .string()
    .min(1, "Please enter a valid age.")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0 && num <= 120;
    }, "Please enter a valid age."),
  patientGender: z
    .string()
    .min(1, "Please select your gender."),
  patientNotes: z
    .string()
    .max(500, "Reason for visit cannot exceed 500 characters.")
    .optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
