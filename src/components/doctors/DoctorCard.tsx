import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DoctorCardData } from "@/types";
import { Star, MapPin, Calendar, Award, IndianRupee } from "lucide-react";

interface DoctorCardProps {
  doctor: DoctorCardData;
  onBook: (doctor: DoctorCardData) => void;
}

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-secondary-600/20 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-secondary-700 transition-colors">
                {doctor.name}
              </h3>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60 shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.totalReviews})</span>
              </div>
            </div>
            
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-medium border border-secondary-200">
              {doctor.specialization}
            </span>
            
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {doctor.qualification}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600 mb-6 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-secondary-600 shrink-0" />
            <span className="font-medium text-slate-700">{doctor.experience} Years Experience</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{doctor.clinicInfo}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <div className="flex items-center gap-1 text-slate-800 font-semibold">
              <IndianRupee className="h-3.5 w-3.5 text-secondary-700" />
              <span>₹{doctor.fee}</span>
              <span className="text-[11px] font-normal text-slate-500">Consultation Fee</span>
            </div>

            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary-700 bg-secondary-50 px-2 py-0.5 rounded-md border border-secondary-200">
              <Calendar className="h-3 w-3" />
              <span>{doctor.nextAvailableSlot}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full text-xs font-medium"
        >
          <Link href={'/doctors/' + doctor.id}>View Profile</Link>
        </Button>

        <Button
          size="sm"
          onClick={() => onBook(doctor)}
          className="w-full text-xs font-semibold shadow-sm"
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
