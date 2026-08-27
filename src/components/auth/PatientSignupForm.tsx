"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, UserCheck, Lock, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

interface PatientSignupFormProps {
  onSwitchToLogin?: () => void;
}

export default function PatientSignupForm({ onSwitchToLogin }: PatientSignupFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (at least 2 characters).";
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phone.trim() || !/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      newErrors.age = "Please enter a valid age (1-120).";
    }

    if (!gender) {
      newErrors.gender = "Please select your gender.";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and privacy policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate brief client-side signup delay
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);

    // Redirect to patient dashboard
    router.push("/dashboard/patient");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. John Doe"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        icon={<User className="h-4 w-4 text-slate-500" />}
        error={errors.fullName}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4 text-slate-500" />}
          error={errors.email}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Phone className="h-4 w-4 text-slate-500" />}
          error={errors.phone}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Age"
          type="number"
          placeholder="28"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          icon={<UserCheck className="h-4 w-4 text-slate-500" />}
          error={errors.age}
        />
        <Select
          label="Gender"
          options={genderOptions}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          error={errors.gender}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <Input
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="h-4 w-4 text-slate-500" />}
          error={errors.confirmPassword}
        />
      </div>

      <div className="pt-1">
        <label className="flex items-start gap-2 text-xs text-slate-600 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-secondary-600 focus:ring-secondary-600 h-4 w-4"
          />
          <span>
            I agree to the <span className="text-secondary-700 font-semibold underline">Terms of Service</span> and{" "}
            <span className="text-secondary-700 font-semibold underline">Privacy Policy</span>.
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-xs font-medium text-red-500 mt-1">{errors.agreeTerms}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-secondary-600 hover:bg-secondary-700 text-white font-bold shadow-md shadow-secondary-600/20 rounded-xl mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Create Patient Account
          </>
        )}
      </Button>

      {onSwitchToLogin && (
        <div className="text-center pt-2 text-xs text-slate-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-secondary-700 hover:underline"
          >
            Log In
          </button>
        </div>
      )}
    </form>
  );
}
