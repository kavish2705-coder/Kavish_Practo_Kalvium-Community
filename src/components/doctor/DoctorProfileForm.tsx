"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { doctorProfileInputSchema } from "@/lib/validations/doctorProfile";
import type { ApiResponse, DoctorProfile } from "@/types";
import DoctorWorkspaceNav from "@/components/doctor/DoctorWorkspaceNav";

const initialForm = {
  specialization: "",
  qualification: "",
  experience: "",
  fee: "",
  clinicInfo: "",
};

export default function DoctorProfileForm() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadProfile() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/doctors/profile");
      const payload = (await response.json()) as ApiResponse<DoctorProfile>;

      if (!response.ok || !payload.success || !payload.data) {
        const message = payload.error ?? "Unable to load doctor profile";
        throw new Error(message);
      }

      setProfile(payload.data);
      setForm({
        specialization: payload.data.specialization,
        qualification: payload.data.qualification,
        experience: String(payload.data.experience),
        fee: String(payload.data.fee),
        clinicInfo: payload.data.clinicInfo,
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load doctor profile",
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
        const response = await fetch("/api/doctors/profile");
        const payload = (await response.json()) as ApiResponse<DoctorProfile>;

        if (!isActive) return;

        if (!response.ok || !payload.success || !payload.data) {
          const message = payload.error ?? "Unable to load doctor profile";
          throw new Error(message);
        }

        setProfile(payload.data);
        setForm({
          specialization: payload.data.specialization,
          qualification: payload.data.qualification,
          experience: String(payload.data.experience),
          fee: String(payload.data.fee),
          clinicInfo: payload.data.clinicInfo,
        });
      } catch (loadError) {
        if (!isActive) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load doctor profile",
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

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    if (success) setSuccess(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    const validation = doctorProfileInputSchema.safeParse({
      specialization: form.specialization,
      qualification: form.qualification,
      experience: Number(form.experience),
      fee: Number(form.fee),
      clinicInfo: form.clinicInfo,
    });

    if (!validation.success) {
      const nextFieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !nextFieldErrors[field]) {
          nextFieldErrors[field] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/doctors/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const payload = (await response.json()) as ApiResponse<DoctorProfile>;

      if (!response.ok || !payload.success || !payload.data) {
        const nextErrors = payload.fieldErrors ?? {};
        setFieldErrors(nextErrors);
        setError(payload.error ?? "Unable to save doctor profile");
        return;
      }

      setProfile(payload.data);
      setForm({
        specialization: payload.data.specialization,
        qualification: payload.data.qualification,
        experience: String(payload.data.experience),
        fee: String(payload.data.fee),
        clinicInfo: payload.data.clinicInfo,
      });
      setSuccess("Profile updated successfully.");
      setFieldErrors({});
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save doctor profile",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50/80 px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-secondary-600">
            Doctor settings
          </p>
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            Professional profile
          </h1>
        </div>

        <DoctorWorkspaceNav />

        {isLoading ? (
          <div
            className="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center text-slate-600 shadow-sm"
            role="status"
          >
            Loading profile details...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm sm:p-8"
          >
            {error && (
              <div
                className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
                role="alert"
              >
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Specialization"
                value={form.specialization}
                onChange={(event) =>
                  updateField("specialization", event.target.value)
                }
                error={fieldErrors.specialization}
                placeholder="Cardiology"
              />

              <Input
                label="Qualification"
                value={form.qualification}
                onChange={(event) =>
                  updateField("qualification", event.target.value)
                }
                error={fieldErrors.qualification}
                placeholder="MBBS, MD"
              />

              <Input
                label="Experience (years)"
                type="number"
                min={0}
                value={form.experience}
                onChange={(event) =>
                  updateField("experience", event.target.value)
                }
                error={fieldErrors.experience}
                placeholder="12"
              />

              <Input
                label="Consultation fee"
                type="number"
                min={0}
                step="1"
                value={form.fee}
                onChange={(event) => updateField("fee", event.target.value)}
                error={fieldErrors.fee}
                placeholder="800"
              />
            </div>

            <div className="mt-5">
              <Textarea
                label="Clinic information"
                value={form.clinicInfo}
                onChange={(event) =>
                  updateField("clinicInfo", event.target.value)
                }
                error={fieldErrors.clinicInfo}
                placeholder="Clinic address, hospital name, and practice details"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                {profile
                  ? `Profile ID: ${profile.id.slice(0, 8)}`
                  : "Loading profile..."}
              </div>

              <Button
                type="submit"
                disabled={isSaving}
                className="min-w-[180px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save profile"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
