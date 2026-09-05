import { UserCircle } from "lucide-react";

export default function DoctorProfilePage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium">
            Manage your personal details and specialization.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
        <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <UserCircle className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Profile Management</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          This page is a placeholder for updating doctor details like consultation fee, biography, and credentials.
        </p>
      </div>
    </div>
  );
}
