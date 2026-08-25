"use client";

import { useState, useMemo } from "react";
import DoctorCard from "@/components/doctors/DoctorCard";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import BookingModal from "@/components/booking/BookingModal";
import { MOCK_DOCTORS, MOCK_SPECIALTIES } from "@/lib/mockData";
import { DoctorCardData, DoctorFilterState } from "@/types";
import { Stethoscope, Frown } from "lucide-react";

export default function DoctorsPage() {
  const [filters, setFilters] = useState<DoctorFilterState>({
    search: "",
    specialization: "",
    minExperience: 0,
    maxFee: 2000,
    sortBy: "rating-desc",
  });

  const [selectedDoctorForBooking, setSelectedDoctorForBooking] =
    useState<DoctorCardData | null>(null);

  const specialtiesList = useMemo(
    () => MOCK_SPECIALTIES.map((s) => s.name),
    []
  );

  const handleFilterChange = (newFilters: Partial<DoctorFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      specialization: "",
      minExperience: 0,
      maxFee: 2000,
      sortBy: "rating-desc",
    });
  };

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(query);
        const matchClinic = doc.clinicInfo.toLowerCase().includes(query);
        const matchSpec = doc.specialization.toLowerCase().includes(query);
        const matchQual = doc.qualification.toLowerCase().includes(query);
        if (!matchName && !matchClinic && !matchSpec && !matchQual) return false;
      }

      if (
        filters.specialization &&
        doc.specialization.toLowerCase() !== filters.specialization.toLowerCase()
      ) {
        return false;
      }

      if (doc.experience < filters.minExperience) {
        return false;
      }

      if (doc.fee > filters.maxFee) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "rating-desc") return b.rating - a.rating;
      if (filters.sortBy === "experience-desc") return b.experience - a.experience;
      if (filters.sortBy === "fee-asc") return a.fee - b.fee;
      return 0;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <section className="bg-slate-900 py-10 border-b border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-950 text-secondary-200 text-xs font-bold border border-secondary-800 mb-3">
              <Stethoscope className="h-3.5 w-3.5 text-secondary-300" />
              Verified Healthcare Professionals
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Find & Book Expert Doctors
            </h1>
            <p className="text-slate-200 mt-2 text-sm sm:text-base font-medium">
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
          <p className="text-sm font-semibold text-slate-200">
            Showing <span className="font-bold text-white">{filteredDoctors.length}</span> verified doctors
          </p>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={(d) => setSelectedDoctorForBooking(d)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8 bg-slate-900 border border-slate-800 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Frown className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Doctors Found</h3>
            <p className="text-xs text-slate-300 mb-4 font-medium">
              We couldn’t find any doctors matching your selected filters.
            </p>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-secondary-300 hover:text-secondary-200 hover:underline"
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

      <footer className="bg-slate-950 py-8 border-t border-slate-800 text-center text-slate-400 text-xs">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Practo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
