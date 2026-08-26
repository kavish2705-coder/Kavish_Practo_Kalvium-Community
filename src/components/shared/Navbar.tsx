import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 drop-shadow-sm group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-extrabold text-xl hidden sm:inline-block text-slate-900 group-hover:text-secondary-700 transition-colors">
            PractoClone
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center text-sm font-semibold text-slate-800">
          <Link href="/doctors" className="hover:text-secondary-700 transition-colors drop-shadow-sm">
            Find Doctors
          </Link>
          <Link href="/#specialties" className="hover:text-secondary-700 transition-colors drop-shadow-sm">
            Specialties
          </Link>
          <Link href="/#how-it-works" className="hover:text-secondary-700 transition-colors drop-shadow-sm">
            How It Works
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {/* 
            ==========================================================================
            LOGIN PAGE IMPLEMENTATION PLAN (Triggered on 'Log in' click)
            ==========================================================================
            1. Navigation / Modal Trigger:
               - On click, trigger open state for <LoginModal /> or route to '/login?redirect=...'.
            2. User Login Form & Authentication Flow:
               - Collect user Phone Number / Email and Password or 6-digit OTP.
               - Submit credentials to backend endpoint `/api/auth/login`.
            3. Session Context & State Management:
               - Store authenticated session in AuthContext and secure HttpOnly cookie.
               - Swap this 'Log in' button with <UserNav /> displaying user initials & avatar dropdown.
            4. Post-Login Redirection:
               - Redirect back to active flow (e.g. Doctor Booking modal) or Patient Dashboard.
            ==========================================================================
          */}
          <Button variant="ghost" className="hidden sm:inline-flex font-bold text-slate-800 hover:bg-white/60 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm">
            Log in
          </Button>
          <Button asChild className="font-bold shadow-lg shadow-secondary-500/30 bg-secondary-600 hover:bg-secondary-700 text-white">
            <Link href="/doctors">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
