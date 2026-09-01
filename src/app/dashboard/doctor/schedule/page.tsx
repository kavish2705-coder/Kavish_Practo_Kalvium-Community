import { CalendarDays } from "lucide-react";

export default function DoctorSchedulePage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Schedule
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium">
            Manage your working hours and appointment slots.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
        <div className="bg-primary-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-100">
          <CalendarDays className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Schedule Management</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          This page is ready for Harjodh to wire up the scheduling APIs and UI to set working hours!
        </p>
      </div>
    </div>
  );
}
