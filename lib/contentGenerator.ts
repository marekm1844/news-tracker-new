export async function generateContent(
  articleUrl: string,
  platform: string,
  articleContent?: string
): Promise<{
  text: string;
  imagePrompt: string;
  imageUrl: string;
  imageAuthor: string;
  imageAuthorUrl: string;
  title: string;
}> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleUrl,
        platform,
        articleContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate content");
    }

    const data = await response.json();
    return {
      text: data.text,
      imagePrompt: data.imagePrompt,
      imageUrl: data.imageUrl,
      imageAuthor: data.imageAuthor,
      imageAuthorUrl: data.imageAuthorUrl,
      title: data.title,
    };
  } catch (error) {
    console.error("Error in generateContent:", error);
    throw error;
  }
}
