import { ReactNode } from "react";
import { DoctorSidebar } from "@/components/dashboard/DoctorSidebar";

export default function DoctorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - hidden on mobile, fixed width on desktop */}
      <div className="hidden md:block w-64 shrink-0">
        <DoctorSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex h-16 items-center border-b border-slate-200 bg-white px-4 shrink-0">
          <span className="text-lg font-bold text-slate-900">
            PRACTO <span className="text-slate-500 font-medium text-sm">Doctor</span>
          </span>
          {/* Mobile menu button could go here */}
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
