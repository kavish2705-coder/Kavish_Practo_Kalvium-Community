import { z } from "zod";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const scheduleInputSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(TIME_PATTERN, "Use HH:mm format"),
    endTime: z.string().regex(TIME_PATTERN, "Use HH:mm format"),
    slotDurationMins: z.number().int().positive(),
  })
  .superRefine((value, context) => {
    const [startHour, startMinute] = value.startTime.split(":").map(Number);
    const [endHour, endMinute] = value.endTime.split(":").map(Number);
    const intervalMins =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);

    if (intervalMins <= 0) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
    } else if (value.slotDurationMins > intervalMins) {
      context.addIssue({
        code: "custom",
        path: ["slotDurationMins"],
        message: "Slot duration must fit within the working interval",
      });
    }
  });

export type ScheduleInput = z.infer<typeof scheduleInputSchema>;
