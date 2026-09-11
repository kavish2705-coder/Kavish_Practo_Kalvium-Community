"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { scheduleInputSchema } from "@/lib/validations/schedule";
import type { ApiResponse, DoctorSchedule } from "@/types";
import DoctorWorkspaceNav from "@/components/doctor/DoctorWorkspaceNav";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const emptyForm = {
  dayOfWeek: "",
  startTime: "09:00",
  endTime: "17:00",
  slotDurationMins: "30",
};

type ScheduleFormState = typeof emptyForm;

type ScheduleResponse = ApiResponse<DoctorSchedule>;

type ScheduleListResponse = ApiResponse<DoctorSchedule[]>;

export default function DoctorScheduleManager() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ScheduleFormState>(emptyForm);

  const scheduleByDay = useMemo(
    () =>
      Object.fromEntries(
        schedules.map((schedule) => [schedule.dayOfWeek, schedule]),
      ),
    [schedules],
  );

  async function loadSchedules() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/doctors/schedule");
      const payload = (await response.json()) as ScheduleListResponse;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? "Unable to load weekly schedule");
      }

      setSchedules(
        payload.data.slice().sort((a, b) => a.dayOfWeek - b.dayOfWeek),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load weekly schedule",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/doctors/schedule");
        const payload = (await response.json()) as ScheduleListResponse;

        if (!isActive) return;

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Unable to load weekly schedule");
        }

        setSchedules(
          payload.data.slice().sort((a, b) => a.dayOfWeek - b.dayOfWeek),
        );
      } catch (loadError) {
        if (!isActive) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load weekly schedule",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, []);

  function updateFormField(field: keyof ScheduleFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setSuccess(null);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFieldErrors({});
    setSuccess(null);
  }

  function beginEdit(schedule: DoctorSchedule) {
    setEditingId(schedule.id);
    setForm({
      dayOfWeek: String(schedule.dayOfWeek),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDurationMins: String(schedule.slotDurationMins),
    });
    setFieldErrors({});
    setSuccess(null);
  }

  function validateForm() {
    const payload = {
      dayOfWeek: Number(form.dayOfWeek),
      startTime: form.startTime,
      endTime: form.endTime,
      slotDurationMins: Number(form.slotDurationMins),
    };

    const parsed = scheduleInputSchema.safeParse(payload);

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return null;
    }

    return parsed.data;
  }

  async function submitSchedule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const validated = validateForm();
    if (!validated) {
      return;
    }

    setIsSaving(true);

    try {
      const isEditing = Boolean(editingId);
      const url = editingId
        ? `/api/doctors/schedule?id=${encodeURIComponent(editingId)}`
        : "/api/doctors/schedule";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const payload = (await response.json()) as ScheduleResponse;

      if (!response.ok || !payload.success || !payload.data) {
        const nextErrors = payload.fieldErrors ?? {};
        setFieldErrors(nextErrors);
        setError(payload.error ?? "Unable to save schedule");
        return;
      }

      setSuccess(
        isEditing
          ? "Schedule updated successfully."
          : "Schedule created successfully.",
      );
      setEditingId(null);
      setForm(emptyForm);
      await loadSchedules();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save schedule",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSchedule(scheduleId: string) {
    setDeletingId(scheduleId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/doctors/schedule?id=${encodeURIComponent(scheduleId)}`,
        {
          method: "DELETE",
        },
      );
      const payload = (await response.json()) as ApiResponse<{
        message?: string;
      }>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to delete schedule");
      }

      setSuccess("Schedule removed successfully.");
      await loadSchedules();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete schedule",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50/80 px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-secondary-600">
            Doctor operations
          </p>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            Weekly schedule manager
          </h1>
        </div>

        <DoctorWorkspaceNav />

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={submitSchedule}
            className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit schedule" : "Add working hours"}
              </h2>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="text-slate-700"
                >
                  Cancel
                </Button>
              )}
            </div>

            {error && (
              <div
                className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
                role="alert"
              >
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-5">
              <Select
                label="Day of week"
                value={form.dayOfWeek}
                onChange={(event) =>
                  updateFormField("dayOfWeek", event.target.value)
                }
                options={DAYS.map((day, index) => ({
                  value: String(index),
                  label: day,
                }))}
                error={fieldErrors.dayOfWeek}
                disabled={Boolean(editingId)}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Start time"
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    updateFormField("startTime", event.target.value)
                  }
                  error={fieldErrors.startTime}
                />

                <Input
                  label="End time"
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    updateFormField("endTime", event.target.value)
                  }
                  error={fieldErrors.endTime}
                />
              </div>

              <Input
                label="Slot duration (minutes)"
                type="number"
                min={1}
                step={15}
                value={form.slotDurationMins}
                onChange={(event) =>
                  updateFormField("slotDurationMins", event.target.value)
                }
                error={fieldErrors.slotDurationMins}
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update schedule"
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add schedule
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {isLoading ? (
              <div
                className="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center text-slate-600 shadow-sm"
                role="status"
              >
                Loading your weekly schedule...
              </div>
            ) : (
              DAYS.map((day, dayOfWeek) => {
                const schedule = scheduleByDay[dayOfWeek];
                const hasSchedule = Boolean(schedule);

                return (
                  <div
                    key={day}
                    className={`rounded-2xl border p-4 shadow-sm backdrop-blur-sm ${
                      hasSchedule
                        ? "border-secondary-200 bg-secondary-50/60"
                        : "border-dashed border-slate-300 bg-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {day}
                        </p>
                        <p className="text-sm text-slate-500">
                          {hasSchedule
                            ? "Working hours configured"
                            : "No schedule set"}
                        </p>
                      </div>

                      {!hasSchedule && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setForm({
                              ...emptyForm,
                              dayOfWeek: String(dayOfWeek),
                            });
                            setEditingId(null);
                            setFieldErrors({});
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      )}
                    </div>

                    {hasSchedule ? (
                      <div className="mt-4 rounded-2xl border border-white/70 bg-white/75 p-4">
                        <div className="flex items-center gap-2 text-slate-900">
                          <Clock3 className="h-4 w-4 text-secondary-600" />
                          <span className="font-semibold">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          Slot duration: {schedule.slotDurationMins} minutes
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => beginEdit(schedule)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-rose-200 text-rose-700 hover:bg-rose-50"
                            onClick={() => deleteSchedule(schedule.id)}
                            disabled={deletingId === schedule.id}
                          >
                            {deletingId === schedule.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-sm text-slate-500">
                        No appointment slots configured for this day yet.
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
