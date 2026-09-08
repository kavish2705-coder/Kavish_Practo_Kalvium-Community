import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export const metadata = {
  title: "Reset Password | Practo Medical Consultancy",
  description: "Create a new password for your Practo account.",
};

function ResetPasswordFallback() {
  return (
    <div className="w-full max-w-md mx-auto p-12 text-center glass-card rounded-3xl border border-white/70 bg-white/75 shadow-xl">
      <Loader2 className="h-8 w-8 text-secondary-600 animate-spin mx-auto mb-3" />
      <p className="text-xs text-slate-600 font-medium">Loading password reset form...</p>
    </div>
  );
}

export default function ResetPasswordPage() {
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

      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>

      <footer className="mt-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} PRACTO. Preserving patient health & privacy.</p>
      </footer>
    </div>
  );
}
