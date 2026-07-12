/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  FileText,
  TrendingUp,
  MapPin,
  ChevronRight,
  Scale,
  Download,
  AlertTriangle,
  Coins,
  CheckCircle,
  HelpCircle,
  Info,
  Printer,
  Share2
} from "lucide-react";
import { CreatorInputs, CalculationResult } from "../types";
import { formatCurrency } from "../utils/calculator";

interface ReceiptPanelProps {
  inputs: CreatorInputs;
  results: CalculationResult;
}

export default function ReceiptPanel({ inputs, results }: ReceiptPanelProps) {
  const [animateKey, setAnimateKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPrintIframeWarning, setShowPrintIframeWarning] = useState(false);

  const handlePrint = () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      setShowPrintIframeWarning(true);
      try {
        window.print();
      } catch (e) {
        console.warn("Print dialog blocked or restricted in preview mode:", e);
      }
    } else {
      window.print();
    }
  };

  const handleShare = () => {
    try {
      const serialized = btoa(encodeURIComponent(JSON.stringify(inputs)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#deal=${serialized}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Sharing failed:", e);
    }
  };

  useEffect(() => {
    setAnimateKey(prev => prev + 1);
  }, [results.totalDealValue, results.totalDeliverablesCount, inputs.followers, inputs.niche]);

  const getNicheMultiplierLabel = (niche: string) => {
    const labels: Record<string, string> = {
      finance: "Finance (1.60x)",
      tech_business: "Tech/AI (1.45x)",
      health_wellness: "Wellness (1.30x)",
      travel_food: "Travel/Food (1.25x)",
      fashion_beauty: "Fashion/Beauty (1.15x)",
      education: "Education (1.20x)",
      gaming: "Gaming (0.90x)",
      entertainment: "Entertainment (0.75x)"
    };
    return labels[niche] || niche;
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      ig_reel: "IG Reel (1.20x)",
      ig_story: "IG Story (0.45x)",
      ig_carousel: "IG Carousel (0.80x)",
      yt_dedicated: "YT Dedicated (2.50x)",
      yt_integrated: "YT Integrated (1.50x)",
      yt_shorts: "YT Shorts (0.90x)"
    };
    return labels[format] || format;
  };

  const getCityLabel = (tier: string) => {
    const labels: Record<string, string> = {
      tier_1: "Tier 1 Metro (1.20x)",
      tier_2: "Tier 2 Metro (1.00x)",
      tier_3: "Tier 3 Regional (0.85x)"
    };
    return labels[tier] || tier;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Bento Audit Panel */}
      <div 
        id="receipt-container"
        className="relative bg-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] rounded-none overflow-hidden font-mono text-sm text-[#1A1A1A]"
      >
        {/* Receipt Header */}
        <div className="border-b-2 border-[#1A1A1A] p-5 bg-[#FDFDFB]">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5 flex-1">
              <h2 className="font-display font-black text-xs uppercase tracking-wider text-slate-500">
                OFFICIAL RATE CARD
              </h2>
              <div className="text-[11px] font-mono text-[#1A1A1A] space-y-1">
                <div><span className="opacity-60 uppercase font-bold text-[9px] inline-block w-16">Creator:</span> <span className="font-bold font-sans text-xs">{inputs.creatorName || "Your Handle"}</span></div>
                <div><span className="opacity-60 uppercase font-bold text-[9px] inline-block w-16">Partner:</span> <span className="font-bold font-sans text-xs">{inputs.brandName || "Brand Partner"}</span></div>
                <div><span className="opacity-60 uppercase font-bold text-[9px] inline-block w-16">Invoice Ref:</span> <span className="font-bold text-xs uppercase">#CR-2026-{(inputs.creatorName || "MAIN").replace(/[@\-_]/g, "").slice(0, 4).toUpperCase() || "DEAL"}-{Math.floor(results.totalDealValue % 10000)}</span></div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
              <span className="inline-block px-2.5 py-0.5 bg-blue-50 border border-blue-800 text-blue-800 text-[9px] font-extrabold uppercase tracking-widest">
                RATE ESTIMATE
              </span>
              <p className="text-[9px] font-mono opacity-50 uppercase">Date: {new Date().toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Dynamic transition flash line */}
        <div className="h-1 bg-[#1A1A1A]" />

        <div className="p-6 space-y-5">
          
          {/* Multiplier Stack */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase opacity-60 tracking-wider">
              01. Base Valuation & Multipliers
            </h3>
            
            <div className="space-y-1.5 text-xs border border-dashed border-[#1A1A1A] p-4 bg-stone-50">
              <div className="flex justify-between items-center">
                <span className="opacity-60 uppercase">Follower Base:</span>
                <span className="font-bold">{formatCurrency(results.baseRate, inputs.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="opacity-60 uppercase">Niche Multiplier ({getNicheMultiplierLabel(inputs.niche)}):</span>
                <span className="font-bold text-slate-800">× {results.nicheMultiplier.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="opacity-60 uppercase">Engagement Multiplier (ER {inputs.engagementRate}%):</span>
                <span className="font-bold text-slate-800">× {results.engagementMultiplier.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="opacity-60 uppercase">Location Multiplier ({getCityLabel(inputs.cityTier)}):</span>
                <span className="font-bold text-slate-800">× {results.cityMultiplier.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="opacity-60 uppercase">Format Multiplier ({getFormatLabel(inputs.format)}):</span>
                <span className="font-bold text-slate-800">× {results.formatMultiplier.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#1A1A1A] my-1.5 pt-1.5 flex justify-between font-bold text-sm">
                <span>ADJUSTED BASE / DELIVERABLE:</span>
                <span>{formatCurrency(results.adjustedBaseRate, inputs.currency)}</span>
              </div>
            </div>
          </div>

          {/* Deliverables Sum */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase opacity-60 tracking-wider">
              02. Deliverables Package Breakdown
            </h3>
            
            <div className="space-y-2.5 text-xs">
              {results.deliverableResults && results.deliverableResults.map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between items-start border-b border-dashed border-slate-200 pb-2">
                  <div>
                    <span className="font-bold text-[#1A1A1A]">{getFormatLabel(item.format)}</span>
                    <span className="block text-[10px] text-slate-500">
                      {item.count}x @ {formatCurrency(item.unitRate, inputs.currency)} each
                    </span>
                  </div>
                  <span className="font-bold text-[#1A1A1A]">
                    {formatCurrency(item.subtotal, inputs.currency)}
                  </span>
                </div>
              ))}

              {results.bulkDiscountPercentage > 0 && (
                <div className="flex justify-between text-green-700 text-[11px] font-bold mt-1.5">
                  <span>🎁 Package Bulk Discount ({results.bulkDiscountPercentage}% Applied)</span>
                  <span>- {formatCurrency(results.bulkDiscountAmount, inputs.currency)}</span>
                </div>
              )}

              <div className="border-t border-[#1A1A1A] my-1.5 pt-1.5 flex justify-between font-bold">
                <span>DELIVERABLES SUB-TOTAL:</span>
                <span>{formatCurrency(results.deliverablesSubtotal, inputs.currency)}</span>
              </div>
            </div>
          </div>

          {/* Add-ons List */}
          {(inputs.exclusivityDays > 0 || inputs.usageRightsDays > 0 || inputs.rushDelivery || inputs.whitelisting) && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase opacity-60 tracking-wider">
                03. Commercial Add-ons
              </h3>
              
              <div className="space-y-1 text-xs opacity-95">
                {inputs.exclusivityDays > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>+ Competitor Exclusivity ({inputs.exclusivityDays} days)</span>
                    <span className="font-bold">{formatCurrency(results.exclusivityFee, inputs.currency)}</span>
                  </div>
                )}
                
                {inputs.usageRightsDays > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>
                      + Paid Ad Usage ({inputs.usageRightsDays} days @{" "}
                      {inputs.usageRightsDays === 30
                        ? `${inputs.usageRightsMonthlyPercent}%`
                        : inputs.usageRightsDays === 90
                        ? `${inputs.usageRightsMonthlyPercent * 2.5}%`
                        : `${inputs.usageRightsMonthlyPercent * 4.5}%`}
                      )
                    </span>
                    <span className="font-bold">{formatCurrency(results.usageRightsFee, inputs.currency)}</span>
                  </div>
                )}

                {inputs.rushDelivery && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>+ Rush Turnaround Surcharge (&lt;48h)</span>
                    <span className="font-bold">{formatCurrency(results.rushFee, inputs.currency)}</span>
                  </div>
                )}

                {inputs.whitelisting && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span>+ Handle Whitelisting/Dark Ads</span>
                    <span className="font-bold">{formatCurrency(results.whitelistingFee, inputs.currency)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Divider line */}
          <div className="border-t-2 border-[#1A1A1A] my-4" />

          {/* Summary Totals */}
          <div className="space-y-2 bg-[#FDFDFB] p-4 border border-[#1A1A1A] rounded-none">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="opacity-70">CREATIVE SERVICES VALUE:</span>
              <span>{formatCurrency(results.servicesSubtotal, inputs.currency)}</span>
            </div>

            {inputs.productValue > 0 && inputs.isProductKept && (
              <div className="flex justify-between items-center text-xs font-bold text-rose-700">
                <span className="opacity-80">− BARTER PRODUCT OFFSET (RETAINED):</span>
                <span>-{formatCurrency(results.barterOffset, inputs.currency)}</span>
              </div>
            )}

            {inputs.productValue > 0 && !inputs.isProductKept && (
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span className="opacity-75">🎁 BARTER PRODUCT OFFSET (RETURNED):</span>
                <span>{formatCurrency(0, inputs.currency)}</span>
              </div>
            )}

            <div className="border-t border-[#1A1A1A] my-1.5" />

            <div className="flex justify-between items-center text-xs font-bold">
              <span className="opacity-80">NET CASH TAXABLE SUB-TOTAL:</span>
              <span>{formatCurrency(results.subtotalCash, inputs.currency)}</span>
            </div>

            {inputs.isGstRegistered && (
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span className="opacity-70">GST (18% on Net Cash):</span>
                <span>+ {formatCurrency(results.gstAmount, inputs.currency)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2.5 border-t border-double border-[#1A1A1A]">
              <span className="font-extrabold text-xs uppercase text-[#1A1A1A]">TOTAL AMOUNT PAYABLE (CASH):</span>
              <span className="font-black text-sm text-[#1A1A1A]">
                {formatCurrency(results.finalInvoiceValue, inputs.currency)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[10px] font-medium pt-1 text-slate-500">
              <span className="opacity-60 uppercase">Total Economic Deal Value (Cash + Product Kept):</span>
              <span className="font-mono">{formatCurrency(results.totalDealValue, inputs.currency)}</span>
            </div>
          </div>

          {/* Large Hero Benchmark Total block matching Design HTML mockup */}
          <div className="mt-8 pt-6 border-t-4 border-[#1A1A1A] flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Brand Cash Invoice Total</p>
              <h4 className="text-4xl font-black tracking-tighter">
                {inputs.currency === "INR" ? "₹" : "$"}
                {Math.round(results.finalInvoiceValue).toLocaleString("en-IN")}
              </h4>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="w-16 h-16 border-2 border-[#1A1A1A] flex items-center justify-center p-1 bg-white">
                <div className="w-full h-full bg-repeating-conic" />
              </div>
              <p className="text-[8px] font-bold uppercase opacity-60">VERIFIED INVOICE</p>
            </div>
          </div>

        </div>

      </div>

      {/* Iframe Print Help Notice */}
      {showPrintIframeWarning && (
        <div className="no-print p-4 bg-blue-50 border-2 border-blue-900 text-blue-900 text-xs font-mono relative">
          <button 
            onClick={() => setShowPrintIframeWarning(false)}
            className="absolute top-2 right-2 text-blue-950 font-bold hover:opacity-75 cursor-pointer"
            aria-label="Close warning"
          >
            ✕
          </button>
          <div className="font-bold uppercase mb-1 flex items-center gap-1.5">
            <Info className="w-4 h-4 shrink-0" />
            Preview Print Warning
          </div>
          <p className="leading-relaxed text-[11px] opacity-90 uppercase">
            Browsers often block printing inside preview frames. To save or print your invoice perfectly as a PDF, please open this application in a new tab using the top-right arrow link on the preview panel, then print.
          </p>
        </div>
      )}

      {/* Action Buttons: Print/Share */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white hover:bg-slate-800 active:translate-y-0.5 py-2.5 px-4 font-bold uppercase text-xs rounded-none border border-[#1A1A1A] shadow-[2px_2px_0px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-white text-[#1A1A1A] hover:bg-slate-50 active:translate-y-0.5 py-2.5 px-4 font-bold uppercase text-xs rounded-none border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-700" />
              Copied Link!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Copy Shareable Link
            </>
          )}
        </button>
      </div>

      {/* 2. Section 194R Compliance Nudge Box */}
      <div 
        id="compliance-nudge-card"
        className={`p-5 rounded-none border-2 transition-all duration-300 ${
          results.tds194RTriggered
            ? "bg-[#EFEFDC] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]"
            : "bg-white border-[#1A1A1A] opacity-80"
        }`}
      >
        <div className="flex items-start gap-3 font-mono">
          <div className={`p-2 rounded-none mt-0.5 border ${results.tds194RTriggered ? "bg-amber-100 border-[#1A1A1A] text-amber-900 font-bold" : "bg-white border-slate-300 text-slate-600"}`}>
            <Scale className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1 text-xs">
            <div className="flex items-center gap-2">
              <h3 className="font-bold uppercase text-xs text-[#1A1A1A]">
                Section 194R Compliance Alert
              </h3>
              {results.tds194RTriggered ? (
                <span className="text-[9px] bg-red-100 border border-red-800 text-red-800 font-bold px-2 py-0.5 uppercase">
                  Triggered
                </span>
              ) : (
                <span className="text-[9px] bg-gray-100 border border-gray-400 text-gray-600 font-bold px-2 py-0.5 uppercase">
                  Inactive
                </span>
              )}
            </div>

            {results.tds194RTriggered ? (
              <div className="space-y-3">
                <p className="text-[11px] text-[#1A1A1A] leading-relaxed">
                  ⚠️ This transaction exceeds the **₹20,000** threshold for non-monetary benefits in a single year. Ensure TDS compliance for the provided **{formatCurrency(inputs.productValue, inputs.currency)}** barter value. A **10% TDS deduction ({formatCurrency(results.tds194RAmount, inputs.currency)})** is applicable.
                </p>
                
                <div className="bg-white border border-[#1A1A1A] p-3 space-y-2 text-[11px]">
                  <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-orange-700" />
                    How to Handle This in Negotiations:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li>
                      <strong className="text-[#1A1A1A]">Tax Gross-Up Clause:</strong> Request the brand to pay the TDS out-of-pocket, keeping the physical item tax-free for you.
                    </li>
                    <li>
                      <strong className="text-[#1A1A1A]">Cash Reduction:</strong> If deducted from your cash component, your payout will be lower by **{formatCurrency(results.tds194RAmount, inputs.currency)}**.
                    </li>
                    <li>
                      <strong className="text-[#1A1A1A]">PAN Form 16Q:</strong> Ensure the brand files the 10% TDS in your PAN so you can reconcile it at tax filing.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-600 leading-relaxed uppercase">
                Inactive. Kept barter gifts below ₹20,000 threshold or returning the products prevents Section 194R liabilities.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
