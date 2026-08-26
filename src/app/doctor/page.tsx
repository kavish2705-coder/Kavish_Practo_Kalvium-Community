"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3, FileText, RefreshCw } from "lucide-react";
import type { ApiResponse, DoctorAppointment } from "@/types";

type AppointmentPayload = Omit<DoctorAppointment, "startTime" | "endTime"> & {
  startTime: string;
  endTime: string;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClasses(status: DoctorAppointment["status"]) {
  if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-800";
  if (status === "COMPLETED") return "bg-sky-100 text-sky-800";
  return "bg-rose-100 text-rose-800";
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAppointments() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/doctors/appointments");
      const payload = (await response.json()) as ApiResponse<
        AppointmentPayload[]
      >;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? "Unable to load appointments");
      }

      setAppointments(
        payload.data.map((appointment) => ({
          ...appointment,
          startTime: new Date(appointment.startTime),
          endTime: new Date(appointment.endTime),
        })),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load appointments",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function fetchAppointments() {
      await loadAppointments();
    }

    void fetchAppointments();
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-secondary-600">
              Doctor workspace
            </p>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Today&apos;s Appointments
            </h1>
            <p className="mt-2 text-slate-600">
              Your confirmed and completed consultations for today.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadAppointments()}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-secondary-500 hover:text-secondary-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {isLoading && (
          <div
            className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-600"
            role="status"
          >
            Loading today&apos;s appointments...
          </div>
        )}

        {!isLoading && error && (
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800"
            role="alert"
          >
            {error}
          </div>
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarDays className="mx-auto mb-4 h-10 w-10 text-secondary-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              No appointments today
            </h2>
            <p className="mt-2 text-slate-600">
              Your schedule is clear for the day.
            </p>
          </div>
        )}

        {!isLoading && !error && appointments.length > 0 && (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[8rem_1fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Clock3 className="h-4 w-4 text-secondary-600" />
                  <span>{formatTime(appointment.startTime.toISOString())}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {appointment.patient.name}
                  </h2>
                  {appointment.patientNotes && (
                    <p className="mt-1 flex items-start gap-2 text-sm text-slate-600">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{appointment.patientNotes}</span>
                    </p>
                  )}
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClasses(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
