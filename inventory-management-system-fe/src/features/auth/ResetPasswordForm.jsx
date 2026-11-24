/**
 * ============================================================
 * RESET PASSWORD FORM — Premium new password card
 * ============================================================
 */

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { KeyRound, Lock, Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Email missing. Please restart the process."); return; }

    try {
      setLoading(true);
      await authService.resetPassword({ email, newPassword });
      toast.success("Password updated successfully");
      router.push("/login");
    } catch (error) {
      toast.error(error.message || "Server connection failed");
    } finally {
      setLoading(false);
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
        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-card-hover)] border border-white/50 p-8 animate-reveal stagger-1">
          <div className="flex justify-center mb-6 animate-slideDown">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet-600 shadow-xl shadow-accent/30 animate-scaleIn stagger-2">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-center text-text-primary">Reset Password</h1>
          <p className="text-center text-text-secondary text-sm mt-1 mb-8">
            Set a new password for<br />
            <span className="font-medium text-text-primary">{email}</span>
          </p>

          <form className="space-y-5" onSubmit={handleReset}>
            <div className="animate-fadeIn stagger-3">
              <label className="block text-sm font-medium text-text-primary mb-1.5">New Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div className="animate-slideUp pt-2" style={{ animationDelay: '200ms' }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-accent to-accent-hover shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-60 transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-secondary text-sm">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
