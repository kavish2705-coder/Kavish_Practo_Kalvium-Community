import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { bookingFormSchema, BookingFormValues } from "@/lib/validations/booking";
import { DoctorCardData, SafeUser } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import SlotPicker from "./SlotPicker";
import { User, Mail, Phone, IndianRupee, Loader2, CheckCircle2, UserCheck } from "lucide-react";
import { generateRefId } from "@/lib/utils";

interface BookingFormProps {
  doctor: DoctorCardData;
  onSuccess: (bookingData: BookingFormValues & { referenceId: string }) => void;
  onCancel?: () => void;
}

export default function BookingForm({ doctor, onSuccess, onCancel }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<SafeUser | null>(null);
  const defaultDate = format(new Date(), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      doctorId: doctor.id,
      appointmentDate: defaultDate,
      startTime: "",
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      patientAge: "",
      patientGender: "",
      patientNotes: "",
    },
  });

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchAuthUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.success && json.data) {
            const currentUser: SafeUser = json.data;
            setUser(currentUser);
            if (currentUser.name) {
              setValue("patientName", currentUser.name, { shouldValidate: false });
            }
            if (currentUser.email) {
              setValue("patientEmail", currentUser.email, { shouldValidate: false });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch auth user in BookingForm:", err);
      }
    }

    fetchAuthUser();

    return () => {
      ignore = true;
    };
  }, [setValue]);

  const selectedDate = useWatch({ control, name: "appointmentDate" }) || defaultDate;
  const selectedStartTime = useWatch({ control, name: "startTime" }) || "";

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setApiError(null);

    if (!user) {
      setApiError("Authentication required. Please log in as a patient to book an appointment.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          patientId: user.id,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Booking failed (Server returned ${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Response was not JSON
        }
        setApiError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      const result = await response.json().catch(() => ({}));
      const referenceId =
        result?.data?.referenceId ||
        result?.referenceId ||
        result?.id ||
        generateRefId();

      setIsSubmitting(false);
      onSuccess({ ...data, referenceId });
    } catch (err: unknown) {
      console.error("Booking API submission error:", err);
      setApiError(
        err instanceof Error
          ? err.message
          : "Unable to connect to booking service. Please try again later."
      );
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center justify-between shadow-xs">
          <span>{apiError}</span>
          <button
            type="button"
            onClick={() => setApiError(null)}
            className="text-red-500 hover:text-red-800 font-bold ml-3 text-sm focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex items-center gap-4 bg-secondary-50/80 p-4 rounded-2xl border border-secondary-200">
        <div className="w-12 h-12 rounded-xl bg-secondary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          {doctor.name.replace("Dr. ", "").charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900">{doctor.name}</h4>
          <p className="text-xs text-secondary-800 font-semibold">
            {doctor.specialization} • {doctor.clinicInfo}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-600 block font-medium">Fee</span>
          <span className="font-bold text-slate-900 flex items-center justify-end text-sm">
            <IndianRupee className="h-3.5 w-3.5 text-secondary-700" />
            {doctor.fee}
          </span>
        </div>
      </div>

      <SlotPicker
        doctorId={doctor.id}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedStartTime}
        onDateChange={(dateStr) => setValue("appointmentDate", dateStr, { shouldValidate: true })}
        onSlotSelect={(isoTimeStr) => setValue("startTime", isoTimeStr, { shouldValidate: true })}
        error={errors.startTime?.message || errors.appointmentDate?.message}
      />

      <div className="space-y-4 pt-2 border-t border-slate-200">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Patient Details
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Patient Full Name"
            placeholder="e.g. John Doe"
            icon={<User className="h-4 w-4 text-slate-500" />}
            {...register("patientName")}
            error={errors.patientName?.message}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon={<Mail className="h-4 w-4 text-slate-500" />}
            {...register("patientEmail")}
            error={errors.patientEmail?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="9876543210"
              icon={<Phone className="h-4 w-4 text-slate-500" />}
              {...register("patientPhone")}
              error={errors.patientPhone?.message}
            />
          </div>

          <div className="sm:col-span-1">
            <Input
              label="Age"
              type="number"
              placeholder="28"
              icon={<UserCheck className="h-4 w-4 text-slate-500" />}
              {...register("patientAge")}
              error={errors.patientAge?.message}
            />
          </div>

          <div className="sm:col-span-1">
            <Select
              label="Gender"
              options={genderOptions}
              {...register("patientGender")}
              error={errors.patientGender?.message}
            />
          </div>
        </div>

        <Textarea
          label="Reason for Visit / Patient Notes (Optional)"
          placeholder="Describe symptoms, medical history, or specific requests..."
          maxLength={500}
          {...register("patientNotes")}
          error={errors.patientNotes?.message}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px] shadow-md bg-secondary-600 text-white hover:bg-secondary-700 font-semibold">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Booking...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Appointment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
