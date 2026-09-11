"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import DoctorWorkspaceNav from "@/components/doctor/DoctorWorkspaceNav";
import type { ApiResponse, DoctorAppointment } from "@/types";

type AppointmentPayload = Omit<DoctorAppointment, "startTime" | "endTime"> & {
  startTime: string;
  endTime: string;
};

function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClasses(status: DoctorAppointment["status"]) {
  if (status === "CONFIRMED")
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  if (status === "COMPLETED")
    return "bg-sky-100 text-sky-800 border border-sky-200";
  return "bg-rose-100 text-rose-800 border border-rose-200";
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      ),
    [appointments],
  );

  async function loadAppointments() {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetch("/api/doctors/appointments");
      const payload = (await response.json()) as ApiResponse<
        AppointmentPayload[]
      >;

      if (!response.ok || !payload.success || !payload.data) {
        const message = payload.error ?? "Unable to load appointments";

        if (response.status === 401 || response.status === 403) {
          setError(
            "Your session is not authorized to view doctor appointments.",
          );
          return;
        }

        throw new Error(message);
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
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/doctors/appointments");
        const payload = (await response.json()) as ApiResponse<
          AppointmentPayload[]
        >;

        if (!isActive) return;

        if (!response.ok || !payload.success || !payload.data) {
          const message = payload.error ?? "Unable to load appointments";

          if (response.status === 401 || response.status === 403) {
            setError(
              "Your session is not authorized to view doctor appointments.",
            );
            return;
          }

          throw new Error(message);
        }

        setAppointments(
          payload.data.map((appointment) => ({
            ...appointment,
            startTime: new Date(appointment.startTime),
            endTime: new Date(appointment.endTime),
          })),
        );
      } catch (loadError) {
        if (!isActive) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load appointments",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, []);

  async function updateAppointmentStatus(
    appointmentId: string,
    status: "COMPLETED" | "CANCELLED",
  ) {
    setUpdatingId(appointmentId);
    setStatusError(null);

    try {
      const response = await fetch(
        `/api/appointments/${encodeURIComponent(appointmentId)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const payload = (await response.json()) as ApiResponse<{
        id: string;
        status: DoctorAppointment["status"];
      }>;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? "Unable to update appointment status");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === payload.data?.id
            ? { ...appointment, status: payload.data.status }
            : appointment,
        ),
      );
    } catch (updateError) {
      setStatusError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update appointment status",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50/80 px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-secondary-600">
            Doctor workspace
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
                Today&apos;s appointments
              </h1>
              <p className="mt-2 text-slate-600">
                Monitor your patient visits, notes, and progress for the day.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadAppointments()}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing" : "Refresh"}
            </Button>
          </div>
        </div>

        <DoctorWorkspaceNav />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Total
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {sortedAppointments.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Confirmed
            </p>
            <p className="mt-3 text-3xl font-bold text-emerald-700">
              {
                sortedAppointments.filter((item) => item.status === "CONFIRMED")
                  .length
              }
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Completed
            </p>
            <p className="mt-3 text-3xl font-bold text-sky-700">
              {
                sortedAppointments.filter((item) => item.status === "COMPLETED")
                  .length
              }
            </p>
          </div>
        </div>

        <div className="mt-8">
          {statusError && (
            <div
              className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm"
              role="alert"
            >
              {statusError}
            </div>
          )}

          {isLoading && (
            <div
              className="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center text-slate-600 shadow-sm"
              role="status"
            >
              Loading today&apos;s appointments...
            </div>
          )}

          {!isLoading && error && (
            <div
              className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm"
              role="alert"
            >
              <p className="font-semibold">Unable to load appointments</p>
              <p className="mt-1">{error}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => void loadAppointments()}
              >
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !error && sortedAppointments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-sm">
              <CalendarDays className="mx-auto mb-4 h-10 w-10 text-secondary-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                No appointments today
              </h2>
              <p className="mt-2 text-slate-600">
                Your schedule is clear for the day.
              </p>
            </div>
          )}

          {!isLoading && !error && sortedAppointments.length > 0 && (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="grid gap-4 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur-sm md:grid-cols-[9rem_1fr_auto] md:items-center"
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Clock3 className="h-4 w-4 text-secondary-600" />
                    <span>{formatTime(appointment.startTime)}</span>
                    <span className="text-slate-500">-</span>
                    <span>{formatTime(appointment.endTime)}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {appointment.patient.name}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClasses(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    {appointment.patientNotes ? (
                      <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-secondary-600" />
                        <span>{appointment.patientNotes}</span>
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        No patient notes added.
                      </p>
                    )}
                  </div>

                  {appointment.status === "CONFIRMED" && (
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          void updateAppointmentStatus(
                            appointment.id,
                            "COMPLETED",
                          )
                        }
                        disabled={updatingId === appointment.id}
                      >
                        {updatingId === appointment.id
                          ? "Updating..."
                          : "Mark completed"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-rose-200 text-rose-700 hover:bg-rose-50"
                        onClick={() =>
                          void updateAppointmentStatus(
                            appointment.id,
                            "CANCELLED",
                          )
                        }
                        disabled={updatingId === appointment.id}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                      Duration
                    </span>
                    <span className="font-semibold text-slate-900">
                      {Math.max(
                        30,
                        Math.round(
                          (new Date(appointment.endTime).getTime() -
                            new Date(appointment.startTime).getTime()) /
                            60000,
                        ),
                      )}{" "}
                      min
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
