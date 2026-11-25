/**
 * ============================================================
 * REGISTER FORM — Premium account creation with Zod validation
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/registerSchema";
import { authService } from "@/services/authService";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (formData) => {
    try {
      await authService.register(formData);
      toast.success("Account created successfully");
      router.replace("/login");
    } catch (error) {
      toast.error(error.message || "Server error. Please try again.");
    }
  };

  const inputClass = "w-full border border-border rounded-lg py-2.5 pl-11 pr-4 text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg px-4 overflow-hidden relative">
      {/* Animated Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float-1" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] animate-float-2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-slideDown">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-violet-600 flex items-center justify-center mb-5 shadow-xl shadow-accent/30 animate-scaleIn stagger-1">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Inventory Manager</h1>
          <p className="text-text-secondary text-sm mt-1.5 font-medium">IT Asset Management System</p>
        </div>

        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-card-hover)] border border-white/50 p-8 animate-reveal stagger-2">
          <h2 className="text-xl font-semibold text-text-primary text-center mb-6">Create Account</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name */}
            <div className="animate-fadeIn stagger-3">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                <input type="text" placeholder="Enter your name" {...register("name")} className={inputClass} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="animate-fadeIn stagger-4">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                <input type="email" placeholder="Enter your email" {...register("email")} className={inputClass} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="animate-fadeIn stagger-6">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                <input type={showPassword ? "text" : "password"} placeholder="Create a password" {...register("password")} className={`${inputClass} pr-11`} />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <div className="animate-slideUp pt-2" style={{ animationDelay: '350ms' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-accent to-accent-hover shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-60 transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-8 text-sm text-text-secondary animate-fadeIn" style={{ animationDelay: '400ms' }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:text-accent-hover transition relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-accent after:transition-all after:duration-300">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
