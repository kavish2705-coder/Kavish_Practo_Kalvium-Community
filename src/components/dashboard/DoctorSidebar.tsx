"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserCircle,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const doctorNavigation = [
  { name: "Dashboard", href: "/dashboard/doctor", icon: LayoutDashboard },
  { name: "My Schedule", href: "/dashboard/doctor/schedule", icon: CalendarDays },
  { name: "Profile", href: "/dashboard/doctor/profile", icon: UserCircle },
];

export function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Practo Logo" width={32} height={32} className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 tracking-tight">
            PRACTO<span className="text-slate-800 text-sm ml-1 font-medium hidden sm:inline-block">Doctor</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 gap-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
          Menu
        </div>
        {doctorNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-slate-100 p-4">
        <button
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-rose-500 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
