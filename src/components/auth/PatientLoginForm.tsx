"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";

interface PatientLoginFormProps {
  onSwitchToSignup?: () => void;
}

export default function PatientLoginForm({ onSwitchToSignup }: PatientLoginFormProps) {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { emailOrPhone?: string; password?: string } = {};
    
    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or Phone number is required.";
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
      const isPhone = /^[0-9]{10}$/.test(emailOrPhone);
      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone = "Please enter a valid email address or 10-digit mobile number.";
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate brief client-side login delay
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);

    // Redirect to patient dashboard
    router.push("/dashboard/patient");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email address or Phone number"
        type="text"
        placeholder="e.g. patient@example.com or 9876543210"
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        icon={<Mail className="h-4 w-4 text-slate-500" />}
        error={errors.emailOrPhone}
      />

      <div>
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4 text-slate-500" />}
            error={errors.password}
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
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-slate-300 text-secondary-600 focus:ring-secondary-600 h-4 w-4"
          />
          Remember me
        </label>
        <button
          type="button"
          className="text-secondary-700 font-semibold hover:underline"
          onClick={() => alert("Password reset link feature coming soon.")}
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-secondary-600 hover:bg-secondary-700 text-white font-bold shadow-md shadow-secondary-600/20 rounded-xl mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            Log In as Patient
          </>
        )}
      </Button>

      {onSwitchToSignup && (
        <div className="text-center pt-3 text-xs text-slate-600">
          Don&apos;t have a patient account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-bold text-secondary-700 hover:underline"
          >
            Register Now
          </button>
        </div>
      )}
    </form>
  );
}
