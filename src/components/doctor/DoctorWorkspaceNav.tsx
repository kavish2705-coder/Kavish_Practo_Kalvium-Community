"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/dashboard/doctor", label: "Overview" },
  { href: "/dashboard/doctor/schedule", label: "Schedule" },
  { href: "/dashboard/doctor/profile", label: "Profile" },
];

export default function DoctorWorkspaceNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Button
            key={link.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={
              isActive ? "font-semibold" : "font-medium text-slate-600"
            }
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
