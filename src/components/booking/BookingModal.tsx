import { useState } from "react";
import { DoctorCardData } from "@/types";
import { BookingFormValues } from "@/lib/validations/booking";
import BookingForm from "./BookingForm";
import { X, CheckCircle2, Calendar, Clock, MapPin, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";

interface BookingModalProps {
  doctor: DoctorCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ doctor, isOpen, onClose }: BookingModalProps) {
  const [confirmedBooking, setConfirmedBooking] = useState<
    (BookingFormValues & { referenceId: string }) | null
  >(null);

  if (!isOpen || !doctor) return null;

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl bg-white/95 border border-slate-200 text-slate-900">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {!confirmedBooking ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-800 bg-secondary-100 px-3 py-1 rounded-full border border-secondary-200 inline-block mb-2">
                Instant Appointment
              </span>
              <h3 className="text-2xl font-bold text-slate-900">Book Appointment</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Select your preferred slot and enter patient details for instant confirmation.
              </p>
            </div>

            <BookingForm
              doctor={doctor}
              onCancel={handleClose}
              onSuccess={(data) => setConfirmedBooking(data)}
            />
          </div>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-secondary-100 text-secondary-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-semibold text-secondary-800 uppercase tracking-widest bg-secondary-100/80 px-3 py-1 rounded-full border border-secondary-200">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-3">Appointment Scheduled!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Reference ID: <span className="font-mono font-bold text-slate-900">{confirmedBooking.referenceId}</span>
              </p>
            </div>

            <div className="bg-slate-100/80 p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-600 text-xs font-medium">Doctor</span>
                <span className="font-bold text-slate-900">{doctor.name} ({doctor.specialization})</span>
              </div>

              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Calendar className="h-4 w-4 text-secondary-600 shrink-0" />
                <span>Date: {format(new Date(confirmedBooking.appointmentDate), "EEEE, dd MMMM yyyy")}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Clock className="h-4 w-4 text-secondary-600 shrink-0" />
                <span>Time: {format(new Date(confirmedBooking.startTime), "hh:mm a")}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate">{doctor.clinicInfo}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-800 pt-2 border-t border-slate-200">
                <User className="h-4 w-4 text-slate-500 shrink-0" />
                <span>
                  Patient: <span className="font-bold text-slate-900">{confirmedBooking.patientName}</span> ({confirmedBooking.patientAge} yrs, {confirmedBooking.patientGender})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-secondary-600" />
              <span>A confirmation email has been sent to {confirmedBooking.patientEmail}</span>
            </div>

            <Button onClick={handleClose} size="lg" className="w-full shadow-md bg-secondary-600 text-white hover:bg-secondary-700">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
