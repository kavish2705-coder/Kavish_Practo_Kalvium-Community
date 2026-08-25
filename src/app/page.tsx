"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import DoctorCard from "@/components/doctors/DoctorCard";
import BookingModal from "@/components/booking/BookingModal";
import { MOCK_DOCTORS, MOCK_SPECIALTIES } from "@/lib/mockData";
import { DoctorCardData } from "@/types";
import {
  Search,
  Calendar,
  Activity,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  Baby,
  Stethoscope,
  Brain,
  ArrowRight,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] =
    useState<DoctorCardData | null>(null);

  const featuredDoctors = MOCK_DOCTORS.slice(0, 3);

  const getSpecialtyIcon = (iconName: string) => {
    switch (iconName) {
      case "HeartPulse":
        return <HeartPulse className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />;
      case "Sparkles":
        return <Sparkles className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />;
      case "Baby":
        return <Baby className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />;
      case "Stethoscope":
        return <Stethoscope className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />;
      case "Activity":
        return <Activity className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />;
      case "Brain":
        return <Brain className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />;
      default:
        return <Stethoscope className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-50/90 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-16 md:pt-24 pb-20">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-secondary-200/40 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-secondary-100/50 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply" />

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-secondary-200 text-xs font-semibold text-secondary-800 mb-6 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-secondary-600 animate-pulse" />
                Verified Doctors Available Now on Practo
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Expert Healthcare,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-800">
                  Just a Click Away.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                Find top-rated specialists, check real-time slot availability, and book your appointment instantly. No waiting, no double-bookings.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-secondary-600/20">
                  <Link href="/doctors">
                    <Search className="mr-2 h-5 w-5" />
                    Find a Doctor
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base bg-white/60 backdrop-blur-sm">
                  <Link href="#specialties">View Specialties</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                  <span>100% Verified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                  <span>Instant Slot Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                  <span>Zero Double Bookings</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-2xl relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    P
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Practo Healthcare</h3>
                    <p className="text-xs text-secondary-700 font-semibold">Instant Online Appointments</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="p-3.5 bg-white/90 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Specialties Available</span>
                    <span className="font-bold text-slate-900">25+ Disciplines</span>
                  </div>
                  <div className="p-3.5 bg-white/90 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Avg Consultation Fee</span>
                    <span className="font-bold text-slate-900">₹500 - ₹1000</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <UserCheck className="h-4 w-4 text-secondary-600" />
                    <span>Real-time Calendar Sync</span>
                  </div>
                  <Link href="/doctors" className="text-secondary-700 font-bold hover:underline inline-flex items-center gap-1">
                    Book Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="specialties" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full border border-secondary-200">
              Browse Care Categories
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-2">
              Find Doctors by Specialty
            </h2>
            <p className="text-sm text-slate-600">
              Select a specialty to browse top-rated doctors in your city.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MOCK_SPECIALTIES.map((spec) => (
              <Link
                key={spec.id}
                href={'/doctors?specialization=' + encodeURIComponent(spec.name)}
                className="glass-card p-5 rounded-2xl text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-slate-200/70 group"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {getSpecialtyIcon(spec.iconName)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-secondary-700 transition-colors">
                  {spec.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {spec.doctorCount} Doctors
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50/70">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-700 bg-secondary-100 px-3 py-1 rounded-full border border-secondary-200">
                Top Rated
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-3">
                Featured Medical Specialists
              </h2>
            </div>
            <Button variant="outline" asChild className="self-start sm:self-auto text-xs">
              <Link href="/doctors">
                View All Doctors <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={(d) => setSelectedDoctorForBooking(d)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How Practo Works</h2>
            <p className="text-slate-600 text-sm">
              Book your doctor appointment in 3 simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-slate-200/80 text-center">
              <div className="w-14 h-14 bg-secondary-100 text-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Search Doctor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by specialty, location, experience, or consultation fee.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-200/80 text-center">
              <div className="w-14 h-14 bg-secondary-100 text-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Choose Slot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick a date and real-time available time slot that suits your schedule.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-200/80 text-center">
              <div className="w-14 h-14 bg-secondary-100 text-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Instant Confirmation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive immediate booking reference details with zero double-bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />

      <footer className="bg-slate-950 py-10 border-t border-slate-800 text-center text-slate-400 text-xs">
        <div className="container mx-auto px-4 md:px-6">
          <p>© {new Date().getFullYear()} Practo. All rights reserved. Built for Sprint 1.</p>
        </div>
      </footer>
    </div>
  );
}
