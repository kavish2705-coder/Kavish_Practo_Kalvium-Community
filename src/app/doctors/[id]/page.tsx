"use client";

import { use, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import BookingForm from "@/components/booking/BookingForm";
import BookingModal from "@/components/booking/BookingModal";
import { getDoctorById } from "@/lib/mockData";
import { DoctorCardData } from "@/types";
import { Star, MapPin, Award, IndianRupee, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const doctor = getDoctorById(id);

  const [modalDoctor, setModalDoctor] = useState<DoctorCardData | null>(null);

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            The requested doctor profile does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/doctors">Browse All Doctors</Link>
          </Button>
        </div>
      </div>
    );
  }

  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-secondary-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Doctors Catalog
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/60 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary-600 to-secondary-800 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-secondary-600/30 shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {doctor.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-semibold border border-secondary-200">
                  {doctor.specialization}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-1">{doctor.qualification}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating} ({doctor.totalReviews} reviews)</span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <Award className="h-4 w-4 text-secondary-600" />
                  <span>{doctor.experience} Years Experience</span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 font-semibold">
                  <IndianRupee className="h-4 w-4 text-secondary-700" />
                  <span>₹{doctor.fee} Consultation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-white/60">
              <h3 className="text-lg font-bold text-slate-900 mb-3">About Doctor</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {doctor.about ||
                  "Dr. " + doctor.name + " is a renowned " + doctor.specialization + " with " + doctor.experience + " years of clinical experience."}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/60">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Clinic Location</h3>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin className="h-5 w-5 text-secondary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{doctor.clinicInfo}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Open Mon - Sat (09:00 AM - 08:00 PM)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 border border-white/60 sticky top-20 shadow-xl">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">Book Appointment</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a slot to confirm your consultation.
                </p>
              </div>

              <BookingForm
                doctor={doctor}
                onSuccess={() => setModalDoctor(doctor)}
              />
            </div>
          </div>
        </div>
      </main>

      <BookingModal
        doctor={modalDoctor}
        isOpen={!!modalDoctor}
        onClose={() => setModalDoctor(null)}
      />

      <footer className="bg-slate-950 py-8 border-t border-slate-800 text-center text-slate-400 text-xs">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Practo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
