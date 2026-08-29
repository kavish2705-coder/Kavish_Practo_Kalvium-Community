import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Patient Login & Sign Up | Practo Medical Consultancy",
  description: "Log in or register to manage your appointments and consult top doctors.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-slate-50/50">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-secondary-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <AuthCard />

      <footer className="mt-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} PRACTO. Preserving patient health & privacy.</p>
      </footer>
    </div>
  );
}
