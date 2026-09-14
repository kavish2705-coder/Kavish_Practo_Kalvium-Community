"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

import type { SafeUser } from "@/types";

export default function Navbar({ user }: { user?: SafeUser | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 drop-shadow-sm group">
          <Image src="/logo.png" alt="Practo Logo" width={40} height={40} className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          <span className="font-extrabold text-xl hidden sm:inline-block text-slate-900 group-hover:text-secondary-700 transition-colors">
            PRACTO
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center text-sm font-semibold text-slate-800">
          <Link href="/doctors" className="hover:text-secondary-700 transition-colors drop-shadow-sm">
            Find Doctors
          </Link>
          <Link 
            href="/#specialties" 
            onClick={(e) => handleScroll(e, 'specialties')}
            className="hover:text-secondary-700 transition-colors drop-shadow-sm"
          >
            Specialties
          </Link>
          <Link 
            href="/#how-it-works" 
            onClick={(e) => handleScroll(e, 'how-it-works')}
            className="hover:text-secondary-700 transition-colors drop-shadow-sm"
          >
            How It Works
          </Link>

          {/* Dedicated Provider/Admin Access Links */}
          <div className="w-px h-4 bg-slate-300 mx-2 hidden lg:block"></div>
          
          <Link 
            href="/login" 
            className="hover:text-secondary-700 transition-colors drop-shadow-sm font-bold text-secondary-600"
          >
            For Providers
          </Link>
          <Link 
            href="/admin" 
            className="hover:text-secondary-700 transition-colors drop-shadow-sm font-bold text-slate-500"
          >
            Admin Portal
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex font-bold text-slate-800 hover:bg-white/60 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm">
                <Link href={user.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient"}>Dashboard</Link>
              </Button>
              <Button onClick={handleLogout} className="font-bold shadow-lg shadow-secondary-500/30 bg-slate-800 hover:bg-slate-900 text-white">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex font-bold text-slate-800 hover:bg-white/60 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="font-bold shadow-lg shadow-secondary-500/30 bg-secondary-600 hover:bg-secondary-700 text-white">
                <Link href="/doctors">Book Appointment</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
