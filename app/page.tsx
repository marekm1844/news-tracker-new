"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, Article } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [url, setUrl] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.includes("nytimes.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid NY Times article URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await api.submitArticle(url);
      const fullArticle = await api.getArticle(result.id);
      setArticle(fullArticle);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter NY Times article URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Analyze"}
          </Button>
        </div>
      </form>

      {article && (
        <div className="prose max-w-none">
          <h1>{article.title}</h1>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2>Differences</h2>
            <pre>{article.diff}</pre>
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      )}
    </main>
  );
}
