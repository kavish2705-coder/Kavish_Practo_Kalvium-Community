import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import PatientLoginForm from "@/components/auth/PatientLoginForm";

export const metadata = {
  title: "Provider & Admin Portal | Practo Medical Consultancy",
  description: "Secure login portal for Practo healthcare providers and administrators.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 bg-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md mb-3">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Provider & Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Secure access for authorized personnel only
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-inner">
            <PatientLoginForm />
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} PRACTO. Internal Portal.</p>
      </footer>
    </div>
  );
}
