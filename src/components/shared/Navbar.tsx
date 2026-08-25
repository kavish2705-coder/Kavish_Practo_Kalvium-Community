import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* A simple placeholder logo, or an icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">PractoClone</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-600">
          <Link href="/doctors" className="hover:text-primary-600 transition-colors">
            Find Doctors
          </Link>
          <Link href="/specialties" className="hover:text-primary-600 transition-colors">
            Specialties
          </Link>
          <Link href="/about" className="hover:text-primary-600 transition-colors">
            About Us
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button>Book Appointment</Button>
        </div>
      </div>
    </header>
  );
}
