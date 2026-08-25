import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 drop-shadow-sm">
          {/* A simple placeholder logo, or an icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            P
          </div>
          <span className="font-extrabold text-xl hidden sm:inline-block text-slate-900">PractoClone</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center text-sm font-semibold text-slate-800">
          <Link href="/doctors" className="hover:text-secondary-700 transition-colors drop-shadow-sm">
            Find Doctors
          </Link>
          <Link href="/specialties" className="hover:text-secondary-700 transition-colors drop-shadow-sm">
            Specialties
          </Link>
          <Link href="/about" className="hover:text-secondary-700 transition-colors drop-shadow-sm">
            About Us
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex font-bold text-slate-800 hover:bg-white/60 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm">
            Log in
          </Button>
          <Button className="font-bold shadow-lg shadow-secondary-500/30">Book Appointment</Button>
        </div>
      </div>
    </header>
  );
}
