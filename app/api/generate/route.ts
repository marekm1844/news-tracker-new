import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { originalContent, newContent } = await request.json();

    if (!originalContent || !newContent) {
      return NextResponse.json(
        { error: 'Missing required content' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a precise content comparison system. Compare the two article versions and:
1. Identify specific changes between versions
2. Mark deleted text with <span class="deleted">DELETED TEXT</span>
3. Mark inserted text with <span class="inserted">INSERTED TEXT</span>
4. Return the COMPLETE article content with these markers
5. Provide a brief explanation of the changes

Important:
- Include ALL content, not just the changes
- Preserve paragraph structure
- Mark even small changes (single words/punctuation)
- Be precise with change markers`,
        },
        {
          role: "user",
          content: `Original content:\n${originalContent}\n\nNew content:\n${newContent}`,
        },
      ],
      temperature: 0,
    });

    const result = response.choices[0].message.content;
    if (!result) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    // Split the response into diff and explanation
    const [diff, ...explanationParts] = result.split("\n\nExplanation:");
    const explanation = explanationParts.join("\n\nExplanation:").trim();

    return NextResponse.json({
      diff: diff.trim(),
      explanation: explanation,
    });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Failed to compare content' },
      { status: 500 }
    );
  }
}
