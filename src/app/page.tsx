import { Button } from "@/components/ui/Button";
import { Search, Calendar, Activity, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* The Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Doctor" 
            fill 
            className="object-cover object-left" 
            priority 
          />
        </div>

        {/* The smooth blur gradient overlay on the right side */}
        {/* We use mask-image to fade the backdrop-blur so the left side is perfectly clear and the right side is blurred/frosted */}
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/50 to-white/95 backdrop-blur-md animate-slow-fade-in-blur"
          style={{
            maskImage: "linear-gradient(to right, transparent 20%, black 60%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 20%, black 60%)"
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="flex justify-end">
            <div className="max-w-2xl text-right animate-slow-slide-in-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-sm font-medium text-teal-700 mb-6 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                Top-rated Doctors Available Now
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Expert Healthcare,<br/>
                <span className="text-teal-600">
                  Just a Click Away.
                </span>
              </h1>
              <p className="text-lg text-slate-700 mb-8 max-w-xl ml-auto leading-relaxed">
                Find the best doctors, view their real-time availability, and book your appointment instantly. No waiting, no double-bookings, just seamless care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-teal-500/20 bg-teal-600 hover:bg-teal-700 text-white border-0">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Doctor
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-teal-200 hover:bg-teal-50">
                  View Specialties
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-end gap-6 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <span>Verified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <span>Instant Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">
              Booking an appointment has never been this easy. Get consulted by top professionals in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-y-1/2 hidden md:block" />
            
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600 shadow-inner">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Find a Doctor</h3>
              <p className="text-slate-600">Search for specialized doctors near you based on symptoms or specialty.</p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-inner">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Choose a Slot</h3>
              <p className="text-slate-600">View real-time availability and select a time that fits your schedule perfectly.</p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600 shadow-inner">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Get Consulted</h3>
              <p className="text-slate-600">Visit the clinic or consult online and get back to your best health.</p>
            </div>

          </div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} PractoClone. All rights reserved. Built for Sprint 1.
          </p>
        </div>
      </footer>
    </div>
  );
}
