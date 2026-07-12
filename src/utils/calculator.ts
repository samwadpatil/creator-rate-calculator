/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CreatorInputs, CalculationResult, NicheType, CityTier, FormatType } from "../types";

// Constant conversion rate for display purposes if toggled to USD
export const USD_INR_RATE = 83.5;

export function formatCurrency(value: number, currency: "INR" | "USD"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } else {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }
}

export function calculateCreatorRate(inputs: CreatorInputs): CalculationResult {
  const {
    followers,
    accountsReached,
    accountsEngaged,
    engagementRate,
    niche,
    cityTier,
    format,
    deliverablesCount,
    deliverables,
    exclusivityDays,
    usageRightsDays,
    rushDelivery,
    whitelisting,
    productValue,
    isProductKept,
    isGstRegistered,
    currency
  } = inputs;

  // 1. Calculate Base Rate based on follower count (Standardized curve based on real-world Indian influencer economy benchmarks)
  let rawBase = 0;
  if (followers <= 10000) {
    // Nano: e.g. 5,000 followers -> ₹1,250 - ₹2,500 base
    rawBase = followers * 0.25;
    if (rawBase < 1000) rawBase = 1000; // Realistic minimum floor for post production effort
  } else if (followers <= 100000) {
    // Micro: 10k to 100k. e.g. 50k followers -> ₹9,700 base
    rawBase = 2500 + (followers - 10000) * 0.18;
  } else if (followers <= 500000) {
    // Mid-tier: 100k to 500k. e.g. 200k followers -> ₹30,700 base
    rawBase = 18700 + (followers - 100000) * 0.12;
  } else if (followers <= 1000000) {
    // Macro: 500k to 1M. e.g. 800k followers -> ₹90,700 base
    rawBase = 66700 + (followers - 500000) * 0.08;
  } else {
    // Mega: 1M+ followers. e.g. 2M followers -> ₹156,700 base
    rawBase = 106700 + (followers - 1000000) * 0.05;
  }

  // 2. Niche Multiplier
  let nicheMultiplier = 1.0;
  switch (niche) {
    case NicheType.FINANCE:
      nicheMultiplier = 1.60;
      break;
    case NicheType.TECH_BUSINESS:
      nicheMultiplier = 1.45;
      break;
    case NicheType.HEALTH_WELLNESS:
      nicheMultiplier = 1.30;
      break;
    case NicheType.TRAVEL_FOOD:
      nicheMultiplier = 1.25;
      break;
    case NicheType.FASHION_BEAUTY:
      nicheMultiplier = 1.15;
      break;
    case NicheType.EDUCATION:
      nicheMultiplier = 1.20;
      break;
    case NicheType.GAMING:
      nicheMultiplier = 0.90;
      break;
    case NicheType.ENTERTAINMENT:
      nicheMultiplier = 0.75;
      break;
  }

  // 3. Engagement Multiplier
  // Standard average ER on Instagram/YouTube Shorts is ~2.5%
  // Automatically calculate ER if accountsEngaged is provided and followers > 0
  let calculatedER = engagementRate;
  if (followers > 0 && accountsEngaged > 0) {
    calculatedER = (accountsEngaged / followers) * 100;
  }

  const avgER = 2.5;
  let engagementMultiplier = 1.0;
  if (calculatedER > avgER) {
    // Scale up to 2.0x max for high engagement
    engagementMultiplier = 1.0 + (calculatedER - avgER) * 0.15;
    if (engagementMultiplier > 2.0) engagementMultiplier = 2.0;
  } else if (calculatedER < avgER) {
    // Scale down to 0.6x min for low engagement
    engagementMultiplier = 1.0 - (avgER - calculatedER) * 0.15;
    if (engagementMultiplier < 0.6) engagementMultiplier = 0.6;
  }

  // 4. City Tier Adjustment
  let cityMultiplier = 1.0;
  switch (cityTier) {
    case CityTier.TIER_1:
      cityMultiplier = 1.20; // Mumbai, Delhi, BLR
      break;
    case CityTier.TIER_2:
      cityMultiplier = 1.00; // Pune, Hyderabad, etc.
      break;
    case CityTier.TIER_3:
      cityMultiplier = 0.85; // Other cities
      break;
  }

  // Helper to get multiplier for any format type
  const getFormatMultiplier = (fmt: FormatType): number => {
    switch (fmt) {
      case FormatType.YT_DEDICATED: return 2.50;
      case FormatType.YT_INTEGRATED: return 1.50;
      case FormatType.IG_REEL: return 1.20;
      case FormatType.YT_SHORTS: return 0.90;
      case FormatType.IG_CAROUSEL: return 0.80;
      case FormatType.IG_STORY: return 0.45;
      default: return 1.00;
    }
  };

  // Compile deliverables list
  const activeDeliverables = deliverables && deliverables.length > 0
    ? deliverables
    : [{ id: "fallback", format: format, count: deliverablesCount }];

  // Calculate deliverable results
  const baseRateVal = Math.round(rawBase);
  let totalRawDeliverablesSubtotal = 0;
  let totalDeliverablesCount = 0;

  const deliverableResults = activeDeliverables.map(item => {
    const fmtMultiplier = getFormatMultiplier(item.format);
    const unitRate = Math.round(
      baseRateVal * nicheMultiplier * engagementMultiplier * cityMultiplier * fmtMultiplier
    );
    const subtotal = unitRate * item.count;
    totalRawDeliverablesSubtotal += subtotal;
    totalDeliverablesCount += item.count;

    return {
      id: item.id,
      format: item.format,
      count: item.count,
      formatMultiplier: fmtMultiplier,
      unitRate,
      subtotal
    };
  });

  // Calculate Bulk Discount
  let bulkDiscountPercentage = 0;
  if (totalDeliverablesCount >= 5) {
    bulkDiscountPercentage = 15;
  } else if (totalDeliverablesCount >= 3) {
    bulkDiscountPercentage = 10;
  }
  
  const bulkDiscountAmount = Math.round(totalRawDeliverablesSubtotal * (bulkDiscountPercentage / 100));
  const deliverablesSubtotal = totalRawDeliverablesSubtotal - bulkDiscountAmount;

  // Fallbacks for backward compatibility
  const formatMultiplier = getFormatMultiplier(format);
  const adjustedBaseRate = Math.round(
    baseRateVal * nicheMultiplier * engagementMultiplier * cityMultiplier * formatMultiplier
  );

  // 6. Optional Add-ons (Calculated as percentages of the deliverables subtotal based on agency standards)
  let exclusivityFee = 0;
  if (exclusivityDays === 30) exclusivityFee = Math.round(deliverablesSubtotal * 0.15);
  else if (exclusivityDays === 60) exclusivityFee = Math.round(deliverablesSubtotal * 0.25);
  else if (exclusivityDays >= 90) exclusivityFee = Math.round(deliverablesSubtotal * 0.40);

  const monthlyRate = inputs.usageRightsMonthlyPercent ?? 30;
  let usageRightsFee = 0;
  if (usageRightsDays === 30) {
    usageRightsFee = Math.round(deliverablesSubtotal * (monthlyRate / 100));
  } else if (usageRightsDays === 90) {
    // 3 months (90 days) with built-in bundle discount (e.g. 2.5x monthly rate instead of 3x)
    usageRightsFee = Math.round(deliverablesSubtotal * ((monthlyRate * 2.5) / 100));
  } else if (usageRightsDays >= 180) {
    // 6 months (180 days) with bulk bundle discount (e.g. 4.5x monthly rate instead of 6x)
    usageRightsFee = Math.round(deliverablesSubtotal * ((monthlyRate * 4.5) / 100));
  }

  const rushFee = rushDelivery ? Math.round(deliverablesSubtotal * 0.10) : 0;
  const whitelistingFee = whitelisting ? Math.round(deliverablesSubtotal * 0.15) : 0;

  // Creative Services Subtotal (Deliverables + Add-ons)
  const servicesSubtotal = deliverablesSubtotal + exclusivityFee + usageRightsFee + rushFee + whitelistingFee;

  // Product benefit value in kind (if kept)
  const productValueKind = isProductKept ? productValue : 0;

  // Barter Offset: Deduct product value from the cash amount if the creator keeps the product
  const barterOffset = isProductKept ? productValue : 0;

  // Cash payout subtotal before taxes (with product value deducted as payment-in-kind)
  const subtotalCash = Math.max(0, servicesSubtotal - barterOffset);

  // Total economic value of the deal (Cash + Product)
  const totalDealValue = subtotalCash + productValueKind;

  // GST Calculation (18% in India for intellectual services / brand sponsorships)
  const gstAmount = isGstRegistered ? Math.round(subtotalCash * 0.18) : 0;
  const finalInvoiceValue = subtotalCash + gstAmount;

  // Section 194R Compliance Trigger
  // Triggered if benefits in kind (products kept) exceed ₹20,000 in value
  const tds194RTriggered = isProductKept && productValue >= 20000;
  const tds194RAmount = tds194RTriggered ? Math.round(productValue * 0.10) : 0;

  const finalCashPayout = subtotalCash; 

  // If in USD, convert values
  if (currency === "USD") {
    return {
      baseRate: Math.round(baseRateVal / USD_INR_RATE),
      nicheMultiplier,
      engagementMultiplier,
      cityMultiplier,
      formatMultiplier,
      adjustedBaseRate: Math.round(adjustedBaseRate / USD_INR_RATE),
      deliverableResults: deliverableResults.map(r => ({
        ...r,
        unitRate: Math.round(r.unitRate / USD_INR_RATE),
        subtotal: Math.round(r.subtotal / USD_INR_RATE)
      })),
      totalDeliverablesCount,
      bulkDiscountPercentage,
      bulkDiscountAmount: Math.round(bulkDiscountAmount / USD_INR_RATE),
      deliverablesSubtotal: Math.round(deliverablesSubtotal / USD_INR_RATE),
      exclusivityFee: Math.round(exclusivityFee / USD_INR_RATE),
      usageRightsFee: Math.round(usageRightsFee / USD_INR_RATE),
      rushFee: Math.round(rushFee / USD_INR_RATE),
      whitelistingFee: Math.round(whitelistingFee / USD_INR_RATE),
      servicesSubtotal: Math.round(servicesSubtotal / USD_INR_RATE),
      barterOffset: Math.round(barterOffset / USD_INR_RATE),
      subtotalCash: Math.round(subtotalCash / USD_INR_RATE),
      productValueKind: Math.round(productValueKind / USD_INR_RATE),
      totalDealValue: Math.round(totalDealValue / USD_INR_RATE),
      gstAmount: Math.round(gstAmount / USD_INR_RATE),
      tds194RTriggered,
      tds194RAmount: Math.round(tds194RAmount / USD_INR_RATE),
      finalCashPayout: Math.round(finalCashPayout / USD_INR_RATE),
      finalInvoiceValue: Math.round(finalInvoiceValue / USD_INR_RATE)
    };
  }

  return {
    baseRate: baseRateVal,
    nicheMultiplier,
    engagementMultiplier,
    cityMultiplier,
    formatMultiplier,
    adjustedBaseRate,
    deliverableResults,
    totalDeliverablesCount,
    bulkDiscountPercentage,
    bulkDiscountAmount,
    deliverablesSubtotal,
    exclusivityFee,
    usageRightsFee,
    rushFee,
    whitelistingFee,
    servicesSubtotal,
    barterOffset,
    subtotalCash,
    productValueKind,
    totalDealValue,
    gstAmount,
    tds194RTriggered,
    tds194RAmount,
    finalCashPayout,
    finalInvoiceValue
  };
}
