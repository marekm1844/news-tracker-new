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

async function searchUnsplashImage(query: string): Promise<{
  imageUrl: string;
  photographer: string;
  photographerUrl: string;
}> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image from Unsplash");
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const image = data.results[0];
      return {
        imageUrl: image.urls.regular,
        photographer: image.user.name,
        photographerUrl: image.user.links.html,
      };
    }

    return {
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
      photographer: "Default Photographer",
      photographerUrl: "https://unsplash.com",
    };
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return {
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
      photographer: "Default Photographer",
      photographerUrl: "https://unsplash.com",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { articleUrl, platform, articleContent } = await request.json();

    // Select the appropriate prompts based on platform
    const systemPrompt = platform === "linkedin" ? LINKEDIN_PROMPT : X_PROMPT;
    const imagePrompt =
      platform === "linkedin" ? LINKEDIN_IMAGE_PROMPT : X_IMAGE_PROMPT;

    // Generate title and content together
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Based on this article, create a ${platform} post: "${articleContent}"`,
        },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content || "";
    const titleMatch = response.match(/TITLE:\s*([^\n]+)/);
    const contentMatch = response.match(/CONTENT:\s*([\s\S]+)$/);

    const title = titleMatch
      ? titleMatch[1].trim()
      : `${platform === "linkedin" ? "LinkedIn" : "X"} Post`;
    const content = contentMatch ? contentMatch[1].trim() : response;

    // Generate image keywords with platform-specific guidance
    const imageKeywordsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: imagePrompt,
        },
        {
          role: "user",
          content: `Create image search keywords for this ${platform} post: ${content}`,
        },
      ],
      temperature: 0.8,
    });

    // Get unused keywords for this article
    const allKeywords =
      imageKeywordsResponse.choices[0].message.content ||
      "professional business";
    const unusedKeywords = getUnusedKeywords(articleUrl, allKeywords);

    // Get the image URL from Unsplash using unused keywords
    const imageData = await searchUnsplashImage(unusedKeywords);

    // Clean up history if it gets too large
    if (keywordHistory.length > 100) {
      keywordHistory = keywordHistory.slice(-50);
    }

    return NextResponse.json({
      text: content,
      title: title,
      imagePrompt: unusedKeywords,
      imageUrl: imageData.imageUrl,
      imageAuthor: imageData.photographer,
      imageAuthorUrl: imageData.photographerUrl,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
