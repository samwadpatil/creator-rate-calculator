/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());


// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Route for generating negotiations pitches and tax guidance
app.post("/api/negotiate", async (req, res) => {
  const { inputs, results } = req.body;

  if (!inputs || !results) {
    return res.status(400).json({ error: "Missing required inputs or results for calculation." });
  }

  const formatLabels: Record<string, string> = {
    ig_reel: "Instagram Reel",
    ig_story: "Instagram Story",
    ig_carousel: "Instagram Carousel/Post",
    yt_dedicated: "YouTube Dedicated Video",
    yt_integrated: "YouTube Integrated Video",
    yt_shorts: "YouTube Shorts"
  };

  const nicheLabels: Record<string, string> = {
    finance: "Finance / Business",
    tech_business: "Tech & Professional Business",
    health_wellness: "Health & Wellness",
    fashion_beauty: "Fashion & Beauty",
    travel_food: "Travel & Culinary Arts",
    gaming: "Gaming & Esports",
    entertainment: "Comedy & Entertainment",
    education: "EdTech & Education"
  };

  const cityLabels: Record<string, string> = {
    tier_1: "Tier 1 (Metro - Mumbai, Delhi NCR, Bangalore)",
    tier_2: "Tier 2 (Pune, Hyderabad, Chennai, Kolkata)",
    tier_3: "Tier 3 (Other regions)"
  };

  const nicheLabel = nicheLabels[inputs.niche] || inputs.niche;
  const cityLabel = cityLabels[inputs.cityTier] || inputs.cityTier;

  const deliverablesText = inputs.deliverables && inputs.deliverables.length > 0
    ? inputs.deliverables.map((item: any) => `${item.count}x ${formatLabels[item.format] || item.format}`).join(" + ")
    : `${inputs.deliverablesCount}x ${formatLabels[inputs.format] || inputs.format}`;

  // Let's craft an extremely professional and comprehensive prompt for Gemini
  const prompt = `
You are an expert talent manager, brand deal negotiator, and chartered accountant specializing in the Creator Economy in India.
Review the following brand deal details for a creator:

CREATOR DATA:
- Followers: ${inputs.followers.toLocaleString()}
- Accounts Reached (last 30 days): ${inputs.accountsReached?.toLocaleString() || "N/A"}
- Accounts Engaged (last 30 days): ${inputs.accountsEngaged?.toLocaleString() || "N/A"}
- Engagement Rate: ${inputs.engagementRate}% (Average for platform is 2.5%)
- Content Niche: ${nicheLabel}
- Creator Location: ${cityLabel}
- Deliverables Package: ${deliverablesText}

CALCULATED BENCHMARK VALUES (in ${inputs.currency}):
- Base rate per post: ${results.baseRate}
- Package Bulk Discount Applied: ${results.bulkDiscountPercentage}% (Savings of ${results.bulkDiscountAmount})
- Deliverables Subtotal (after discount): ${results.deliverablesSubtotal}
- Exclusivity Fee (${inputs.exclusivityDays} days): ${results.exclusivityFee}
- Usage Rights Fee (${inputs.usageRightsDays} days): ${results.usageRightsFee}
- Rush Delivery Surcharge: ${results.rushFee}
- Whitelisting Surcharge: ${results.whitelistingFee}
- Total Cash Cash Subtotal: ${results.subtotalCash}
- GST (18% - ${inputs.isGstRegistered ? "Registered" : "Not Registered"}): ${results.gstAmount}
- Products Kept (Value in Kind): ${results.productValueKind} (Is kept? ${inputs.isProductKept ? "Yes" : "No"})
- Total Deal Economic Value: ${results.totalDealValue}

SECTION 194R TAX STATUS:
- Section 194R Triggered: ${results.tds194RTriggered ? "YES (Product kept value >= ₹20,000)" : "NO"}
- 10% TDS under 194R amount: ${results.tds194RAmount}

TASK:
Generate a friendly, structured document of negotiation strategies and correspondence templates. 
CRITICAL RULE: Write in extremely simple, friendly, easy-to-understand words that any everyday content creator would understand immediately. Do NOT use complicated financial jargon, dense legalistic words, or advanced agency abbreviations. Talk like an experienced, warm, encouraging creator friend or manager.

Respond ONLY with a JSON object following this TS interface:
{
  "negotiationStrategy": "Plain text string describing 2-3 custom negotiation leverage points in simple, clear language. Use clean paragraphs and friendly bullet points starting with '• ' if helpful. Avoid markdown headers like '#' or bolding '**'. For example, explain why their active reach/engagement is great for the brand, and how to pitch this advantage directly.",
  "taxTdsNudge": "Plain text string explaining in simple, direct, completely jargon-free terms how they should handle tax (like TDS and GST) with the brand. Explain it clearly so they don't lose money on gifted items. Use friendly paragraphs.",
  "brandEmailPitch": "A complete, friendly, politely confident email draft they can copy/paste. Present the pricing clearly and simply. Keep the table neat but easy to read.",
  "counterOfferTips": "Plain text string with 2-3 simple, friendly, actionable bullet points starting with '• ' on how to react if the brand says the price is too high. Give them direct examples of what to say or change (like lowering the number of posts or shortening the exclusivity time)."
}

Do not include any markdown fences or wrapping other than a clean JSON block. Ensure the response can be directly parsed via JSON.parse.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini API error during negotiation strategy generation:", error);
    res.status(500).json({
      error: "Failed to generate negotiation strategy. Please try again.",
      details: error.message
    });
  }
});

// Vite or Static Asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Creator Rate Calculator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
