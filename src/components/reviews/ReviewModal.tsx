"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { X, Loader2, CheckCircle2, AlertCircle, Award } from "lucide-react";

interface AppointmentForReview {
  id: string;
  referenceId: string;
  doctorName: string;
  specialty: string;
  clinicInfo: string;
  appointmentDate: string;
}

interface ReviewModalProps {
  appointment: AppointmentForReview | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointmentId: string, rating: number, comment?: string) => void;
}

export default function ReviewModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit review");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(appointment.id, rating, comment.trim() || undefined);
        setIsSuccess(false);
        setComment("");
        setRating(5);
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error("Review submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 relative text-slate-900">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Review Submitted!</h3>
            <p className="text-xs text-slate-600">
              Thank you for sharing your consultation feedback.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800 text-[11px] font-bold border border-secondary-200 mb-2">
                <Award className="h-3 w-3 text-secondary-600" />
                Verified Visit Review
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Rate Your Consultation
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Ref: <span className="font-mono font-semibold">{appointment.referenceId}</span> • Doctor:{" "}
                <span className="font-bold text-slate-800">{appointment.doctorName}</span> ({appointment.specialty})
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Overall Rating <span className="text-rose-500">*</span>
              </label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
            </div>

            <Textarea
              label="Written Review / Feedback (Optional)"
              placeholder="How was your consultation experience? Share details about doctor attentiveness, diagnosis clarity, or clinic environment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-xs shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
