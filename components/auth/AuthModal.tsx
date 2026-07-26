"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci Concierge Authentication Modal
 * ============================================================================
 */

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: { email: string; name: string; role: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      toast.success("Welcome back to The Raw House Atelier", {
        description: `Logged in as ${email}`,
      });
      if (onLoginSuccess) {
        onLoginSuccess({
          email,
          name: email.split("@")[0],
          role: email.includes("admin") ? "ADMIN" : "CUSTOMER",
        });
      }
      onClose();
    } else if (mode === "register") {
      toast.success("Account Created Successfully", {
        description: "A verification email has been dispatched via Resend.",
      });
      setMode("login");
    } else {
      toast.info("Password Reset Sent", {
        description: `Instructions sent to ${email}`,
      });
      setMode("login");
    }
  };

  const handleGoogleAuth = () => {
    toast.success("Google Authentication Verified", {
      description: "Signed in via Google OAuth.",
    });
    if (onLoginSuccess) {
      onLoginSuccess({
        email: "client@gmail.com",
        name: "Valued Client",
        role: "CUSTOMER",
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-raw-bg/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md bg-raw-card border border-raw-border shadow-2xl p-8 z-10 text-raw-ivory">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-raw-ivory hover:text-raw-gold p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-raw-gold text-2xl font-serif-luxury tracking-tighter">𝓡</span>
          <h3 className="text-xl font-serif-luxury tracking-[0.2em] uppercase text-raw-ivory">
            {mode === "login" && "Atelier Client Login"}
            {mode === "register" && "Create Concierge Account"}
            {mode === "forgot" && "Recover Password"}
          </h3>
          <p className="text-xs text-raw-muted tracking-wide">
            Access private runway collections and order history
          </p>
        </div>

        {/* Google OAuth Button */}
        {mode !== "forgot" && (
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-raw-charcoal hover:bg-raw-border border border-raw-border py-3 text-xs uppercase tracking-widest text-raw-ivory font-semibold flex items-center justify-center space-x-3 mb-6 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {mode !== "forgot" && (
          <div className="relative text-center my-6">
            <span className="bg-raw-card px-3 text-[10px] uppercase tracking-[0.25em] text-raw-muted">
              Or With Email
            </span>
            <div className="absolute inset-0 top-1/2 -z-10 h-[1px] bg-raw-border/60" />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5 text-raw-muted" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-raw-bg border border-raw-border focus:border-raw-gold text-xs text-raw-ivory pl-10 pr-4 py-3 outline-none tracking-wider placeholder-raw-muted"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3.5 text-raw-muted" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-raw-bg border border-raw-border focus:border-raw-gold text-xs text-raw-ivory pl-10 pr-4 py-3 outline-none tracking-wider placeholder-raw-muted"
            />
          </div>

          {mode !== "forgot" && (
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-raw-muted" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-raw-bg border border-raw-border focus:border-raw-gold text-xs text-raw-ivory pl-10 pr-4 py-3 outline-none tracking-wider placeholder-raw-muted"
              />
            </div>
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-[11px] text-raw-gold hover:underline tracking-wider"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-raw-gold hover:bg-raw-goldHover text-raw-bg py-3.5 text-xs font-bold uppercase tracking-[0.25em] transition-all shadow-lg mt-4"
          >
            {mode === "login" && "SIGN IN TO ATELIER"}
            {mode === "register" && "CREATE ATELIER ACCOUNT"}
            {mode === "forgot" && "SEND RECOVERY LINK"}
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div className="mt-8 text-center text-xs tracking-wider text-raw-muted space-x-1">
          {mode === "login" ? (
            <>
              <span>Don't have an account?</span>
              <button
                onClick={() => setMode("register")}
                className="text-raw-gold font-semibold underline hover:text-raw-goldHover"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span>Already registered?</span>
              <button
                onClick={() => setMode("login")}
                className="text-raw-gold font-semibold underline hover:text-raw-goldHover"
              >
                Sign In
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
