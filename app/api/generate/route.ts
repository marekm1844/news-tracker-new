import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ImageKeywordHistory } from "@/lib/types";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

// Keep track of used keywords per article URL
let keywordHistory: ImageKeywordHistory[] = [];

// Function to get unused keywords for an article
function getUnusedKeywords(url: string, newKeywords: string): string {
  const articleHistory = keywordHistory.find((h) => h.url === url);

  if (!articleHistory) {
    // If no history exists for this URL, create one
    keywordHistory.push({
      url,
      usedKeywords: [newKeywords],
    });
    return newKeywords;
  }

  // Split the new keywords and filter out any that have been used before
  const keywordArray = newKeywords.split(",").map((k) => k.trim());
  const unusedKeywords = keywordArray.filter(
    (k) => !articleHistory.usedKeywords.includes(k)
  );

  if (unusedKeywords.length === 0) {
    // If all keywords have been used, generate a completely new set
    return newKeywords;
  }

  // Add the unused keywords to history
  articleHistory.usedKeywords.push(...unusedKeywords);

  // Return the first unused keyword
  return unusedKeywords[0];
}

// Separate prompts for LinkedIn and X
const LINKEDIN_PROMPT = `You are a professional LinkedIn content creator specializing in business and professional content.
Create an engaging post that:
1. Has a compelling title (max 80 characters). Do not include hashtags in the title.
2. Demonstrates thought leadership and industry expertise
3. Encourages professional discussion and engagement
4. Includes 1-2 relevant hashtags
5. Maintains a professional tone
6. Is between 400-600 characters

Return the response in this format exactly:
TITLE: [Your title here]
CONTENT: [Your content here]`;

const X_PROMPT = `You are a social media expert specializing in X (formerly Twitter) content.
Create an engaging post that:
1. Has a catchy, attention-grabbing title (max 50 characters)
2. Is concise and impactful
3. Uses appropriate emojis to enhance engagement
4. Includes 1-2 relevant hashtags
5. Stays within 280 characters total (including title)
6. Creates urgency or curiosity

Return the response in this format exactly:
TITLE: [Your title here]
CONTENT: [Your content here]`;

// Add separate image prompts
const LINKEDIN_IMAGE_PROMPT = `You are an expert at image keywords for LinkedIn posts..
Generate 5 different keyword combinations (2-3 words each) separated by commas.
Focus on:
- Professional settings
- Business environments
- Attractive visuals
- Modern look and feel
- No corporate bullshit
- Industry-specific visuals
Return only the keywords, no explanation.`;

const X_IMAGE_PROMPT = `You are an expert at finding engaging and attention-grabbing social media image keywords.
Generate 5 different keyword combinations (2-3 words each) separated by commas.
Focus on:
- Eye-catching visuals
- Modern look and feel
- Modern art style
- Trending imagery
- Dynamic situations
- Emotional impact
- Cultural relevance
Return only the keywords, no explanation.`;

export async function POST(request: NextRequest) {
  try {
    console.log("POST function called - Starting analysis");
    const { originalContent, newContent } = await request.json();
    console.log("Received content for analysis:", {
      originalContentLength: originalContent?.length,
      newContentLength: newContent?.length,
    });

    const prompt = `Analyze the differences between these two versions of a news article.
Original content:
${originalContent}

New content:
${newContent}

Please analyze the changes and determine if they are:
1. Purely editorial (spelling, grammar, style) or
2. Substantial (changing meaning, adding/removing information)

Provide a concise explanation of your analysis. Format your response as JSON with two fields:
- type: either "editorial" or "substantial"
- explanation: your analysis of the changes`;

    console.log("Sending request to OpenAI");
    const analysisCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
    });

    const analysisResponse =
      analysisCompletion.choices[0].message.content ??
      "Could not parse the analysis";

    console.log("Received response from OpenAI:", analysisResponse);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(analysisResponse);
      return NextResponse.json({
        type: parsedResponse.type || "unknown",
        explanation: parsedResponse.explanation || "Could not analyze changes",
        success: true,
      });
    } catch (e) {
      console.error("Error parsing analysis:", e);
      return NextResponse.json({
        type: "unknown",
        explanation: analysisResponse,
        success: false,
      });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to process the request", success: false },
      { status: 500 }
    );
  }
}
