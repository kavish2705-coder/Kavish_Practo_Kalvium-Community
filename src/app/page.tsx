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
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
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
                <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-secondary-500/20 bg-secondary-600 hover:bg-secondary-700 text-white border-0">
                  <Link href="/doctors">
                    <Search className="mr-2 h-5 w-5" />
                    Find a Doctor
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('specialties')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-secondary-200 hover:bg-secondary-50"
                >
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

      {/* HOW IT WORKS (Dark Gray Galaxy & Glassmorphism) */}
      <section id="how-it-works" className="relative py-24 bg-slate-900 border-b border-slate-800 overflow-hidden">
        {/* Starry pattern overlay */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '70px 70px', backgroundPosition: '20px 20px' }} />

        {/* Nebula / Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/10 rounded-full blur-[150px] pointer-events-none mix-blend-overlay" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8a8170] bg-white px-3.5 py-1 rounded-full shadow-sm inline-block">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-3 tracking-tight">
              How Practo Works
            </h2>
            <p className="text-white/80 text-base max-w-lg mx-auto">
              Book your doctor appointment in 3 simple steps. No hassle, just care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-y-1/2 hidden md:block" />

            {/* Step 1 */}
            <div className="relative p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 text-center shadow-2xl shadow-black/10 hover:-translate-y-2 hover:shadow-white/5 hover:border-white/40 transition-all duration-500 group overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[140px] font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none select-none leading-none">
                1
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500">
                  <Search className="h-7 w-7 drop-shadow-md" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5 drop-shadow-sm">Search Doctor</h3>
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  Filter by specialty, location, experience, or consultation fee.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 text-center shadow-2xl shadow-black/10 hover:-translate-y-2 hover:shadow-white/5 hover:border-white/40 transition-all duration-500 group overflow-hidden md:translate-y-4">
              <div className="absolute -top-6 -right-6 text-[140px] font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none select-none leading-none">
                2
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="h-7 w-7 drop-shadow-md" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5 drop-shadow-sm">Choose Slot</h3>
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  Pick a date and real-time available time slot that suits your schedule.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 text-center shadow-2xl shadow-black/10 hover:-translate-y-2 hover:shadow-white/5 hover:border-white/40 transition-all duration-500 group overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[140px] font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none select-none leading-none">
                3
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="h-7 w-7 drop-shadow-md" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5 drop-shadow-sm">Instant Confirmation</h3>
                <p className="text-sm text-white/80 leading-relaxed font-light">
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

      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800 text-slate-400">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="Practo Logo" width={40} height={40} className="w-10 h-10 object-contain" />
                <span className="text-2xl font-bold tracking-tight text-white">
                  PRACTO<span className="text-primary-500">.</span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your trusted partner in healthcare. Book appointments, consult doctors online, and manage your health seamlessly.
              </p>
              <div className="flex gap-4 pt-2">
                <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/doctors" className="hover:text-primary-400 transition-colors">Find a Doctor</Link></li>
                <li><Link href="/doctors" className="hover:text-primary-400 transition-colors">Book an Appointment</Link></li>
                <li><a href="https://www.healthline.com/health-news" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">Health Blog</a></li>
                <li><Link href="/" className="hover:text-primary-400 transition-colors">Practo Plus</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4 text-lg">Customer Care</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">24/7 Support</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Patient Guidelines</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Report an Issue</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">FAQs</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <span className="text-sm">123 Health Avenue, Medical District, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                  <span className="text-sm">+1 (800) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                  <span className="text-sm">support@practo.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© {new Date().getFullYear()} PRACTO. All rights reserved. Built for Sprint 1.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
