import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, Calendar, Activity, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-50 pt-16 md:pt-24 lg:pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50/30 -z-10" />
        
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary-200/50 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-secondary-200/50 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply" />

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-sm font-medium text-primary-600 mb-6 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                Top-rated Doctors Available Now
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Expert Healthcare,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Just a Click Away.
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                Find the best doctors, view their real-time availability, and book your appointment instantly. No waiting, no double-bookings, just seamless care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary-500/20">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Doctor
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm">
                  View Specialties
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary-500" />
                  <span>Verified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary-500" />
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary-500" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 bg-slate-200">
                {/* We will replace this image URL with the generated one */}
                <img 
                  src="/hero-image.png" 
                  alt="Modern Clinic" 
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl ring-1 ring-slate-900/5 flex items-center gap-4 animate-bounce hover:animate-none transition-all cursor-pointer z-10">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">0 Double Bookings</p>
                  <p className="text-xs text-slate-500">Guaranteed System</p>
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
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 shadow-inner">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Find a Doctor</h3>
              <p className="text-slate-600">Search for specialized doctors near you based on symptoms or specialty.</p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mb-6 text-secondary-600 shadow-inner">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Choose a Slot</h3>
              <p className="text-slate-600">View real-time availability and select a time that fits your schedule perfectly.</p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 shadow-inner">
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
