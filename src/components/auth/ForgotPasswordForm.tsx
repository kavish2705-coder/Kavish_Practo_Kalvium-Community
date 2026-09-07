"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const errors: { email?: string } = {};
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setErrorMessage(data.error || "Failed to send reset email. Please try again.");
        return;
      }

      setIsSubmitted(true);
      setSuccessMessage(
        data.data?.message ||
          "If an account exists with that email, a password reset link has been sent."
      );
    } catch {
      setErrorMessage("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/70 bg-white/75 backdrop-blur-xl shadow-xl shadow-secondary-900/5">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md shadow-secondary-600/30 mb-3">
            P
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Enter your registered email address and we will send you a link to reset your password.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 mb-4 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-secondary-50 border border-secondary-200/80 rounded-2xl text-center">
              <CheckCircle2 className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-secondary-900 mb-1">
                Request Processed
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {successMessage}
              </p>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Did not receive an email? Check your spam folder or request another link.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setSuccessMessage("");
              }}
              className="w-full h-11 border-slate-300 hover:border-secondary-500 font-semibold rounded-xl text-xs"
            >
              Send to a different email or retry
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-700 hover:text-secondary-800 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. patient@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              error={fieldErrors.email}
              icon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-secondary-600 hover:bg-secondary-700 text-white font-bold shadow-md shadow-secondary-600/20 rounded-xl mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center pt-3 text-xs text-slate-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-secondary-700 font-bold hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
