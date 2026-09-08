import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Forgot Password | Practo Medical Consultancy",
  description: "Request a password reset link for your Practo account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-slate-50/50">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-secondary-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>

      <ForgotPasswordForm />

      <footer className="mt-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} PRACTO. Preserving patient health & privacy.</p>
      </footer>
    </div>
  );
}
