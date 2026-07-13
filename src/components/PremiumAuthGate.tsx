/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  auth 
} from "../lib/firebase";
import { 
  Lock, 
  Mail, 
  User, 
  Coins, 
  TrendingUp, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Percent,
  FileSpreadsheet
} from "lucide-react";
import { motion } from "motion/react";

interface PremiumAuthGateProps {
  onAuthSuccess: (user: FirebaseUser) => void;
}

export default function PremiumAuthGate({ onAuthSuccess }: PremiumAuthGateProps) {
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup"); // Default to signup, easily toggleable
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMode === "signup") {
        if (!name.trim()) {
          throw new Error("Please enter your name or channel handle.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
        onAuthSuccess({ ...userCredential.user, displayName: name });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      }
    } catch (err: any) {
      console.error("Auth Gate Error:", err);
      let errMsg = err.message || "An authentication error occurred.";
      if (err.code === "auth/email-already-in-use") {
        errMsg = "This email address is already registered.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Password must be at least 6 characters.";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        errMsg = "Incorrect email address or password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing/debugging
  const handleQuickFill = () => {
    setEmail("creator.demo@example.com");
    setPassword("creator123");
    if (authMode === "signup") {
      setName("Alex Rivera");
    }
  };

  return (
    <div id="premium-auth-container" className="min-h-screen bg-[#F4F4F1] text-[#1A1A1A] flex flex-col lg:flex-row font-sans selection:bg-[#EFEFDC]">
      
      {/* Left Column - Real Product Overview */}
      <div className="lg:w-[45%] bg-[#FAF9F5] border-b-2 lg:border-b-0 lg:border-r-2 border-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between shrink-0">
        
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EFEFDC] border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider font-mono">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            CREATOR UTILITY
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase font-display text-[#1A1A1A]">
            CREATOR RATE<br />CALCULATOR
          </h1>
          <p className="text-xs font-mono uppercase text-slate-500 leading-normal max-w-sm">
            Professional pricing, dynamic campaign builder, and tax-compliant invoicing workspace for creators and brands.
          </p>
          <div className="w-16 h-[3px] bg-[#1A1A1A] mt-4" />
        </div>

        {/* Real Product Value Proposition */}
        <div className="my-10 lg:my-0 space-y-8">
          <div className="space-y-5">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-[#1A1A1A] font-display leading-tight">
              A smarter way to invoice and pitch.
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              Pricing yourself as a content creator shouldn't be guesswork. This calculator maps out verified market rates based on your channel metrics, automatically computes India's local taxation safeguards, and crafts AI-backed negotiation pitches for campaign discussions.
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <div className="p-1.5 bg-[#EFEFDC] text-[#1A1A1A] rounded-none shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-[#1A1A1A]">Live Campaign Deliverables</h3>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Calculate benchmark rates across Instagram Stories, Reels, Carousels, and YouTube.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <div className="p-1.5 bg-[#EFEFDC] text-[#1A1A1A] rounded-none shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-[#1A1A1A]">Section 194R &amp; GST Protections</h3>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Determine exactly if you fall under barter tax withholding or the standard 20L GST threshold.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              <div className="p-1.5 bg-[#EFEFDC] text-[#1A1A1A] rounded-none shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-[#1A1A1A]">AI Negotiation Assistant</h3>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Access customizable pitches powered by Gemini to counter brand pushbacks and secure terms.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Stats / Capabilities */}
        <div className="pt-6 border-t border-dashed border-slate-300 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-base font-black text-[#1A1A1A] tracking-tight">100%</div>
            <div className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Private State</div>
          </div>
          <div>
            <div className="text-base font-black text-[#1A1A1A] tracking-tight">2026-27</div>
            <div className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Tax Tables</div>
          </div>
          <div>
            <div className="text-base font-black text-[#1A1A1A] tracking-tight">FREE</div>
            <div className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Unlimited Uses</div>
          </div>
        </div>

      </div>

      {/* Right Column - Premium Credentials Gateway */}
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md bg-white border-2 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] p-6 md:p-10 space-y-8 relative">
          
          {/* Form Header */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] font-display">
              {authMode === "signup" ? "Create Creator Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-slate-500 uppercase">
              {authMode === "signup" 
                ? "Sign up to track and organize your campaign rates, tax details, and contracts." 
                : "Sign in with your email to view your saved parameters."}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border-2 border-red-500 text-red-950 text-xs flex items-start gap-2.5 rounded-none font-mono"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold uppercase block text-red-700">Auth Exception</span>
                <p className="leading-normal">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            
            {authMode === "signup" && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">CREATOR / HANDLE NAME</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 border-r border-slate-200 pr-2">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @yourhandle"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F5] border-2 border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] placeholder-slate-400 rounded-none transition"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">EMAIL ADDRESS</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 border-r border-slate-200 pr-2">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="creator@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-[#FAF9F5] border-2 border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] placeholder-slate-400 rounded-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">PASSWORD</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 border-r border-slate-200 pr-2">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-11 py-2.5 bg-[#FAF9F5] border-2 border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-[#1A1A1A] placeholder-slate-400 rounded-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-[#1A1A1A] text-white hover:bg-slate-800 active:translate-y-0.5 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 rounded-none border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  VALIDATING ACCESS...
                </span>
              ) : (
                <span className="flex items-center gap-2 font-bold uppercase">
                  {authMode === "signup" ? "Get Started & Initialize" : "Authorize Session"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Switch Auth mode link */}
          <div className="text-center pt-1 font-mono">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "signup" ? "signin" : "signup");
                setError(null);
              }}
              className="text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-[#1A1A1A] transition hover:underline"
            >
              {authMode === "signup" 
                ? "Already have an account? Sign In" 
                : "New creator? Register here"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
