import { z } from "zod";

export const doctorProfileInputSchema = z.object({
  specialization: z
    .string()
    .trim()
    .min(2, "Specialization is required")
    .max(120, "Specialization must be under 120 characters"),
  qualification: z
    .string()
    .trim()
    .min(2, "Qualification is required")
    .max(160, "Qualification must be under 160 characters"),
  experience: z
    .number()
    .int()
    .nonnegative("Experience must be zero or greater"),
  fee: z.number().nonnegative("Consultation fee must be zero or greater"),
  clinicInfo: z
    .string()
    .trim()
    .min(10, "Clinic information is required")
    .max(500, "Clinic information must be under 500 characters"),
});

export type DoctorProfileInput = z.infer<typeof doctorProfileInputSchema>;
