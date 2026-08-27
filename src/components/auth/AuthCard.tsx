"use client";

import { useState } from "react";
import PatientLoginForm from "./PatientLoginForm";
import PatientSignupForm from "./PatientSignupForm";
import { UserCheck, ShieldCheck } from "lucide-react";

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/70 bg-white/75 backdrop-blur-xl shadow-xl shadow-secondary-900/5">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md shadow-secondary-600/30 mb-3">
            P
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {activeTab === "login" ? "Welcome Back to Practo" : "Join Practo Health"}
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            {activeTab === "login"
              ? "Sign in to manage your appointments and consult doctors"
              : "Register as a patient to book consultations seamlessly"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "login"
                ? "bg-secondary-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "signup"
                ? "bg-secondary-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Sign Up
          </button>
        </div>

        {/* Form area */}
        {activeTab === "login" ? (
          <PatientLoginForm onSwitchToSignup={() => setActiveTab("signup")} />
        ) : (
          <PatientSignupForm onSwitchToLogin={() => setActiveTab("login")} />
        )}
      </div>
    </div>
  );
}
