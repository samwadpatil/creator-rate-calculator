/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum NicheType {
  FINANCE = "finance",
  TECH_BUSINESS = "tech_business",
  HEALTH_WELLNESS = "health_wellness",
  FASHION_BEAUTY = "fashion_beauty",
  TRAVEL_FOOD = "travel_food",
  GAMING = "gaming",
  ENTERTAINMENT = "entertainment",
  EDUCATION = "education"
}

export enum CityTier {
  TIER_1 = "tier_1", // Mumbai, Delhi NCR, Bengaluru
  TIER_2 = "tier_2", // Pune, Hyderabad, Chennai, Kolkata, Ahmedabad
  TIER_3 = "tier_3"  // Rest of India
}

export enum FormatType {
  IG_REEL = "ig_reel",
  IG_STORY = "ig_story",
  IG_CAROUSEL = "ig_carousel",
  YT_DEDICATED = "yt_dedicated",
  YT_INTEGRATED = "yt_integrated",
  YT_SHORTS = "yt_shorts"
}

export interface DeliverableItem {
  id: string;
  format: FormatType;
  count: number;
}

export interface DeliverableResultItem {
  id: string;
  format: FormatType;
  count: number;
  formatMultiplier: number;
  unitRate: number;
  subtotal: number;
}

export interface CreatorInputs {
  followers: number;
  accountsReached: number; // From IG Professional Dashboard
  accountsEngaged: number; // From IG Professional Dashboard
  engagementRate: number; // calculated/derived e.g. 3.5 for 3.5%
  niche: NicheType;
  cityTier: CityTier;
  format: FormatType; // main format (fallback)
  
  // Deliverables count (fallback)
  deliverablesCount: number;

  // Multi-Deliverables package
  deliverables: DeliverableItem[];

  // Add-ons
  exclusivityDays: number; // 0, 30, 60, 90
  usageRightsDays: number; // 0, 30, 90, 180
  usageRightsMonthlyPercent: number; // Monthly percentage rate for ad rights (defaults to 30)
  rushDelivery: boolean;
  whitelisting: boolean;

  // Goods or products included (in kind benefit)
  productValue: number; // INR
  isProductKept: boolean;

  // Tax and GST registration
  isGstRegistered: boolean;
  currency: "INR" | "USD";

  // Personalization
  creatorName?: string;
  brandName?: string;
}

export interface CalculationResult {
  baseRate: number;
  nicheMultiplier: number;
  engagementMultiplier: number;
  cityMultiplier: number;
  formatMultiplier: number; // fallback main format multiplier
  
  // Base rate adjusted by multipliers
  adjustedBaseRate: number; // fallback main format adjusted rate
  
  // Deliverables list calculations
  deliverableResults: DeliverableResultItem[];
  totalDeliverablesCount: number;
  bulkDiscountPercentage: number;
  bulkDiscountAmount: number;

  // Deliverables subtotal
  deliverablesSubtotal: number;

  // Add-on values
  exclusivityFee: number;
  usageRightsFee: number;
  rushFee: number;
  whitelistingFee: number;

  subtotalCash: number; // cash payout before tax
  productValueKind: number; // product value kept (perquisite)
  
  // Custom offsets and services totals
  servicesSubtotal: number; // Sum of deliverables and add-ons before product deduction
  barterOffset: number; // Product value deduction if kept

  // Total economic value of the deal
  totalDealValue: number; 

  // Tax calculations
  gstAmount: number;
  tds194RTriggered: boolean;
  tds194RAmount: number; // 10% on benefits in kind if >= 20000
  finalCashPayout: number; // Cash creator receives after any deductions (if brand handles it or creator receives cash)
  finalInvoiceValue: number; // Cash Subtotal + GST
}
