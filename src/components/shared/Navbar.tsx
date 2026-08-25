import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Stethoscope } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass bg-white/80 border-b border-slate-200/60 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-secondary-700 transition-colors">
            Practo
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-700">
          <Link href="/doctors" className="hover:text-secondary-700 transition-colors">
            Find Doctors
          </Link>
          <Link href="/#specialties" className="hover:text-secondary-700 transition-colors">
            Specialties
          </Link>
          <Link href="/#how-it-works" className="hover:text-secondary-700 transition-colors">
            How It Works
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-700 hover:text-slate-900 hover:bg-slate-100">
            Log in
          </Button>
          <Button size="sm" asChild className="bg-secondary-600 text-white hover:bg-secondary-700 shadow-sm font-semibold">
            <Link href="/doctors">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
