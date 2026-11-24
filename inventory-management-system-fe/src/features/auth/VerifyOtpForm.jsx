/**
 * ============================================================
 * VERIFY OTP FORM — Premium OTP verification card
 * ============================================================
 */

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { ShieldCheck } from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Email missing. Please try again."); return; }
    if (!otp) { toast.error("Please enter OTP"); return; }

    try {
      setLoading(true);
      await authService.verifyOtp({ email, otp });
      toast.success("OTP verified");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Server error");
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
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-center text-text-primary">Verify OTP</h1>
          <p className="text-center text-text-secondary text-sm mt-1 mb-8">Enter the OTP sent to your email</p>

          <form className="space-y-5" onSubmit={handleVerify}>
            <div className="animate-fadeIn stagger-3">
              <label className="block text-sm font-medium text-text-primary mb-1.5">One-Time Password</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full border border-border rounded-xl py-2.5 px-4 text-sm bg-surface/50 text-text-primary text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent border-b-2 hover:bg-surface transition-all duration-200"
              />
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
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-secondary text-sm">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
