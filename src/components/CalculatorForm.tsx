/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  Activity,
  Briefcase,
  MapPin,
  Video,
  Clock,
  Shield,
  FileText,
  Gift,
  HelpCircle,
  Hash,
  Scale,
  Plus,
  Trash2,
  Info
} from "lucide-react";
import { CreatorInputs, NicheType, CityTier, FormatType, DeliverableItem } from "../types";

interface CalculatorFormProps {
  inputs: CreatorInputs;
  onChange: (inputs: CreatorInputs) => void;
}

export default function CalculatorForm({ inputs, onChange }: CalculatorFormProps) {
  const [newFormat, setNewFormat] = useState<FormatType>(FormatType.IG_REEL);
  const [newCount, setNewCount] = useState<number>(1);

  const updateField = <K extends keyof CreatorInputs>(field: K, value: CreatorInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  const updateFollowers = (val: number) => {
    const engaged = inputs.accountsEngaged || 0;
    const er = val > 0 ? parseFloat(((engaged / val) * 100).toFixed(2)) : 0;
    onChange({
      ...inputs,
      followers: val,
      engagementRate: er
    });
  };

  const updateReached = (val: number) => {
    onChange({
      ...inputs,
      accountsReached: val
    });
  };

  const updateEngaged = (val: number) => {
    const er = inputs.followers > 0 ? parseFloat(((val / inputs.followers) * 100).toFixed(2)) : 0;
    onChange({
      ...inputs,
      accountsEngaged: val,
      engagementRate: er
    });
  };

  // Deliverables managers
  const deliverables = inputs.deliverables || [];

  const addDeliverable = () => {
    const existingIndex = deliverables.findIndex(d => d.format === newFormat);
    let updated: DeliverableItem[];
    if (existingIndex > -1) {
      updated = deliverables.map((d, idx) => 
        idx === existingIndex ? { ...d, count: d.count + newCount } : d
      );
    } else {
      updated = [
        ...deliverables,
        { id: Date.now().toString(), format: newFormat, count: newCount }
      ];
    }
    onChange({
      ...inputs,
      deliverables: updated,
      // Keep fallbacks updated for other panels
      format: updated[0]?.format || inputs.format,
      deliverablesCount: updated.reduce((acc, curr) => acc + curr.count, 0)
    });
    setNewCount(1);
  };

  const removeDeliverable = (id: string) => {
    const filtered = deliverables.filter(d => d.id !== id);
    const finalDeliverables = filtered.length > 0 
      ? filtered 
      : [{ id: "fallback_" + Date.now(), format: FormatType.IG_REEL, count: 1 }];

    onChange({
      ...inputs,
      deliverables: finalDeliverables,
      format: finalDeliverables[0]?.format || FormatType.IG_REEL,
      deliverablesCount: finalDeliverables.reduce((acc, curr) => acc + curr.count, 0)
    });
  };

  const updateDeliverableCount = (id: string, count: number) => {
    const updated = deliverables.map(d => 
      d.id === id ? { ...d, count: Math.max(1, count) } : d
    );
    onChange({
      ...inputs,
      deliverables: updated,
      deliverablesCount: updated.reduce((acc, curr) => acc + curr.count, 0)
    });
  };

  const getTierBadge = (followers: number) => {
    if (followers < 10000) return { label: "NANO CREATOR", color: "bg-teal-100 text-teal-900 border-[#1A1A1A]" };
    if (followers < 100000) return { label: "MICRO CREATOR", color: "bg-blue-100 text-blue-900 border-[#1A1A1A]" };
    if (followers < 500000) return { label: "MID-TIER CREATOR", color: "bg-indigo-100 text-indigo-900 border-[#1A1A1A]" };
    return { label: "MACRO CREATOR", color: "bg-purple-100 text-purple-900 border-[#1A1A1A]" };
  };

  const tier = getTierBadge(inputs.followers);

  return (
    <div id="calculator-form" className="space-y-6 bg-[#F9F9F7] p-6 rounded-none border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
      
      {/* 0. Personalization */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 opacity-60">
          00. Profile &amp; Deal Partners
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-[#1A1A1A]">
              Creator Name / Social Handle
            </label>
            <input
              type="text"
              value={inputs.creatorName || ""}
              onChange={(e) => updateField("creatorName", e.target.value)}
              placeholder="@your_username"
              className="w-full px-2.5 py-1.5 border border-[#1A1A1A] rounded-none text-xs font-mono bg-white focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-[#1A1A1A]">
              Brand Partner / Client Name
            </label>
            <input
              type="text"
              value={inputs.brandName || ""}
              onChange={(e) => updateField("brandName", e.target.value)}
              placeholder="Acme Corporation"
              className="w-full px-2.5 py-1.5 border border-[#1A1A1A] rounded-none text-xs font-mono bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <hr className="border-[#1A1A1A]" />

      {/* 1. Followers and Audience Tier */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
            <Users className="w-4 h-4" />
            01. Follower Count
          </label>
          <span className={`text-[10px] px-2.5 py-0.5 border border-[#1A1A1A] font-mono font-bold uppercase rounded-none ${tier.color}`}>
            {tier.label}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={inputs.followers}
            onChange={(e) => updateFollowers(parseInt(e.target.value) || 1000)}
            className="flex-1 accent-[#1A1A1A] cursor-pointer h-2 bg-white border border-[#1A1A1A]"
          />
          <div className="relative w-36">
            <input
              type="number"
              min="1000"
              max="10000000"
              value={inputs.followers === 0 ? "" : inputs.followers}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                updateFollowers(isNaN(val) ? 0 : val);
              }}
              onBlur={() => {
                if (inputs.followers < 1000) {
                  updateFollowers(1000);
                }
              }}
              className="w-full text-right pr-3 pl-3 py-1.5 border border-[#1A1A1A] rounded-none text-sm font-mono bg-white focus:outline-none focus:bg-stone-50"
            />
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tight">
          Baseline calibrated for the Indian creator economy.
        </p>
      </div>

      <hr className="border-[#1A1A1A]" />

      {/* 2. Instagram Professional Dashboard / Account Insights Metrics */}
      <div className="space-y-3 bg-[#F3F4F6] p-4 border border-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
            <Activity className="w-4 h-4 text-pink-600" />
            02. Dashboard Insights (Last 30 Days)
          </h4>
          <span className="text-[9px] font-mono bg-pink-100 text-pink-900 px-2 py-0.5 border border-[#1A1A1A] font-bold">
            IG DASHBOARD METRICS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-[#1A1A1A]">
              Accounts Reached (last 30d)
            </label>
            <input
              type="number"
              min="0"
              value={inputs.accountsReached === 0 ? "" : inputs.accountsReached}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                updateReached(isNaN(val) ? 0 : val);
              }}
              className="w-full px-3 py-1.5 border border-[#1A1A1A] rounded-none text-xs font-mono bg-white focus:outline-none"
              placeholder="e.g. 50000"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-[#1A1A1A]">
              Accounts Engaged (last 30d)
            </label>
            <input
              type="number"
              min="0"
              value={inputs.accountsEngaged === 0 ? "" : inputs.accountsEngaged}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                updateEngaged(isNaN(val) ? 0 : val);
              }}
              className="w-full px-3 py-1.5 border border-[#1A1A1A] rounded-none text-xs font-mono bg-white focus:outline-none"
              placeholder="e.g. 1500"
            />
          </div>
        </div>

        <div className="flex items-start md:items-center justify-between gap-4 pt-2 border-t border-slate-200">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#1A1A1A] block">
              CALCULATED ENGAGEMENT RATE:
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">
              (Accounts Engaged / Total Followers) * 100
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-3 py-1 border border-[#1A1A1A] ${inputs.engagementRate > 2.5 ? 'bg-green-100 text-green-900 font-extrabold' : 'bg-white text-slate-700'}`}>
              {inputs.engagementRate.toFixed(2)}%
            </span>
            <span className="text-[9px] font-mono text-slate-600">
              {inputs.engagementRate > 2.5 ? '🔥 HIGH' : inputs.engagementRate === 2.5 ? '📊 AVERAGE' : '📉 LOWER'}
            </span>
          </div>
        </div>

        <p className="text-[9px] text-slate-500 leading-tight font-mono flex items-start gap-1">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>Copy reached and engaged directly from Instagram &gt; Professional Dashboard &gt; Account Insights. Standard baseline avg: 2.5%.</span>
        </p>
      </div>

      <hr className="border-[#1A1A1A]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 3. Niche Dropdown */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
            <Briefcase className="w-4 h-4 text-[#1A1A1A]" />
            03. Niche / Category
          </label>
          <select
            value={inputs.niche}
            onChange={(e) => updateField("niche", e.target.value as NicheType)}
            className="w-full px-3 py-2 border-2 border-[#1A1A1A] rounded-none text-xs bg-white font-mono focus:outline-none"
          >
            <option value={NicheType.FINANCE}>Finance & Investing (1.60x CPM)</option>
            <option value={NicheType.TECH_BUSINESS}>Tech & AI (1.45x CPM)</option>
            <option value={NicheType.HEALTH_WELLNESS}>Health & Fitness (1.30x CPM)</option>
            <option value={NicheType.TRAVEL_FOOD}>Travel & Food (1.25x CPM)</option>
            <option value={NicheType.FASHION_BEAUTY}>Fashion & Beauty (1.15x CPM)</option>
            <option value={NicheType.EDUCATION}>Education & EdTech (1.20x CPM)</option>
            <option value={NicheType.GAMING}>Gaming & Esports (0.90x CPM)</option>
            <option value={NicheType.ENTERTAINMENT}>Comedy & Entertainment (0.75x CPM)</option>
          </select>
        </div>

        {/* 4. City Tier Segmented Control */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
            <MapPin className="w-4 h-4 text-[#1A1A1A]" />
            04. Location Tier
          </label>
          <select
            value={inputs.cityTier}
            onChange={(e) => updateField("cityTier", e.target.value as CityTier)}
            className="w-full px-3 py-2 border-2 border-[#1A1A1A] rounded-none text-xs bg-white font-mono focus:outline-none"
          >
            <option value={CityTier.TIER_1}>Tier 1 (Metro Hubs - 1.20x)</option>
            <option value={CityTier.TIER_2}>Tier 2 (Growth Cities - 1.00x)</option>
            <option value={CityTier.TIER_3}>Tier 3 (Other Regions - 0.85x)</option>
          </select>
        </div>
      </div>

      <hr className="border-[#1A1A1A]" />

      {/* 5. Deliverables Package Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
            <Video className="w-4 h-4 text-[#1A1A1A]" />
            05. Deliverables Package Builder
          </label>
          <span className="text-[10px] font-mono font-bold text-slate-600 bg-amber-100 border border-[#1A1A1A] px-2 py-0.5">
            {deliverables.reduce((acc, curr) => acc + curr.count, 0) >= 5 
              ? "🎁 15% BULK DISCOUNT APPLIED" 
              : deliverables.reduce((acc, curr) => acc + curr.count, 0) >= 3 
              ? "🎁 10% BULK DISCOUNT APPLIED" 
              : "ADD 3+ FOR BULK DISCOUNT"}
          </span>
        </div>

        {/* Existing Deliverables List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {deliverables.length === 0 ? (
            <div className="text-center py-4 bg-white border border-dashed border-slate-300 text-xs text-slate-500 font-mono">
              No deliverables added. Build your bundle below!
            </div>
          ) : (
            deliverables.map((item) => {
              const formatLabels: Record<FormatType, string> = {
                [FormatType.IG_REEL]: "Instagram Reel",
                [FormatType.IG_STORY]: "Instagram Story",
                [FormatType.IG_CAROUSEL]: "Instagram Carousel/Post",
                [FormatType.YT_DEDICATED]: "YouTube Dedicated",
                [FormatType.YT_INTEGRATED]: "YouTube Integrated",
                [FormatType.YT_SHORTS]: "YouTube Shorts",
              };
              const formatMultipliers: Record<FormatType, string> = {
                [FormatType.IG_REEL]: "1.20x",
                [FormatType.IG_STORY]: "0.45x",
                [FormatType.IG_CAROUSEL]: "0.80x",
                [FormatType.YT_DEDICATED]: "2.50x",
                [FormatType.YT_INTEGRATED]: "1.50x",
                [FormatType.YT_SHORTS]: "0.90x",
              };

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 bg-white p-3 border border-[#1A1A1A] rounded-none shadow-[2px_2px_0px_#1A1A1A]"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#1A1A1A]">
                      {formatLabels[item.format] || item.format}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      Weight Multiplier: {formatMultipliers[item.format]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex border border-[#1A1A1A] p-0.5 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateDeliverableCount(item.id, item.count - 1)}
                        className="px-2.5 py-0.5 text-xs font-bold hover:bg-slate-200 transition"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 text-xs font-mono font-bold text-center w-8">
                        {item.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateDeliverableCount(item.id, item.count + 1)}
                        className="px-2.5 py-0.5 text-xs font-bold hover:bg-slate-200 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDeliverable(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                      title="Remove Deliverable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add New Deliverable Controls */}
        <div className="bg-[#EFEFDC] p-3 border-2 border-[#1A1A1A] space-y-3">
          <span className="text-[9px] font-mono font-bold uppercase block text-[#1A1A1A]">
            ➕ Add Deliverables to Package
          </span>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-7">
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value as FormatType)}
                className="w-full px-2 py-1.5 border border-[#1A1A1A] rounded-none text-xs bg-white font-mono focus:outline-none"
              >
                <option value={FormatType.IG_REEL}>Instagram Reel (1.20x weight)</option>
                <option value={FormatType.IG_STORY}>Instagram Story (0.45x weight)</option>
                <option value={FormatType.IG_CAROUSEL}>Instagram Carousel (0.80x weight)</option>
                <option value={FormatType.YT_DEDICATED}>YouTube Dedicated (2.50x weight)</option>
                <option value={FormatType.YT_INTEGRATED}>YouTube Integrated (1.50x weight)</option>
                <option value={FormatType.YT_SHORTS}>YouTube Shorts (0.90x weight)</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <input
                type="number"
                min="1"
                max="20"
                value={newCount === 0 ? "" : newCount}
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                  setNewCount(isNaN(val) ? 0 : val);
                }}
                onBlur={() => {
                  if (newCount < 1) setNewCount(1);
                  if (newCount > 20) setNewCount(20);
                }}
                className="w-full px-2 py-1.5 border border-[#1A1A1A] rounded-none text-xs text-center font-mono focus:outline-none bg-white"
                placeholder="Qty"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="button"
                onClick={addDeliverable}
                className="w-full bg-[#1A1A1A] text-white py-1.5 px-3 font-bold text-xs uppercase hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#1A1A1A]" />

      {/* 6. Commercial Add-ons */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 opacity-60">
          03. LICENSING &amp; ADD-ONS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Exclusivity Duration */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-[#1A1A1A]">
              Competitor Exclusivity
            </label>
            <select
              value={inputs.exclusivityDays}
              onChange={(e) => updateField("exclusivityDays", parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 border border-[#1A1A1A] rounded-none text-xs bg-white font-mono focus:outline-none"
            >
              <option value="0">No Exclusivity (Standard)</option>
              <option value="30">30 Days Exclusivity (+25%)</option>
              <option value="60">60 Days Exclusivity (+45%)</option>
              <option value="90">90 Days Exclusivity (+65%)</option>
            </select>
          </div>

          {/* Paid Usage Rights */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-[#1A1A1A]">
              Paid Ad Usage Rights
            </label>
            <select
              value={inputs.usageRightsDays}
              onChange={(e) => updateField("usageRightsDays", parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 border border-[#1A1A1A] rounded-none text-xs bg-white font-mono focus:outline-none"
            >
              <option value="0">Organic Sharing Only (Standard)</option>
              <option value="30">30 Days Ad Rights (+{inputs.usageRightsMonthlyPercent}%)</option>
              <option value="90">90 Days Ad Rights (+{inputs.usageRightsMonthlyPercent * 2.5}%)</option>
              <option value="180">180 Days Ad Rights (+{inputs.usageRightsMonthlyPercent * 4.5}%)</option>
            </select>
          </div>

          {/* Custom monthly ad rights rate */}
          <div className="md:col-span-2 bg-[#F9F9F7] p-3 border border-[#1A1A1A] space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#1A1A1A]">
                  Custom Monthly Ad Rights Rate (%)
                </label>
                <p className="text-[9px] text-slate-500 font-mono uppercase mt-0.5 leading-tight">
                  Standard is 30% per month. Some creators charge up to 50% (like your friends!). Customize your monthly fee rate below:
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={inputs.usageRightsMonthlyPercent === 0 ? "" : inputs.usageRightsMonthlyPercent}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                    updateField("usageRightsMonthlyPercent", isNaN(val) ? 0 : val);
                  }}
                  onBlur={() => {
                    if (inputs.usageRightsMonthlyPercent < 5) {
                      updateField("usageRightsMonthlyPercent", 15); // floor of 15% if cleared or too low
                    }
                  }}
                  className="w-16 text-center px-2 py-1 border border-[#1A1A1A] rounded-none text-xs font-bold font-mono bg-white focus:outline-none"
                />
                <span className="text-[10px] font-bold uppercase font-mono">% / Mo.</span>
              </div>
            </div>
          </div>

          {/* Rush Delivery and Whitelisting Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 md:col-span-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#1A1A1A] cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.rushDelivery}
                onChange={(e) => updateField("rushDelivery", e.target.checked)}
                className="rounded-none border-2 border-[#1A1A1A] text-black focus:ring-0 w-4 h-4 accent-[#1A1A1A]"
              />
              <Clock className="w-3.5 h-3.5" />
              Rush Delivery &lt;48h (+15%)
            </label>

            <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#1A1A1A] cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.whitelisting}
                onChange={(e) => updateField("whitelisting", e.target.checked)}
                className="rounded-none border-2 border-[#1A1A1A] text-black focus:ring-0 w-4 h-4 accent-[#1A1A1A]"
              />
              <FileText className="w-3.5 h-3.5" />
              Whitelisting/Dark Ads (+25%)
            </label>
          </div>

        </div>
      </div>

      <hr className="border-[#1A1A1A]" />

      {/* 7. Barter / Product Compensation */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 opacity-60">
          04. BARTER &amp; PRODUCT GIFTS
        </h3>
        
        <div className="bg-[#EFEFDC] border border-[#1A1A1A] p-4 space-y-4 rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#1A1A1A] mb-1">
                Barter Product Value (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-mono text-[#1A1A1A] font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.productValue === 0 ? "" : inputs.productValue}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                    updateField("productValue", isNaN(val) ? 0 : val);
                  }}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-1.5 border border-[#1A1A1A] rounded-none text-xs font-mono bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#1A1A1A] mb-1">
                Will you retain this product?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateField("isProductKept", true)}
                  className={`py-1.5 text-xs font-bold uppercase rounded-none border-2 transition ${
                    inputs.isProductKept
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-slate-700 border-[#1A1A1A] hover:bg-slate-50"
                  }`}
                >
                  Keep Product
                </button>
                <button
                  type="button"
                  onClick={() => updateField("isProductKept", false)}
                  className={`py-1.5 text-xs font-bold uppercase rounded-none border-2 transition ${
                    !inputs.isProductKept
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-slate-700 border-[#1A1A1A] hover:bg-slate-50"
                  }`}
                >
                  Return Product
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-700 font-mono leading-relaxed">
            💡 **COMPLIANCE ALERT:** Keeping gifted assets worth &gt;= **₹20,000** triggers **Section 194R** tax compliance requiring a **10% TDS deduction** from the economic package.
          </p>
        </div>
      </div>

      <hr className="border-[#1A1A1A]" />

      {/* 8. Tax and Output Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 border-2 border-[#1A1A1A] rounded-none bg-white">
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase text-[#1A1A1A]">GST Registered?</p>
            <p className="text-[9px] font-mono text-slate-500 uppercase">Adds 18% GST to cash subtotal</p>
          </div>
          <button
            type="button"
            onClick={() => updateField("isGstRegistered", !inputs.isGstRegistered)}
            className={`w-12 h-6 border-2 border-[#1A1A1A] rounded-none p-0.5 transition-colors duration-200 focus:outline-none ${
              inputs.isGstRegistered ? "bg-[#1A1A1A]" : "bg-white"
            }`}
          >
            <div
              className={`w-4 h-4 border border-[#1A1A1A] transform transition-transform duration-200 ${
                inputs.isGstRegistered ? "translate-x-5 bg-white" : "translate-x-0 bg-[#1A1A1A]"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 border-2 border-[#1A1A1A] rounded-none bg-white">
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase text-[#1A1A1A]">Display Currency</p>
            <p className="text-[9px] font-mono text-slate-500 uppercase">Default ISO Standard Code</p>
          </div>
          <div className="flex border border-[#1A1A1A] p-0.5 bg-white">
            <button
              type="button"
              onClick={() => updateField("currency", "INR")}
              className={`px-3 py-1 text-[10px] font-mono font-bold transition-all ${
                inputs.currency === "INR" ? "bg-[#1A1A1A] text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              INR
            </button>
            <button
              type="button"
              onClick={() => updateField("currency", "USD")}
              className={`px-3 py-1 text-[10px] font-mono font-bold transition-all ${
                inputs.currency === "USD" ? "bg-[#1A1A1A] text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              USD
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
