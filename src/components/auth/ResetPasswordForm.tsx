"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage("No password reset token was provided in the URL.");
      return;
    }

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setErrorMessage(
          data.error || "Failed to reset password. The link may be expired or invalid."
        );
        return;
      }

      setIsSuccess(true);
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
            Create New Password
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Please enter and confirm your new secure password.
          </p>
        </div>

        {/* Missing Token Banner */}
        {!token && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl mb-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Missing Reset Token</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              No reset token found in your link. Please use the complete link sent to your email or request a new reset link.
            </p>
            <div className="pt-1">
              <Link
                href="/forgot-password"
                className="inline-flex items-center text-xs font-bold text-secondary-700 hover:underline"
              >
                Request a new reset link &rarr;
              </Link>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 mb-4 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <div className="space-y-1">
              <p>{errorMessage}</p>
              {(errorMessage.includes("expired") ||
                errorMessage.includes("used") ||
                errorMessage.includes("invalid")) && (
                <Link
                  href="/forgot-password"
                  className="inline-block text-secondary-700 font-bold underline hover:text-secondary-800 pt-0.5"
                >
                  Request a new password reset link
                </Link>
              )}
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-secondary-50 border border-secondary-200/80 rounded-2xl">
              <CheckCircle2 className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-secondary-900 mb-1">
                Password Reset Successfully!
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your password has been updated. You can now use your new password to sign in to your Practo account.
              </p>
            </div>

            <Link href="/login" className="block w-full">
              <Button
                type="button"
                className="w-full h-11 bg-secondary-600 hover:bg-secondary-700 text-white font-bold shadow-md shadow-secondary-600/20 rounded-xl"
              >
                Proceed to Login
              </Button>
            </Link>
          </div>
        ) : (
          token && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  error={fieldErrors.password}
                  icon={<Lock className="h-4 w-4" />}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  error={fieldErrors.confirmPassword}
                  icon={<Lock className="h-4 w-4" />}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-secondary-600 hover:bg-secondary-700 text-white font-bold shadow-md shadow-secondary-600/20 rounded-xl mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-secondary-700"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}
