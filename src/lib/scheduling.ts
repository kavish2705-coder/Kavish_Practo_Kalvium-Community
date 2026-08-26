import type { Schedule } from "@prisma/client";
import type { TimeSlot } from "@/types";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

export function parseLocalDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

export function getLocalDayBounds(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function setTimeOnDate(date: Date, time: string): Date | null {
  const match = TIME_PATTERN.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function generateAvailableSlots(
  schedule: Schedule,
  date: Date,
  bookedStartTimes: Set<number> = new Set(),
  now = new Date(),
): TimeSlot[] {
  if (schedule.slotDurationMins <= 0) {
    return [];
  }

  const start = setTimeOnDate(date, schedule.startTime);
  const end = setTimeOnDate(date, schedule.endTime);

  if (!start || !end || end <= start) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const duration = schedule.slotDurationMins * 60 * 1000;

  for (
    let slotStart = start.getTime();
    slotStart + duration <= end.getTime();
    slotStart += duration
  ) {
    const slotEnd = new Date(slotStart + duration);

    if (slotStart > now.getTime() && !bookedStartTimes.has(slotStart)) {
      slots.push({
        startTime: new Date(slotStart),
        endTime: slotEnd,
        isAvailable: true,
      });
    }
  }

  return slots;
}

export function getScheduleSlot(
  schedule: Schedule,
  date: Date,
  requestedStart: Date,
): TimeSlot | null {
  const start = setTimeOnDate(date, schedule.startTime);
  const end = setTimeOnDate(date, schedule.endTime);
  const duration = schedule.slotDurationMins * 60 * 1000;

  if (!start || !end || duration <= 0 || end <= start) {
    return null;
  }

  const offset = requestedStart.getTime() - start.getTime();

  if (
    offset < 0 ||
    offset % duration !== 0 ||
    requestedStart.getTime() + duration > end.getTime()
  ) {
    return null;
  }

  return {
    startTime: new Date(requestedStart),
    endTime: new Date(requestedStart.getTime() + duration),
    isAvailable: true,
  };
}
