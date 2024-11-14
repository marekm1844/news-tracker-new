import { NextRequest, NextResponse } from "next/server";
import { Article } from "@/lib/types";
import axios from "axios";

const API_URL = process.env.SCRAPER_API_URL;
const API_KEY = process.env.SCRAPER_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!API_URL || !API_KEY) {
      return NextResponse.json(
        { error: "Missing API configuration" },
        { status: 500 }
      );
    }

    const { url } = await request.json();

    // Call the external API
    const response = await axios.post(
      API_URL,
      {
        url: url,
        prompt:
          "Get the title and full article content and return it as a markdown formatted string. Do not include any other text.",
        model: "gpt-4o",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch article from API");
    }

    const data = response.data;

    if (!data || !data.markdown) {
      throw new Error("Invalid response from API");
    }

    // Try to extract title and description from the content
    const firstLine = data.markdown.split("\n")[0];
    const secondLine = data.markdown.split("\n")[1] || "";

    const article: Article = {
      title: data.title || firstLine || "Article Title",
      url: url,
      description: data.description || secondLine || firstLine,
      content: data.markdown,
      image: data.image_url || undefined,
    };

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article content" },
      { status: 500 }
    );
  }
}
