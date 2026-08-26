"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        return <HeartPulse className="h-6 w-6 text-secondary-700" />;
      case "Sparkles":
        return <Sparkles className="h-6 w-6 text-secondary-700" />;
      case "Baby":
        return <Baby className="h-6 w-6 text-secondary-700" />;
      case "Stethoscope":
        return <Stethoscope className="h-6 w-6 text-secondary-700" />;
      case "Activity":
        return <Activity className="h-6 w-6 text-secondary-700" />;
      case "Brain":
        return <Brain className="h-6 w-6 text-secondary-700" />;
      default:
        return <Stethoscope className="h-6 w-6 text-secondary-700" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION (Our Cinematic Version) */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* The Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Doctor" 
            fill 
            className="object-cover object-left" 
            priority 
          />
        </div>

        {/* The smooth blur gradient overlay on the right side */}
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/50 to-white/95 backdrop-blur-md animate-slow-fade-in-blur"
          style={{
            maskImage: "linear-gradient(to right, transparent 20%, black 60%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 20%, black 60%)"
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="flex justify-end">
            <div className="max-w-2xl text-right animate-slow-slide-in-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-sm font-medium text-secondary-700 mb-6 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-secondary-500 animate-pulse"></span>
                Top-rated Doctors Available Now
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Expert Healthcare,<br/>
                <span className="text-secondary-600">
                  Just a Click Away.
                </span>
              </h1>
              <p className="text-lg text-slate-700 mb-8 max-w-xl ml-auto leading-relaxed">
                Find the best doctors, view their real-time availability, and book your appointment instantly. No waiting, no double-bookings, just seamless care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-secondary-500/20 bg-secondary-600 hover:bg-secondary-700 text-white border-0">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Doctor
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-secondary-200 hover:bg-secondary-50">
                  View Specialties
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-end gap-6 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                  <span>Verified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                  <span>Instant Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALTIES (From Joel) */}
      <section id="specialties" className="py-16 bg-white border-b border-slate-200/60">
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
                className="glass-card p-5 rounded-2xl text-center bg-white/70 backdrop-blur-md border border-slate-200/70 hover:border-secondary-200 hover:bg-secondary-50/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {getSpecialtyIcon(spec.iconName)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-secondary-700 transition-colors">
                  {spec.name}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">
                  {spec.doctorCount} Doctors
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOP RATED DOCTORS (From Joel) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/60">
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
            <Button variant="outline" asChild className="self-start sm:self-auto text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
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

      {/* HOW IT WORKS (Premium Dark Glassmorphism) */}
      <section id="how-it-works" className="relative py-24 bg-slate-900 overflow-hidden">
        {/* Animated Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-400 bg-secondary-900/50 px-3 py-1 rounded-full border border-secondary-700/50 mb-4 inline-block">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Practo Works</h2>
            <p className="text-slate-400 text-base">
              Book your doctor appointment in 3 simple steps. No hassle, just care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary-500/30 to-transparent -translate-y-1/2 hidden md:block" />
            
            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-center shadow-2xl hover:-translate-y-2 hover:shadow-secondary-500/20 hover:border-secondary-500/50 transition-all duration-500 group overflow-hidden">
              <div className="absolute -top-8 -right-8 text-[150px] font-black text-white/5 group-hover:text-secondary-500/10 transition-colors pointer-events-none select-none leading-none">
                1
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Search Doctor</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Filter by specialty, location, experience, or consultation fee.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-center shadow-2xl hover:-translate-y-2 hover:shadow-secondary-500/20 hover:border-secondary-500/50 transition-all duration-500 group overflow-hidden md:translate-y-4">
              <div className="absolute -top-8 -right-8 text-[150px] font-black text-white/5 group-hover:text-secondary-500/10 transition-colors pointer-events-none select-none leading-none">
                2
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Choose Slot</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Pick a date and real-time available time slot that suits your schedule.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-center shadow-2xl hover:-translate-y-2 hover:shadow-secondary-500/20 hover:border-secondary-500/50 transition-all duration-500 group overflow-hidden">
              <div className="absolute -top-8 -right-8 text-[150px] font-black text-white/5 group-hover:text-secondary-500/10 transition-colors pointer-events-none select-none leading-none">
                3
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Instant Confirmation</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Receive immediate booking reference details with zero double-bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />

      <footer className="bg-slate-900 py-10 border-t border-slate-800 text-center text-slate-200 text-xs">
        <div className="container mx-auto px-4 md:px-6">
          <p>© {new Date().getFullYear()} Practo. All rights reserved. Built for Sprint 1.</p>
        </div>
      </footer>
    </div>
  );
}
