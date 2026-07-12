/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Brain,
  Scale,
  RefreshCw,
  Mail,
  AlertCircle
} from "lucide-react";
import { CreatorInputs, CalculationResult } from "../types";

interface AiNegotiatorProps {
  inputs: CreatorInputs;
  results: CalculationResult;
}

interface AiStrategyResponse {
  negotiationStrategy: string;
  taxTdsNudge: string;
  brandEmailPitch: string;
  counterOfferTips: string;
}

export default function AiNegotiator({ inputs, results }: AiNegotiatorProps) {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<AiStrategyResponse | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTds, setCopiedTds] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlaybook = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs, results }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI server. Please verify connections.");
      }

      const data = await response.json();
      setStrategy(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while communicating with Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, type: "email" | "tds") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedTds(true);
      setTimeout(() => setCopiedTds(false), 2000);
    }
  };

  const renderText = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed === "") {
        return <div key={idx} className="h-2" />;
      }
      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Strip out bullet symbol
        const content = trimmed.replace(/^[•\-*]\s*/, "");
        return (
          <div key={idx} className="flex items-start gap-2 pl-2 my-1">
            <span className="text-amber-500 font-bold shrink-0">•</span>
            <span className="text-slate-700">{content}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-slate-700 leading-relaxed my-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div id="ai-negotiator-panel" className="bg-[#F9F9F7] p-6 rounded-none border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-6 text-[#1A1A1A] font-mono">
      
      {/* Panel Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#1A1A1A]" />
            AI Negotiation Assistant
          </h2>
          <p className="text-[10px] text-slate-500 uppercase mt-1">
            Generates strategic speaking points, customized brand pitch emails, and compliant contract term responses.
          </p>
        </div>
        <span className="flex items-center gap-1 text-[9px] bg-[#1A1A1A] text-white font-bold px-2.5 py-1 rounded-none uppercase">
          <Sparkles className="w-3 h-3" /> Gemini AI
        </span>
      </div>

      {!strategy && !loading && (
        <div className="text-center py-8 px-4 border border-[#1A1A1A] bg-white space-y-4 rounded-none">
          <div className="p-3 bg-[#1A1A1A] text-white rounded-none w-12 h-12 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Generate Your Negotiation Playbook</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase">
              Analyzes {inputs.followers.toLocaleString()} Followers, {inputs.engagementRate}% Engagement, and your niche to deliver pristine contract talking points.
            </p>
          </div>
          <button
            type="button"
            onClick={generatePlaybook}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#1A1A1A] border-2 border-[#1A1A1A] rounded-none hover:bg-gray-800 transition cursor-pointer"
          >
            Generate Pitch &amp; Strategy
          </button>
        </div>
      )}

      {loading && (
        <div className="py-12 space-y-4 text-center bg-white border border-[#1A1A1A]">
          <div className="inline-block relative">
            <div className="w-12 h-12 border-4 border-[#1A1A1A] border-t-transparent animate-spin rounded-none" />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Drafting Customized Talent Strategy...</p>
            <p className="text-[10px] text-slate-400 max-w-xs mx-auto uppercase">
              Preparing Section 194R responses and pricing line-items.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-none bg-red-100 border border-red-800 flex gap-3 text-red-900">
          <AlertCircle className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase">API Communication Failure</h4>
            <p className="text-[11px] font-mono">{error}</p>
            <button
              type="button"
              onClick={generatePlaybook}
              className="text-xs font-bold uppercase underline mt-1 block hover:text-red-950"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {strategy && !loading && (
        <div className="space-y-6">
          
          {/* A. Your Leverage Points */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-60">
              <TrendingUpIcon className="w-3.5 h-3.5" />
              01. Negotiation Leverage Points
            </h3>
            <div className="bg-white p-4 border border-[#1A1A1A] text-xs leading-relaxed space-y-1 rounded-none">
              {renderText(strategy.negotiationStrategy)}
            </div>
          </div>

          {/* B. Brand Email Pitch */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-60">
                <Mail className="w-3.5 h-3.5" />
                02. Brand Outreach Pitch Template
              </h3>
              <button
                type="button"
                onClick={() => copyText(strategy.brandEmailPitch, "email")}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1A1A] hover:underline"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-800" />
                    Copied Pitch!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Pitch
                  </>
                )}
              </button>
            </div>
            
            <div className="relative">
              <pre className="bg-[#1A1A1A] text-white p-4 rounded-none text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-80 leading-relaxed border border-[#1A1A1A]">
                {strategy.brandEmailPitch}
              </pre>
            </div>
          </div>

          {/* C. Tax defense scripts */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-60">
              <Scale className="w-3.5 h-3.5" />
              03. GST &amp; 194R Response Scripts
            </h3>
            <div className="bg-[#EFEFDC] p-4 border border-[#1A1A1A] text-xs leading-relaxed space-y-1 rounded-none">
              {renderText(strategy.taxTdsNudge)}
            </div>
          </div>

          {/* D. Counter offer playbook */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-60">
              <RefreshCw className="w-3.5 h-3.5" />
              04. Counter-Offer Playbook
            </h3>
            <div className="bg-white p-4 border border-[#1A1A1A] text-xs leading-relaxed space-y-1 rounded-none">
              {renderText(strategy.counterOfferTips)}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-2 border-t border-[#1A1A1A]">
            <button
              type="button"
              onClick={generatePlaybook}
              className="px-4 py-2 text-xs font-bold uppercase bg-white border-2 border-[#1A1A1A] hover:bg-stone-50 transition flex items-center gap-1.5 rounded-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate Strategies
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

// Inline custom mini trend icon
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
