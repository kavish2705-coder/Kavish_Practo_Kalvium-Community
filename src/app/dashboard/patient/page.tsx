"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Loader2,
  RefreshCw,
  LogIn,
  Star,
  Edit3,
  Save,
  AlertCircle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ReviewModal from "@/components/reviews/ReviewModal";
import type { SafeUser } from "@/types";

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

interface PatientReview {
  id: string;
  appointmentId: string;
  rating: number;
  comment?: string | null;
}

export default function PatientDashboardPage() {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "profile">("upcoming");

  // Upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);

  // Past appointments
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [pastPage, setPastPage] = useState(1);
  const [hasMorePast, setHasMorePast] = useState(true);
  const [isLoadingPast, setIsLoadingPast] = useState(true);
  const [isLoadingMorePast, setIsLoadingMorePast] = useState(false);

  // User reviews
  const [userReviews, setUserReviews] = useState<Record<string, PatientReview>>({});

  // Review Modal state
  const [selectedAptForReview, setSelectedAptForReview] = useState<Appointment | null>(null);

  // Profile Edit Form State
  const [editName, setEditName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch reviews for authenticated patient
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const map: Record<string, PatientReview> = {};
          json.data.forEach((rev: PatientReview) => {
            map[rev.appointmentId] = rev;
          });
          setUserReviews(map);
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchUpcoming() {
      try {
        const res = await fetch("/api/appointments?type=upcoming");
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.data?.appointments) {
            setUpcomingAppointments(json.data.appointments);
          }
        }
      } catch (err) {
        console.error("Failed to fetch upcoming appointments:", err);
      } finally {
        if (!ignore) setIsLoadingUpcoming(false);
      }
    }

    async function fetchPast() {
      try {
        const res = await fetch("/api/appointments?type=past&page=1&limit=2");
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.data?.appointments) {
            setPastAppointments(json.data.appointments);
            setHasMorePast(json.data.hasMore ?? false);
            setPastPage(1);
          }
        }
      } catch (err) {
        console.error("Failed to fetch past appointments:", err);
      } finally {
        if (!ignore) setIsLoadingPast(false);
      }
    }

    async function checkAuthAndLoadData() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.success && json.data) {
            const currentUser: SafeUser = json.data;
            setUser(currentUser);
            setEditName(currentUser.name);
            setIsLoadingUser(false);
            fetchUpcoming();
            fetchPast();
            fetchReviews();
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check authentication:", err);
      }
      if (!ignore) {
        setUser(null);
        setIsLoadingUser(false);
        setIsLoadingUpcoming(false);
        setIsLoadingPast(false);
      }
    }

    checkAuthAndLoadData();

    return () => {
      ignore = true;
    };
  }, [fetchReviews]);

  // Refresh upcoming
  const handleRefreshUpcoming = async () => {
    setIsLoadingUpcoming(true);
    try {
      const res = await fetch("/api/appointments?type=upcoming");
      if (res.ok) {
        const json = await res.json();
        if (json.data?.appointments) {
          setUpcomingAppointments(json.data.appointments);
        }
      }
    } catch (err) {
      console.error("Failed to refresh upcoming appointments:", err);
    } finally {
      setIsLoadingUpcoming(false);
    }
  };

  // Infinite scroll load more past appointments
  const loadMorePast = useCallback(async () => {
    if (isLoadingMorePast || !hasMorePast || isLoadingPast) return;
    setIsLoadingMorePast(true);
    const nextPage = pastPage + 1;
    try {
      const res = await fetch(`/api/appointments?type=past&page=${nextPage}&limit=2`);
      if (res.ok) {
        const json = await res.json();
        if (json.data?.appointments) {
          setPastAppointments((prev) => [...prev, ...json.data.appointments]);
          setHasMorePast(json.data.hasMore ?? false);
          setPastPage(nextPage);
        }
      }
    } catch (err) {
      console.error("Failed to load more past appointments:", err);
    } finally {
      setIsLoadingMorePast(false);
    }
  }, [isLoadingMorePast, hasMorePast, isLoadingPast, pastPage]);

  useEffect(() => {
    if (activeTab !== "past" || !hasMorePast || isLoadingPast || isLoadingMorePast) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePast();
        }
      },
      { threshold: 0.1 },
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [activeTab, hasMorePast, isLoadingPast, isLoadingMorePast, loadMorePast]);

  // Handle profile update submit
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setProfileError("Full name cannot be empty.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const res = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "Failed to update profile");
      }

      if (json.success && json.data) {
        setUser(json.data);
        setEditName(json.data.name);
        setProfileSuccess("Profile updated successfully!");
      }
    } catch (err: unknown) {
      console.error("Profile update error:", err);
      setProfileError(err instanceof Error ? err.message : "Error saving profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle review success callback
  const handleReviewSuccess = (appointmentId: string, rating: number, comment?: string) => {
    setUserReviews((prev) => ({
      ...prev,
      [appointmentId]: {
        id: `rev-${Date.now()}`,
        appointmentId,
        rating,
        comment,
      },
    }));
  };

  const completedCount = pastAppointments.filter((a) => a.status === "Completed").length;
  const cancelledCount = pastAppointments.filter((a) => a.status === "Cancelled").length;
  const totalConsultations = upcomingAppointments.length + pastAppointments.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 pt-20 pb-16 text-slate-900">
      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 max-w-6xl">
        {/* Welcome Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/70 bg-white/70 backdrop-blur-md mb-8 shadow-sm">
          {isLoadingUser ? (
            <div className="flex items-center justify-center py-8 gap-3 text-slate-600">
              <Loader2 className="h-6 w-6 animate-spin text-secondary-600" />
              <span className="text-sm font-medium">Checking authentication...</span>
            </div>
          ) : !user ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary-100 text-secondary-700 flex items-center justify-center mx-auto mb-3">
                <User className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Patient Authentication Required</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Please log in to your patient account to access your medical appointments and history.
              </p>
              <Button
                asChild
                className="mt-4 bg-secondary-600 hover:bg-secondary-700 text-white font-bold shadow-md shadow-secondary-600/20"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In to Patient Account
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-secondary-600/20">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {user.name}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-bold border border-secondary-200">
                        Patient
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                      {user.email} • Manage your doctor consultations, profile details, and medical history.
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
                  <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{totalConsultations}</span>
                </div>
                <div className="bg-secondary-50/80 p-3.5 rounded-2xl border border-secondary-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-secondary-800 block">Upcoming</span>
                  <span className="text-2xl font-extrabold text-secondary-700 mt-0.5 block">
                    {upcomingAppointments.length}
                  </span>
                </div>
                <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Completed</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{completedCount}</span>
                </div>
                <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/60 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Cancelled</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{cancelledCount}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation Tabs */}
        {user && (
          <>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("upcoming")}
                className={`pb-2.5 px-4 text-sm font-bold transition-all relative shrink-0 ${
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
                  {upcomingAppointments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("past")}
                className={`pb-2.5 px-4 text-sm font-bold transition-all relative shrink-0 ${
                  activeTab === "past"
                    ? "text-secondary-700 border-b-2 border-secondary-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Past Consultations & Reviews
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === "past"
                      ? "bg-secondary-100 text-secondary-800 font-extrabold"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {pastAppointments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`pb-2.5 px-4 text-sm font-bold transition-all relative shrink-0 ${
                  activeTab === "profile"
                    ? "text-secondary-700 border-b-2 border-secondary-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Profile & Medical History
              </button>
            </div>

            {/* Section 1: Upcoming Appointments */}
            {activeTab === "upcoming" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      Showing {upcomingAppointments.length} scheduled visits
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshUpcoming}
                      title="Refresh Appointments"
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isLoadingUpcoming ? (
                  <div className="glass-card rounded-2xl p-12 text-center border border-white/60 bg-white/70 backdrop-blur-md">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-secondary-600" />
                    <p className="text-sm text-slate-600 mt-2 font-medium">Loading upcoming appointments...</p>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center border border-white/60 bg-white/70 backdrop-blur-md">
                    <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">No Upcoming Appointments</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      You don&apos;t have any scheduled consultations at the moment. Book a new appointment with top specialists.
                    </p>
                    <Button asChild className="mt-4 bg-secondary-600 text-white hover:bg-secondary-700">
                      <Link href="/doctors">Book Appointment</Link>
                    </Button>
                  </div>
                ) : (
                  upcomingAppointments.map((apt) => {
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
                  })
                )}
              </section>
            )}

            {/* Section 2: Past Consultations & Reviews */}
            {activeTab === "past" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Past Consultations</h2>
                  <span className="text-xs text-slate-500 font-medium">
                    Loaded {pastAppointments.length} historical records
                  </span>
                </div>

                {isLoadingPast ? (
                  <div className="glass-card rounded-2xl p-12 text-center border border-white/60 bg-white/70 backdrop-blur-md">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-secondary-600" />
                    <p className="text-sm text-slate-600 mt-2 font-medium">Loading consultation history...</p>
                  </div>
                ) : pastAppointments.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center border border-white/60 bg-white/70 backdrop-blur-md">
                    <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">No Past Consultations</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      There are no past consultation records found in the database.
                    </p>
                  </div>
                ) : (
                  <>
                    {pastAppointments.map((apt) => {
                      const initials = apt.doctorName
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2);

                      const isCompleted = apt.status === "Completed";
                      const review = userReviews[apt.id];

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

                                {/* Submitted Review View */}
                                {review && (
                                  <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold block">
                                        Your Review ({review.rating} / 5 Stars):
                                      </span>
                                      {review.comment ? (
                                        <span className="text-slate-700 italic">&ldquo;{review.comment}&rdquo;</span>
                                      ) : (
                                        <span className="text-slate-500 italic">No written comment provided.</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/80 shrink-0">
                              {isCompleted && !review && (
                                <Button
                                  onClick={() => setSelectedAptForReview(apt)}
                                  className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                                >
                                  <Star className="h-3.5 w-3.5 mr-1.5 fill-white" />
                                  Write a Review
                                </Button>
                              )}

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

                    <div ref={sentinelRef} className="py-4 text-center">
                      {isLoadingMorePast && (
                        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
                          <Loader2 className="h-4 w-4 animate-spin text-secondary-600" />
                          <span>Loading earlier consultations...</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Section 3: Profile & Medical Records */}
            {activeTab === "profile" && (
              <section className="space-y-6">
                {/* Profile Edit Form */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/60 bg-white/70 backdrop-blur-md shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Edit3 className="h-5 w-5 text-secondary-600" />
                        Patient Profile Details
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        View and update your registered personal profile information in the database.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Session Verified
                    </span>
                  </div>

                  {profileSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{profileSuccess}</span>
                    </div>
                  )}

                  {profileError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                    <Input
                      label="Full Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your full name"
                    />

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Account Role
                      </label>
                      <input
                        type="text"
                        value={user.role}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm font-medium cursor-not-allowed"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSavingProfile}
                        className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-xs shadow-md"
                      >
                        {isSavingProfile ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving Profile...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Profile Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Medical History & Prescriptions Notice & Data */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/60 bg-white/70 backdrop-blur-md shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-secondary-600" />
                    Medical History & Prescriptions
                  </h2>

                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-amber-950 mb-0.5">
                        Database Schema Architecture Limitation Notice:
                      </span>
                      Dedicated digital prescription file uploads and lab test document attachments are not configured in the current database schema. Your completed consultation notes and appointment records below serve as your available medical history.
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Available Consultation Records ({pastAppointments.length})
                    </h3>

                    {pastAppointments.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        No past consultation records found in database.
                      </p>
                    ) : (
                      pastAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{apt.doctorName} ({apt.specialty})</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {apt.appointmentDate}
                            </span>
                          </div>
                          <p className="text-slate-600">
                            Clinic: <span className="font-medium text-slate-800">{apt.clinicInfo}</span> • Status:{" "}
                            <span className="font-bold text-slate-900">{apt.status}</span>
                          </p>
                          {apt.notes ? (
                            <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-1">
                              <span className="font-bold text-slate-900">Notes: </span>
                              {apt.notes}
                            </p>
                          ) : (
                            <p className="text-slate-600 italic">No notes attached to this consultation.</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Review Modal */}
      <ReviewModal
        appointment={selectedAptForReview}
        isOpen={!!selectedAptForReview}
        onClose={() => setSelectedAptForReview(null)}
        onSuccess={handleReviewSuccess}
      />

      <footer className="bg-slate-900 py-8 border-t border-slate-800 text-center text-slate-400 text-xs mt-12">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} PRACTO. Patient Dashboard.</p>
        </div>
      </footer>
    </div>
  );
}
