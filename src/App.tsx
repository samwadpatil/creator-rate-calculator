/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  HelpCircle,
  FileText,
  Info,
  Layers,
  Scale,
  RefreshCw,
  Coins
} from "lucide-react";
import { CreatorInputs, NicheType, CityTier, FormatType } from "./types";
import { calculateCreatorRate } from "./utils/calculator";
import CalculatorForm from "./components/CalculatorForm";
import ReceiptPanel from "./components/ReceiptPanel";
import AiNegotiator from "./components/AiNegotiator";
import CalculationGuide from "./components/CalculationGuide";
import HelpWalkthroughModal from "./components/HelpWalkthroughModal";
import { trackVisitInFirestore, trackCalculationInFirestore } from "./lib/firebase";

const DEFAULT_INPUTS: CreatorInputs = {
  followers: 12000,
  accountsReached: 18000,
  accountsEngaged: 384,
  engagementRate: 3.2,
  niche: NicheType.TECH_BUSINESS,
  cityTier: CityTier.TIER_1,
  format: FormatType.IG_REEL,
  deliverablesCount: 1,
  deliverables: [
    { id: "1", format: FormatType.IG_REEL, count: 1 }
  ],
  exclusivityDays: 0,
  usageRightsDays: 0,
  usageRightsMonthlyPercent: 30,
  rushDelivery: false,
  whitelisting: false,
  productValue: 0,
  isProductKept: true,
  isGstRegistered: false,
  currency: "INR",
  creatorName: "",
  brandName: ""
};

// Custom Pre-calibrated creator scenarios
interface Preset {
  name: string;
  description: string;
  inputs: CreatorInputs;
}

const PRESETS: Preset[] = [
  {
    name: "Nano Finance (IG)",
    description: "8.5k followers, 12k reach, 357 engaged (4.2% ER), Mumbai",
    inputs: {
      followers: 8500,
      accountsReached: 12000,
      accountsEngaged: 357,
      engagementRate: 4.2,
      niche: NicheType.FINANCE,
      cityTier: CityTier.TIER_1,
      format: FormatType.IG_REEL,
      deliverablesCount: 1,
      deliverables: [
        { id: "nano_reel_1", format: FormatType.IG_REEL, count: 1 }
      ],
      exclusivityDays: 30,
      usageRightsDays: 0,
      usageRightsMonthlyPercent: 30,
      rushDelivery: false,
      whitelisting: false,
      productValue: 25000, // triggers 194R
      isProductKept: true,
      isGstRegistered: false,
      currency: "INR"
    }
  },
  {
    name: "Micro Beauty (IG)",
    description: "45k followers, 60k reach, 945 engaged (2.1% ER), Pune",
    inputs: {
      followers: 45000,
      accountsReached: 60000,
      accountsEngaged: 945,
      engagementRate: 2.1,
      niche: NicheType.FASHION_BEAUTY,
      cityTier: CityTier.TIER_2,
      format: FormatType.IG_REEL,
      deliverablesCount: 2,
      deliverables: [
        { id: "micro_reel_1", format: FormatType.IG_REEL, count: 2 }
      ],
      exclusivityDays: 0,
      usageRightsDays: 30,
      usageRightsMonthlyPercent: 30,
      rushDelivery: true,
      whitelisting: false,
      productValue: 12000,
      isProductKept: true,
      isGstRegistered: false,
      currency: "INR"
    }
  },
  {
    name: "Mid-Tier Tech (YouTube)",
    description: "180k followers, 240k impressions, 6.8k engagements, Bangalore",
    inputs: {
      followers: 180000,
      accountsReached: 240000,
      accountsEngaged: 6840,
      engagementRate: 3.8,
      niche: NicheType.TECH_BUSINESS,
      cityTier: CityTier.TIER_1,
      format: FormatType.YT_DEDICATED,
      deliverablesCount: 1,
      deliverables: [
        { id: "mid_yt_1", format: FormatType.YT_DEDICATED, count: 1 }
      ],
      exclusivityDays: 60,
      usageRightsDays: 90,
      usageRightsMonthlyPercent: 30,
      rushDelivery: false,
      whitelisting: true,
      productValue: 85000, // Triggers 194R
      isProductKept: true,
      isGstRegistered: true,
      currency: "INR"
    }
  }
];

export default function App() {
  const [inputs, setInputs] = useState<CreatorInputs>(DEFAULT_INPUTS);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const results = calculateCreatorRate(inputs);

  // Track page visit on mount to real-time Firestore
  React.useEffect(() => {
    trackVisitInFirestore();
  }, []);

  // Track calculation with debounce (2 seconds) to avoid writing to Firestore on every slider step
  React.useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculationInFirestore(
        inputs.followers,
        inputs.niche,
        results.totalDealValue,
        inputs.currency
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [inputs.followers, inputs.niche, results.totalDealValue, inputs.currency]);

  // Load shared deal state from URL hash if present
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#deal=")) {
        try {
          const base64 = hash.replace("#deal=", "");
          const decoded = JSON.parse(decodeURIComponent(atob(base64)));
          if (decoded && typeof decoded.followers === "number") {
            setInputs(decoded);
          }
        } catch (e) {
          console.error("Failed to load shared deal:", e);
        }
      }
    };

    handleHashChange(); // Run on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const applyPreset = (presetInputs: CreatorInputs) => {
    setInputs(presetInputs);
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#1A1A1A] pb-16 flex flex-col font-sans select-none antialiased">
      
      {/* Header Section */}
      <header className="no-print border-b-2 border-[#1A1A1A] p-6 flex flex-col md:flex-row justify-between items-start md:items-end bg-white gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase font-display">Creator Rate Calculator</h1>
          <p className="text-xs font-mono opacity-60 uppercase mt-1">Calculate professional campaign rates, deliverables, and tax-compliant brand invoices</p>
        </div>
        <div className="flex items-center gap-3 text-right font-mono text-xs w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-3 py-1.5 text-[11px] font-bold uppercase border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-slate-800 active:translate-y-0.5 transition flex items-center gap-1.5 rounded-none cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Help &amp; Walkthrough
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-[11px] font-bold uppercase border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#FDFDFB] active:translate-y-0.5 transition flex items-center gap-1.5 rounded-none cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Calculator
          </button>
          <div className="hidden sm:block text-right">
            <div className="text-[10px] font-bold uppercase opacity-40">Tax Year</div>
            <div className="font-bold text-xs">2026 - 2027 (India)</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-1 w-full">
        
        {/* Split Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Form Inputs & AI negotiator (Take 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <CalculatorForm inputs={inputs} onChange={setInputs} />
            <AiNegotiator inputs={inputs} results={results} />
            <CalculationGuide />
          </div>

          {/* Right Column: Sticky Bill Receipt (Take 5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <ReceiptPanel inputs={inputs} results={results} />
          </div>

        </div>

      </main>

      {/* Footer Bar */}
      <footer className="no-print border-t-2 border-[#1A1A1A] bg-[#1A1A1A] text-white p-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4">
        <div>&copy; {new Date().getFullYear()} Creator Rate Calculator. All rights reserved.</div>
        <div className="opacity-60 text-right">Computed using industry-standard pricing parameters &amp; compliant with Section 194R tax guidelines.</div>
      </footer>

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] receipt-ledger" />

      {/* Interactive Walkthrough & Tax Help Modal */}
      <HelpWalkthroughModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
        currency={inputs.currency} 
      />
    </div>
  );
}
