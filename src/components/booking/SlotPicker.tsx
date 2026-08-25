import { useMemo } from "react";
import { format, addDays } from "date-fns";
import { TimeSlot } from "@/types";
import { getMockSlotsForDate } from "@/lib/mockData";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

interface SlotPickerProps {
  doctorId: string;
  selectedDate: string;
  selectedTimeSlot: string;
  onDateChange: (dateStr: string) => void;
  onSlotSelect: (isoTimeStr: string) => void;
  error?: string;
}

export default function SlotPicker({
  doctorId,
  selectedDate,
  selectedTimeSlot,
  onDateChange,
  onSlotSelect,
  error,
}: SlotPickerProps) {
  const upcomingDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = addDays(new Date(), i);
        return {
          dateStr: format(d, "yyyy-MM-dd"),
          dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE"),
          dayNum: format(d, "dd MMM"),
        };
      }),
    []
  );

  const activeDate = selectedDate || upcomingDays[0].dateStr;

  const slots: TimeSlot[] = useMemo(() => {
    if (!activeDate || !doctorId) return [];
    return getMockSlotsForDate(doctorId, activeDate);
  }, [activeDate, doctorId]);

  const morningSlots = slots.filter(
    (s) => new Date(s.startTime).getHours() < 12
  );
  const afternoonSlots = slots.filter((s) => {
    const h = new Date(s.startTime).getHours();
    return h >= 12 && h < 16;
  });
  const eveningSlots = slots.filter(
    (s) => new Date(s.startTime).getHours() >= 16
  );

  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2.5">
          <CalendarIcon className="h-3.5 w-3.5 text-secondary-600 dark:text-secondary-400" />
          Select Appointment Date
        </label>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {upcomingDays.map((day) => {
            const isSelected = activeDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => {
                  onDateChange(day.dateStr);
                  onSlotSelect("");
                }}
                className={
                  "flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all cursor-pointer " +
                  (isSelected
                    ? "bg-secondary-600 text-white border-secondary-600 shadow-md shadow-secondary-600/30 font-bold"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-secondary-50 dark:hover:bg-slate-700 hover:border-secondary-300 font-medium")
                }
              >
                <span className="font-semibold text-[11px]">{day.dayName}</span>
                <span className="text-xs opacity-90 mt-0.5">{day.dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2.5">
          <Clock className="h-3.5 w-3.5 text-secondary-600 dark:text-secondary-400" />
          Select Time Slot
        </label>

        {slots.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs text-center border border-slate-200 dark:border-slate-700">
            Loading available slots...
          </div>
        ) : (
          <div className="space-y-4 bg-slate-100/70 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            {morningSlots.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2 block">
                  Morning
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => {
                    const timeStr = format(new Date(slot.startTime), "hh:mm a");
                    const isoStr = new Date(slot.startTime).toISOString();
                    const isSelected = selectedTimeSlot === isoStr;

                    return (
                      <button
                        key={isoStr}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => onSlotSelect(isoStr)}
                        className={
                          "py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer " +
                          (isSelected
                            ? "bg-secondary-600 text-white ring-2 ring-secondary-600 shadow-sm font-bold"
                            : slot.isAvailable
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-secondary-600 hover:text-white dark:hover:bg-secondary-600 dark:hover:text-white"
                            : "bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed line-through opacity-60")
                        }
                      >
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {afternoonSlots.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2 block">
                  Afternoon
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {afternoonSlots.map((slot) => {
                    const timeStr = format(new Date(slot.startTime), "hh:mm a");
                    const isoStr = new Date(slot.startTime).toISOString();
                    const isSelected = selectedTimeSlot === isoStr;

                    return (
                      <button
                        key={isoStr}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => onSlotSelect(isoStr)}
                        className={
                          "py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer " +
                          (isSelected
                            ? "bg-secondary-600 text-white ring-2 ring-secondary-600 shadow-sm font-bold"
                            : slot.isAvailable
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-secondary-600 hover:text-white dark:hover:bg-secondary-600 dark:hover:text-white"
                            : "bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed line-through opacity-60")
                        }
                      >
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {eveningSlots.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2 block">
                  Evening
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {eveningSlots.map((slot) => {
                    const timeStr = format(new Date(slot.startTime), "hh:mm a");
                    const isoStr = new Date(slot.startTime).toISOString();
                    const isSelected = selectedTimeSlot === isoStr;

                    return (
                      <button
                        key={isoStr}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => onSlotSelect(isoStr)}
                        className={
                          "py-2 px-2.5 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer " +
                          (isSelected
                            ? "bg-secondary-600 text-white ring-2 ring-secondary-600 shadow-sm font-bold"
                            : slot.isAvailable
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-secondary-600 hover:text-white dark:hover:bg-secondary-600 dark:hover:text-white"
                            : "bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed line-through opacity-60")
                        }
                      >
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-1 text-xs text-red-500 font-medium mt-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
