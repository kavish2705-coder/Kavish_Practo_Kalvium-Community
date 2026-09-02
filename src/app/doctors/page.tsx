"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DoctorCard from "@/components/doctors/DoctorCard";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import BookingModal from "@/components/booking/BookingModal";
import { DoctorCardData, DoctorFilterState } from "@/types";
import { Stethoscope, Frown, Loader2, AlertCircle } from "lucide-react";
import { MOCK_SPECIALTIES } from "@/lib/mockData";

function DoctorsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract initial filter values from URL params
  const [filters, setFilters] = useState<DoctorFilterState>({
    search: searchParams.get("search") || "",
    specialization: searchParams.get("specialization") || "",
    minExperience: Number.parseInt(searchParams.get("minExperience") || "0", 10),
    maxFee: Number.parseInt(searchParams.get("maxFee") || "2000", 10),
    sortBy: (searchParams.get("sortBy") as DoctorFilterState["sortBy"]) || "rating-desc",
  });

  const [doctors, setDoctors] = useState<DoctorCardData[]>([]);
  const [specialtiesList, setSpecialtiesList] = useState<string[]>(
    MOCK_SPECIALTIES.map((s) => s.name),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDoctorForBooking, setSelectedDoctorForBooking] =
    useState<DoctorCardData | null>(null);

  // Sync state to URL query parameters
  const updateUrlParams = useCallback(
    (newFilters: DoctorFilterState) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.specialization) params.set("specialization", newFilters.specialization);
      if (newFilters.minExperience > 0)
        params.set("minExperience", newFilters.minExperience.toString());
      if (newFilters.maxFee < 2000) params.set("maxFee", newFilters.maxFee.toString());
      if (newFilters.sortBy !== "rating-desc") params.set("sortBy", newFilters.sortBy);

      const queryString = params.toString();
      const newPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newPath, { scroll: false });
    },
    [pathname, router],
  );

  // Fetch specialties from API
  useEffect(() => {
    let ignore = false;
    async function loadSpecialties() {
      try {
        const res = await fetch("/api/doctors/specialties");
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.success && Array.isArray(json.data) && json.data.length > 0) {
            setSpecialtiesList(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load specialties:", err);
      }
    }
    loadSpecialties();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch doctors whenever filters change
  useEffect(() => {
    let ignore = false;
    async function loadDoctors() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.specialization) params.set("specialization", filters.specialization);
        if (filters.minExperience > 0)
          params.set("minExperience", filters.minExperience.toString());
        if (filters.maxFee > 0) params.set("maxFee", filters.maxFee.toString());
        if (filters.sortBy) params.set("sortBy", filters.sortBy);

        const res = await fetch(`/api/doctors?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to load doctors (HTTP ${res.status})`);
        }
        const json = await res.json();
        if (!ignore) {
          if (json.success && Array.isArray(json.data)) {
            setDoctors(json.data);
          } else {
            throw new Error(json.error || "Failed to load doctors");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          console.error("Error fetching doctors:", err);
          setError(err instanceof Error ? err.message : "Error connecting to doctor service");
          setDoctors([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadDoctors();

    return () => {
      ignore = true;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<DoctorFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      updateUrlParams(updated);
      return updated;
    });
  };

  const handleReset = () => {
    const resetFilters: DoctorFilterState = {
      search: "",
      specialization: "",
      minExperience: 0,
      maxFee: 2000,
      sortBy: "rating-desc",
    };
    setFilters(resetFilters);
    updateUrlParams(resetFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-r from-secondary-50 via-white to-secondary-50/40 py-10 border-b border-slate-200/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-xs font-semibold border border-secondary-200 mb-3">
              <Stethoscope className="h-3.5 w-3.5 text-secondary-600" />
              Verified Healthcare Professionals
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Find & Book Expert Doctors
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Browse top-rated specialists, check real-time slot availability, and confirm your appointment instantly.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <DoctorFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          specialtiesList={specialtiesList}
        />

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-700">
            Showing <span className="font-semibold text-slate-900">{doctors.length}</span> verified doctors
          </p>
        </div>

        {isLoading ? (
          <div className="glass-card rounded-2xl p-16 text-center max-w-md mx-auto my-8 bg-white/70 backdrop-blur-md border border-slate-200/70 shadow-md flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-secondary-600 mb-3" />
            <h3 className="text-base font-bold text-slate-900">Searching Doctors...</h3>
            <p className="text-xs text-slate-500 mt-1">Fetching real-time availability from database.</p>
          </div>
        ) : error ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8 bg-rose-50/70 backdrop-blur-md border border-rose-200 shadow-md">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-rose-900 mb-1">Unable to Load Doctors</h3>
            <p className="text-xs text-rose-700 mb-4">{error}</p>
            <button
              onClick={() => setFilters({ ...filters })}
              className="text-xs font-semibold text-secondary-700 hover:underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={(d) => setSelectedDoctorForBooking(d)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8 bg-white/70 backdrop-blur-md border border-slate-200/70 shadow-md">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <Frown className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Doctors Found</h3>
            <p className="text-xs text-slate-500 mb-4">
              We couldn’t find any doctors matching your selected filters.
            </p>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-secondary-700 hover:underline cursor-pointer"
            >
              Clear all filters and search again
            </button>
          </div>
        )}
      </main>

      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />

      <footer className="bg-slate-900 py-8 border-t border-slate-800 text-center text-slate-200 text-xs">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Practo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-secondary-600" />
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}
