/**
 * ============================================================
 * LOGIN FORM — Premium centered card design
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login(formData);
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Server connection failed");
      setIsLoading(false);
    }
  };

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
          <h2 className="text-xl font-semibold text-text-primary text-center mb-6">Welcome back</h2>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="animate-fadeIn stagger-3">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                  className="w-full border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm bg-surface/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent border-b-2 hover:bg-surface transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="animate-fadeIn stagger-4">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  className="w-full border border-border rounded-xl py-2.5 pl-11 pr-11 text-sm bg-surface/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent border-b-2 hover:bg-surface transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right animate-fadeIn stagger-5">
              <Link href="/forgot-password" className="text-sm text-accent hover:text-accent-hover font-medium transition">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <div className="animate-slideUp stagger-6 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-accent to-accent-hover shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-60 transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-8 text-sm text-text-secondary animate-fadeIn stagger-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-accent hover:text-accent-hover transition relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-accent after:transition-all after:duration-300">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
