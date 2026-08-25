import { Search, RotateCcw } from "lucide-react";
import { DoctorFilterState } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface DoctorFiltersProps {
  filters: DoctorFilterState;
  onFilterChange: (newFilters: Partial<DoctorFilterState>) => void;
  onReset: () => void;
  specialtiesList: string[];
}

export default function DoctorFilters({
  filters,
  onFilterChange,
  onReset,
  specialtiesList,
}: DoctorFiltersProps) {
  const expOptions = [
    { value: "0", label: "Any Experience" },
    { value: "5", label: "5+ Years" },
    { value: "10", label: "10+ Years" },
    { value: "15", label: "15+ Years" },
  ];

  const sortOptions = [
    { value: "rating-desc", label: "Highest Rated" },
    { value: "experience-desc", label: "Most Experienced" },
    { value: "fee-asc", label: "Consultation Fee: Low to High" },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-700/80 bg-slate-900/95 mb-8 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:flex-1">
          <Input
            placeholder="Search by doctor name, qualification, or clinic..."
            icon={<Search className="h-4 w-4 text-slate-400" />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Select
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as DoctorFilterState["sortBy"],
              })
            }
            className="w-full md:w-56"
          />

          {(filters.search || filters.specialization || filters.minExperience > 0) && (
            <Button
              variant="outline"
              size="default"
              onClick={onReset}
              className="shrink-0 text-xs gap-1.5 border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          Specialty Filter
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange({ specialization: "" })}
            className={
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " +
              (!filters.specialization
                ? "bg-secondary-600 text-white shadow-md shadow-secondary-600/30"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700")
            }
          >
            All Specialties
          </button>
          {specialtiesList.map((spec) => {
            const isActive = filters.specialization === spec;
            return (
              <button
                key={spec}
                onClick={() => onFilterChange({ specialization: spec })}
                className={
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " +
                  (isActive
                    ? "bg-secondary-600 text-white shadow-md shadow-secondary-600/30"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700")
                }
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
        <Select
          label="Minimum Experience"
          options={expOptions}
          value={filters.minExperience.toString()}
          onChange={(e) =>
            onFilterChange({ minExperience: Number(e.target.value) })
          }
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-white">
            Max Fee: ₹{filters.maxFee}
          </label>
          <input
            type="range"
            min="400"
            max="2000"
            step="100"
            value={filters.maxFee}
            onChange={(e) => onFilterChange({ maxFee: Number(e.target.value) })}
            className="w-full accent-secondary-500 h-2 bg-slate-700 rounded-lg cursor-pointer mt-3"
          />
        </div>
      </div>
    </div>
  );
}
