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
    <div className="glass-card rounded-2xl p-6 border border-slate-700/80 bg-slate-900/95 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-secondary-600/30 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-white text-lg truncate group-hover:text-secondary-300 transition-colors">
                {doctor.name}
              </h3>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{doctor.rating}</span>
                <span className="text-slate-600 font-normal">({doctor.totalReviews})</span>
              </div>
            </div>
            
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-secondary-950 text-secondary-200 text-xs font-semibold border border-secondary-800">
              {doctor.specialization}
            </span>
            
            <p className="text-xs text-slate-300 mt-1 line-clamp-1 font-medium">
              {doctor.qualification}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs mb-6 bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-secondary-300 shrink-0" />
            <span className="font-semibold text-slate-200">{doctor.experience} Years Experience</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium text-slate-200">{doctor.clinicInfo}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/80">
            <div className="flex items-center gap-1 text-white font-bold">
              <IndianRupee className="h-3.5 w-3.5 text-secondary-300" />
              <span>₹{doctor.fee}</span>
              <span className="text-[11px] font-medium text-slate-300">Consultation Fee</span>
            </div>

            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary-200 bg-secondary-950 px-2 py-0.5 rounded-md border border-secondary-800">
              <Calendar className="h-3 w-3 text-secondary-300" />
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
          className="w-full text-xs font-semibold border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white"
        >
          <Link href={'/doctors/' + doctor.id}>View Profile</Link>
        </Button>

        <Button
          size="sm"
          onClick={() => onBook(doctor)}
          className="w-full text-xs font-semibold bg-secondary-600 text-white hover:bg-secondary-700 shadow-md"
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
