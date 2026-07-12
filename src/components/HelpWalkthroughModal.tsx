import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Scale,
  Sparkles,
  Layers,
  FileText,
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface HelpWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
}

export default function HelpWalkthroughModal({ isOpen, onClose, currency }: HelpWalkthroughModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const totalSteps = 4;

  const steps = [
    {
      title: "Welcome to the Rate Engine",
      subtitle: "STEP 1 OF 4 • ESTABLISHING YOUR BASE RATE",
      icon: <TrendingUp className="w-8 h-8 text-[#1A1A1A]" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            This calculator helps you determine fair-market rates for brand partnerships based on your creator metrics and live Indian marketing benchmarks.
          </p>
          <div className="border border-[#1A1A1A] p-4 bg-stone-50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#1A1A1A]" />
              How Base Rates are Calibrated:
            </h4>
            <ul className="text-xs space-y-2 text-slate-600 list-disc pl-4">
              <li>
                <strong>Audience &amp; Reach:</strong> Your follower count and active account reach set the foundation.
              </li>
              <li>
                <strong>Niche Multiplier:</strong> High-conversion niches (e.g., Finance 1.60x, Tech/AI 1.45x) command premium rates due to target audience value.
              </li>
              <li>
                <strong>Location &amp; Engagement:</strong> Metros (Tier 1 1.20x) and strong engagement rates apply positive multipliers to your base.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Deliverables & Premium Extras",
      subtitle: "STEP 2 OF 4 • CUSTOMIZING THE CAMPAIGN SCOPE",
      icon: <Layers className="w-8 h-8 text-[#1A1A1A]" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Do not undercharge for specialized usage of your work or intellectual property. The calculator adds standardized rates for various deliverables.
          </p>
          <div className="border border-[#1A1A1A] p-4 bg-stone-50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#1A1A1A]" />
              Premium Add-ons &amp; Commercial Clauses:
            </h4>
            <ul className="text-xs space-y-2 text-slate-600 list-disc pl-4">
              <li>
                <strong>Exclusivity:</strong> Charge +15% per month. Preventing you from working with competing brands is an opportunity cost.
              </li>
              <li>
                <strong>Usage Rights:</strong> If the brand runs ads with your content, charge +30% per month of the deliverable value.
              </li>
              <li>
                <strong>Rush &amp; Whitelisting:</strong> Adds extra fees (10% and 15%) for tight deadlines or allowing them to post through your handler.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Section 194R & Barter Offset",
      subtitle: "STEP 3 OF 4 • UNDERSTANDING BARTER TAXATION",
      icon: <Scale className="w-8 h-8 text-[#1A1A1A]" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Indian Income Tax <strong className="text-[#1A1A1A]">Section 194R</strong> requires brands to deduct a 10% TDS on any barter gifts or perquisites worth more than ₹20,000 per year if retained by the creator.
          </p>
          
          <div className="border-2 border-dashed border-[#1A1A1A] p-4 bg-amber-50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-800" />
              Why keeping the product reduces the cash invoice:
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              If a brand gives you a product worth <strong>{currency === "INR" ? "₹20,000" : "$250"}</strong> and you keep it, that product is considered <strong>payment-in-kind (compensation)</strong>.
            </p>
            <div className="p-2.5 bg-white border border-[#1A1A1A] text-center font-mono text-xs text-[#1A1A1A] rounded-none">
              Services Value − Retained Barter Value = Net Cash Due
            </div>
            <ul className="text-xs space-y-1 text-slate-600 list-disc pl-4">
              <li>
                <strong>No Double-Charging:</strong> If you do not subtract the barter price, the brand would be paying you the full cash <em>plus</em> letting you keep the product, which is not what was agreed.
              </li>
              <li>
                <strong>Honest Brand Invoice:</strong> This offset ensures your invoice displays the exact bank transfer amount the brand owes you, matching tax declarations.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Generate & Save Your Invoice",
      subtitle: "STEP 4 OF 4 • DOWNLOAD COMPLIANT PDFS",
      icon: <FileText className="w-8 h-8 text-[#1A1A1A]" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Once you have finalized your parameters, you can customize and output the invoice to send directly to the brand.
          </p>
          <div className="border border-[#1A1A1A] p-4 bg-[#FDFDFB] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#1A1A1A]" />
              Failsafe Print Instructions:
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click <strong>Print / Save PDF</strong> on the receipt panel. It hides all calculator inputs and formats a beautiful, professional, single-page client invoice.
            </p>
            <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs p-3 font-medium">
              💡 <strong>Iframe Warning:</strong> If the print dialog does not open in the AI Studio preview, click the <strong>"Open in New Tab"</strong> link in the top-right corner of the window. Print works perfectly in a normal browser tab!
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in no-print">
      <div 
        className="relative w-full max-w-xl bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#FDFDFB] active:translate-y-0.5 transition rounded-none cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b-2 border-[#1A1A1A] pb-4 mb-6">
          <div className="p-3 bg-stone-100 border-2 border-[#1A1A1A]">
            {steps[currentStep].icon}
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              {steps[currentStep].subtitle}
            </span>
            <h3 className="text-xl font-black tracking-tight text-[#1A1A1A] uppercase">
              {steps[currentStep].title}
            </h3>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 min-h-[220px]">
          {steps[currentStep].content}
        </div>

        {/* Navigation Footer */}
        <div className="border-t-2 border-[#1A1A1A] pt-6 mt-6 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-3 h-3 border border-[#1A1A1A] transition-all rounded-none cursor-pointer ${
                  currentStep === idx ? "bg-[#1A1A1A] scale-110" : "bg-white hover:bg-stone-100"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 font-mono text-xs">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 font-bold uppercase border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-stone-50 active:translate-y-0.5 transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2 font-bold uppercase border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-slate-800 active:translate-y-0.5 transition flex items-center gap-1 cursor-pointer"
            >
              {currentStep === totalSteps - 1 ? "Finish" : "Next"}
              {currentStep < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
