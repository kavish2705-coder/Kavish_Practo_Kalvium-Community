"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  CheckCircle2,
  XCircle,
  FileText,
  PlusCircle,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Appointment {
  id: string;
  referenceId: string;
  doctorName: string;
  specialty: string;
  clinicInfo: string;
  appointmentDate: string;
  timeSlot: string;
  fee: number;
  status: "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
}

const MOCK_UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    referenceId: "PRAC-89421",
    doctorName: "Dr. Ananya Sharma",
    specialty: "Cardiology",
    clinicInfo: "HeartCare Super Specialty Clinic, Indiranagar, Bengaluru",
    appointmentDate: "Tomorrow, 28 Aug 2026",
    timeSlot: "04:30 PM - 05:00 PM",
    fee: 800,
    status: "Confirmed",
    notes: "Routine cardiac checkup & ECG review.",
  },
  {
    id: "app-2",
    referenceId: "PRAC-73209",
    doctorName: "Dr. Rajesh Iyer",
    specialty: "General Physician",
    clinicInfo: "City Health Care Clinic, HSR Layout, Bengaluru",
    appointmentDate: "Sat, 30 Aug 2026",
    timeSlot: "02:00 PM - 02:30 PM",
    fee: 500,
    status: "Confirmed",
    notes: "General wellness consultation.",
  },
];

const MOCK_PAST_APPOINTMENTS: Appointment[] = [
  {
    id: "app-3",
    referenceId: "PRAC-54102",
    doctorName: "Dr. Vikramaditya Rao",
    specialty: "Dermatology",
    clinicInfo: "Aesthetic Skin & Hair Clinic, Koramangala, Bengaluru",
    appointmentDate: "12 Aug 2026",
    timeSlot: "11:00 AM - 11:30 AM",
    fee: 650,
    status: "Completed",
    notes: "Prescribed topical ointment and recommended skin hydration care.",
  },
  {
    id: "app-4",
    referenceId: "PRAC-41298",
    doctorName: "Dr. Priya Nair",
    specialty: "Pediatrics",
    clinicInfo: "Little Angels Child Clinic, Whitefield, Bengaluru",
    appointmentDate: "28 Jul 2026",
    timeSlot: "05:00 PM - 05:30 PM",
    fee: 600,
    status: "Completed",
    notes: "Annual growth checkup and health evaluation.",
  },
  {
    id: "app-5",
    referenceId: "PRAC-30911",
    doctorName: "Dr. Siddharth Verma",
    specialty: "Orthopedics",
    clinicInfo: "Spine & Joint Institute, Jayanagar, Bengaluru",
    appointmentDate: "05 Jun 2026",
    timeSlot: "03:30 PM - 04:00 PM",
    fee: 900,
    status: "Cancelled",
    notes: "Cancelled by patient prior to appointment slot.",
  },
];

export default function PatientDashboardPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 pt-20 pb-16 text-slate-900">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 max-w-6xl">
        {/* Welcome Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/70 bg-white/70 backdrop-blur-md mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-secondary-600/20">
                <User className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Patient Dashboard
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-bold border border-secondary-200">
                    My Account
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                  Manage your doctor consultations, upcoming visits, and medical history.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                asChild
                className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold shadow-md shadow-secondary-600/20"
              >
                <Link href="/doctors">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Book New Appointment
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200/80">
            <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Total Consultations</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">5</span>
            </div>
            <div className="bg-secondary-50/80 p-3.5 rounded-2xl border border-secondary-200/80 shadow-xs">
              <span className="text-xs font-semibold text-secondary-800 block">Upcoming</span>
              <span className="text-2xl font-extrabold text-secondary-700 mt-0.5 block">
                {MOCK_UPCOMING_APPOINTMENTS.length}
              </span>
            </div>
            <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Completed</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">2</span>
            </div>
            <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Cancelled</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">1</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2.5 px-4 text-sm font-bold transition-all relative ${
              activeTab === "upcoming"
                ? "text-secondary-700 border-b-2 border-secondary-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Upcoming Appointments
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === "upcoming"
                  ? "bg-secondary-100 text-secondary-800 font-extrabold"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {MOCK_UPCOMING_APPOINTMENTS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`pb-2.5 px-4 text-sm font-bold transition-all relative ${
              activeTab === "past"
                ? "text-secondary-700 border-b-2 border-secondary-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Past Appointments
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === "past"
                  ? "bg-secondary-100 text-secondary-800 font-extrabold"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {MOCK_PAST_APPOINTMENTS.length}
            </span>
          </button>
        </div>

        {/* Section 1: Upcoming Appointments */}
        {activeTab === "upcoming" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
              <span className="text-xs text-slate-500 font-medium">
                Showing {MOCK_UPCOMING_APPOINTMENTS.length} scheduled visits
              </span>
            </div>

            {MOCK_UPCOMING_APPOINTMENTS.map((apt) => {
              const initials = apt.doctorName
                .replace("Dr. ", "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2);

              return (
                <div
                  key={apt.id}
                  className="glass-card rounded-2xl p-6 border border-white/60 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-secondary-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                        {initials}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{apt.doctorName}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-semibold border border-secondary-200">
                            {apt.specialty}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-secondary-700 shrink-0" />
                          <span>{apt.clinicInfo}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-2">
                          <div className="flex items-center gap-1 bg-slate-100/90 px-3 py-1 rounded-lg border border-slate-200/80">
                            <Calendar className="h-3.5 w-3.5 text-secondary-700" />
                            <span>{apt.appointmentDate}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-100/90 px-3 py-1 rounded-lg border border-slate-200/80">
                            <Clock className="h-3.5 w-3.5 text-secondary-700" />
                            <span>{apt.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-100/90 px-3 py-1 rounded-lg border border-slate-200/80">
                            <IndianRupee className="h-3.5 w-3.5 text-secondary-700" />
                            <span>Fee: ₹{apt.fee}</span>
                          </div>
                        </div>

                        {apt.notes && (
                          <p className="text-xs text-slate-500 italic pt-1">
                            Ref ID: <span className="font-mono text-slate-700 font-semibold">{apt.referenceId}</span> • Note: {apt.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/80 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold hover:bg-slate-100"
                        onClick={() => alert(`Reschedule request initiated for ${apt.referenceId}`)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold text-rose-600 hover:bg-rose-50 border-rose-200"
                        onClick={() => alert(`Cancellation requested for ${apt.referenceId}`)}
                      >
                        Cancel Visit
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Section 2: Past Appointments */}
        {activeTab === "past" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Past Consultations</h2>
              <span className="text-xs text-slate-500 font-medium">
                Showing {MOCK_PAST_APPOINTMENTS.length} historical records
              </span>
            </div>

            {MOCK_PAST_APPOINTMENTS.map((apt) => {
              const initials = apt.doctorName
                .replace("Dr. ", "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2);

              const isCompleted = apt.status === "Completed";

              return (
                <div
                  key={apt.id}
                  className="glass-card rounded-2xl p-6 border border-white/60 bg-white/70 backdrop-blur-md shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-slate-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
                        {initials}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{apt.doctorName}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                            {apt.specialty}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${
                              isCompleted
                                ? "bg-slate-100 text-slate-800 border-slate-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-3 w-3 text-slate-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-rose-600" />
                            )}
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{apt.clinicInfo}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-2">
                          <div className="flex items-center gap-1 bg-slate-100/90 px-3 py-1 rounded-lg border border-slate-200/80">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>{apt.appointmentDate}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-100/90 px-3 py-1 rounded-lg border border-slate-200/80">
                            <Clock className="h-3.5 w-3.5 text-slate-500" />
                            <span>{apt.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-100/90 px-3 py-1 rounded-lg border border-slate-200/80">
                            <IndianRupee className="h-3.5 w-3.5 text-slate-500" />
                            <span>Paid: ₹{apt.fee}</span>
                          </div>
                        </div>

                        {apt.notes && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex items-start gap-2">
                            <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-900 block">Consultation Summary:</span>
                              <span className="text-slate-600">{apt.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/80 shrink-0">
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="text-xs font-bold bg-secondary-100 text-secondary-800 hover:bg-secondary-200"
                      >
                        <Link href="/doctors">
                          Book Again
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      <footer className="bg-slate-900 py-8 border-t border-slate-800 text-center text-slate-400 text-xs mt-12">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Practo Clone. Patient Dashboard.</p>
        </div>
      </footer>
    </div>
  );
}
