import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, DollarSign, Layers, Percent, ShieldCheck } from "lucide-react";

export default function CalculationGuide() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      id="calculation-guide"
      className="bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-none shadow-[4px_4px_0px_#1A1A1A] overflow-hidden"
    >
      {/* Header Button (Collapsible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#EFEFDC] border-b-2 border-[#1A1A1A] hover:bg-[#e7e7d0] transition text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 shrink-0" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide font-display">
              06. Calculation Transparency Guide
            </h2>
            <p className="text-[10px] font-mono opacity-70 uppercase">
              How your rates are computed step-by-step in simple words
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 space-y-6 text-xs font-mono">
          {/* Section 1: The Base Rate Curve */}
          <div className="space-y-2 border-b border-dashed border-stone-200 pb-4">
            <h3 className="font-bold uppercase text-amber-800 flex items-center gap-1.5 text-[11px]">
              <Layers className="w-3.5 h-3.5" /> Step 1: Followers &amp; Base Price
            </h3>
            <p className="text-slate-700 leading-relaxed">
              We look at your follower count and set a realistic base price. This follows actual creator economy market rates in India so it can be trusted by both you and the brands:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              <div className="bg-stone-50 p-2.5 border border-stone-200">
                <span className="font-bold text-slate-800 block mb-0.5">Under 10k Followers (Nano)</span>
                <span className="text-slate-600 block text-[11px]">₹0.25 per follower (with a safe minimum of ₹1,000 for your effort).</span>
              </div>
              <div className="bg-stone-50 p-2.5 border border-stone-200">
                <span className="font-bold text-slate-800 block mb-0.5">10k to 100k Followers (Micro)</span>
                <span className="text-slate-600 block text-[11px]">₹2,500 base, plus ₹0.18 for every follower above 10,000.</span>
              </div>
              <div className="bg-stone-50 p-2.5 border border-stone-200">
                <span className="font-bold text-slate-800 block mb-0.5">100k to 500k (Mid-Tier)</span>
                <span className="text-slate-600 block text-[11px]">₹18,700 base, plus ₹0.12 for every follower above 100,000.</span>
              </div>
              <div className="bg-stone-50 p-2.5 border border-stone-200">
                <span className="font-bold text-slate-800 block mb-0.5">500k to 1M (Macro) &amp; Beyond</span>
                <span className="text-slate-600 block text-[11px]">Calibrated premium pricing up to ₹106,700 base + ₹0.05 per follower.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Multipliers */}
          <div className="space-y-2 border-b border-dashed border-stone-200 pb-4">
            <h3 className="font-bold uppercase text-blue-800 flex items-center gap-1.5 text-[11px]">
              <Percent className="w-3.5 h-3.5" /> Step 2: Applying the Multipliers
            </h3>
            <p className="text-slate-700 leading-relaxed">
              No two creators are the same. We apply four vital multipliers to your base price to find your customized individual post rate:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Niche demand (0.75x to 1.60x):</strong> Brands pay more for highly specialized niches (Finance &amp; Tech) and standard rates for general entertainment.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Engagement Boost (0.6x to 2.0x):</strong> The normal market engagement rate is 2.5%. If your views or likes are higher, your rate automatically increases. If they are lower, it adjusts downward fairly.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>City Living Cost (0.85x to 1.20x):</strong> Creators in Tier-1 cities (Mumbai, Bangalore, Delhi) have 1.2x higher expenses/hiring rates, which is added.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Post Format weight (0.45x to 2.50x):</strong> A complex YouTube Dedicated video gets 2.50x weight, while a quick Instagram Story gets 0.45x weight.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3: Package Builders */}
          <div className="space-y-2 border-b border-dashed border-stone-200 pb-4">
            <h3 className="font-bold uppercase text-emerald-800 flex items-center gap-1.5 text-[11px]">
              <DollarSign className="w-3.5 h-3.5" /> Step 3: Bundle Discounts &amp; Add-ons
            </h3>
            <p className="text-slate-700 leading-relaxed">
              When you propose a package, we make sure it makes business sense:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>
                  <strong>Package Bulk Discount:</strong> Brands love bundle deals. We apply a <strong>10% discount</strong> if you bundle 3+ posts, and a <strong>15% discount</strong> if you bundle 5+ posts.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>
                  <strong>Add-on charges:</strong> Extra services like <em>Exclusivity</em> (blocking competitor deals), <em>Usage Rights</em> (which you can fully customize using your monthly rate), and <em>Rush Delivery</em> are calculated as clear percentages of the deliverables. We even apply bulk discounts for longer ad rights (e.g., 2.5x of your monthly rate for 90 days, and 4.5x for 180 days).
                </span>
              </li>
            </ul>
          </div>

          {/* Section 4: Taxes & Product Values */}
          <div className="space-y-2">
            <h3 className="font-bold uppercase text-purple-800 flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> Step 4: Tax laws and Gifted Products
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Indian creator laws require strict accounting so we keep your tax compliance simple:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>
                  <strong>GST Registration:</strong> If you are GST-registered, an official 18% tax is added directly on top of your invoice so you can pay the government without dipping into your pocket.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>
                  <strong>Section 194R (10% TDS):</strong> If a brand gifts you an item worth ₹20,000 or more (like a phone or camera) and you keep it, you owe a 10% tax on its value. Our AI coach guides you to ask the brand to cover this tax.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
