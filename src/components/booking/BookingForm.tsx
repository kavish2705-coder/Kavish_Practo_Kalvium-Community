import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { bookingFormSchema, BookingFormValues } from "@/lib/validations/booking";
import { DoctorCardData } from "@/types";
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

  const selectedDate = useWatch({ control, name: "appointmentDate" }) || defaultDate;
  const selectedStartTime = useWatch({ control, name: "startTime" }) || "";

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmitting(false);

    const refId = generateRefId();
    onSuccess({ ...data, referenceId: refId });
  };

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4 bg-secondary-50/90 dark:bg-secondary-950/70 p-4 rounded-2xl border border-secondary-200/80 dark:border-secondary-800">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-800 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          {doctor.name.replace("Dr. ", "").charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white">{doctor.name}</h4>
          <p className="text-xs text-secondary-800 dark:text-secondary-200 font-semibold">
            {doctor.specialization} • {doctor.clinicInfo}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-600 dark:text-slate-300 block font-medium">Fee</span>
          <span className="font-bold text-slate-900 dark:text-white flex items-center justify-end text-sm">
            <IndianRupee className="h-3.5 w-3.5 text-secondary-700 dark:text-secondary-400" />
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

      <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          Patient Details
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Patient Full Name"
            placeholder="e.g. John Doe"
            icon={<User className="h-4 w-4" />}
            {...register("patientName")}
            error={errors.patientName?.message}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon={<Mail className="h-4 w-4" />}
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
              icon={<Phone className="h-4 w-4" />}
              {...register("patientPhone")}
              error={errors.patientPhone?.message}
            />
          </div>

          <div className="sm:col-span-1">
            <Input
              label="Age"
              type="number"
              placeholder="28"
              icon={<UserCheck className="h-4 w-4" />}
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

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px] shadow-md bg-secondary-600 text-white hover:bg-secondary-700">
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
