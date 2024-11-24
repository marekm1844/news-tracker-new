"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useArticle } from "@/contexts/ArticleContext";
import { api, ArticleVersion, ChangesSummary } from "@/lib/api-client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import SideMenu from "@/components/SideMenu";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestVersion, setLatestVersion] = useState<ArticleVersion | null>(null);
  const [showError, setShowError] = useState(false);
  const [showNewspaper, setShowNewspaper] = useState(false);
  const [changesSummary, setChangesSummary] = useState<ChangesSummary | null>(null);
  const { toast } = useToast();
  const { selectedArticle, setSelectedArticle } = useArticle();

  const handleAnalyze = useCallback(
    async (urlToAnalyze: string) => {
      if (!urlToAnalyze) {
        toast({
          title: "Error",
          description: "Please enter a URL",
          variant: "destructive",
        });
        return;
      }

      if (!urlToAnalyze.includes("nytimes.com")) {
        toast({
          title: "Error",
          description: "Please enter a valid NY Times article URL",
          variant: "destructive",
        });
        return;
      }

      setShowError(false);
      setLoading(true);
      setChangesSummary({
        type: "unknown",
        explanation: "Loading article...",
        loading: true
      });

      try {
        let articleToAnalyze;
        let latestVersionToAnalyze;

        // Step 1: Load the article
        if (selectedArticle) {
          articleToAnalyze = selectedArticle;
          latestVersionToAnalyze = await api.getLatestVersion(selectedArticle.id);
        } else {
          const result = await api.submitArticle(urlToAnalyze);
          articleToAnalyze = await api.getArticle(result.id);
          latestVersionToAnalyze = await api.getLatestVersion(result.id);
          
          const event = new CustomEvent("refreshArticles");
          window.dispatchEvent(event);
        }

        // Update UI with article content immediately
        setSelectedArticle(articleToAnalyze);
        setLatestVersion(latestVersionToAnalyze);
        setShowNewspaper(true);

        // Step 2: Perform change analysis
        if (latestVersionToAnalyze.diff) {
          setChangesSummary({
            type: "unknown",
            explanation: "Analyzing changes...",
            loading: true
          });

          // Get all versions for analysis
          const versions = await api.getVersions(articleToAnalyze.id);
          const originalVersion = versions.sort((a, b) => a.id - b.id)[0];

          // Analyze changes
          const analysisResult = await api.compareContent(
            originalVersion.content,
            latestVersionToAnalyze.content
          );
          
          setChangesSummary({
            type: analysisResult.type,
            explanation: analysisResult.explanation,
            loading: false
          });

          toast({
            title: "Analysis Complete",
            description: `Changes detected: ${analysisResult.type}`,
          });
        } else {
          setChangesSummary({
            type: "unknown",
            explanation: "No changes detected in this article.",
            loading: false
          });

          toast({
            description: "Article loaded. No changes detected.",
          });
        }
        
      } catch (error: any) {
        console.error("Error analyzing article:", error);
        if (error.response?.status === 422) {
          setShowError(true);
        } else {
          toast({
            title: "Error",
            description: "Failed to analyze article",
            variant: "destructive",
          });
        }
        setChangesSummary({
          type: "unknown",
          explanation: "Failed to analyze article",
          loading: false,
          error: "Analysis failed"
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, setSelectedArticle, selectedArticle]
  );

  const handleArticleSelect = useCallback((selectedUrl: string) => {
    setUrl(selectedUrl);
    setShowError(false);
    setShowNewspaper(false);
    setChangesSummary(null);
  }, []);

  const combineContentAndDiff = (content: string, diff: string) => {
    if (!diff) return formatContent(content);

    const parser = new DOMParser();
    const diffDoc = parser.parseFromString(diff, "text/html");

    // Convert diff content to paragraphs, replacing ins/del tags with spans
    const diffContent = diffDoc.body.innerHTML
      .replace(/<ins>/g, '<span class="inserted">')
      .replace(/<\/ins>/g, "</span>")
      .replace(/<del>/g, '<span class="deleted">')
      .replace(/<\/del>/g, "</span>");

    // Split both contents into paragraphs
    const contentParagraphs = content.split(/\n{2,}/);
    const diffParagraphs = diffContent.split(/\n{2,}|<\/?p>|<\/?div>/);

    // Final array of paragraphs
    const finalParagraphs: string[] = [];

    // Process each paragraph
    diffParagraphs.forEach((diffP) => {
      const trimmedDiff = diffP.trim();
      if (!trimmedDiff) return;

      // If paragraph has insertions, use it from diff
      if (trimmedDiff.includes('class="inserted"')) {
        finalParagraphs.push(trimmedDiff);
      }
    });

    // Add content paragraphs that weren't replaced
    contentParagraphs.forEach((contentP) => {
      const trimmedContent = contentP.trim();
      if (!trimmedContent) return;

      // Check if this paragraph is already included (from diff)
      const plainContent = trimmedContent.replace(/<[^>]+>/g, "");
      const isIncluded = finalParagraphs.some(
        (p) =>
          p.replace(/<[^>]+>/g, "").includes(plainContent) ||
          plainContent.includes(p.replace(/<[^>]+>/g, ""))
      );

      if (!isIncluded) {
        finalParagraphs.push(trimmedContent);
      }
    });

    // Wrap in paragraph tags and join
    return finalParagraphs
      .filter((p) => p.trim())
      .map((p) => `<p>${p}</p>`)
      .join("\n");
  };

  const formatContent = (content: string) => {
    if (!content) return "";
    return content
      .split(/\n{2,}/)
      .map((p) => `<p>${p.trim()}</p>`)
      .join("\n");
  };

  const renderContent = () => {
    if (!latestVersion) return null;
    return combineContentAndDiff(latestVersion.content, latestVersion.diff);
  };

  // Fetch latest version when selected article changes
  useEffect(() => {
    if (selectedArticle) {
      const fetchLatestVersion = async () => {
        try {
          const latest = await api.getLatestVersion(selectedArticle.id);
          setLatestVersion(latest);
        } catch (error) {
          console.error("Error fetching latest version:", error);
          toast({
            title: "Error",
            description: "Failed to fetch latest version",
            variant: "destructive",
          });
        }
      };

      fetchLatestVersion();
    } else {
      setLatestVersion(null);
    }
  }, [selectedArticle, toast]);

  return (
    <div className="flex h-screen">
      <SideMenu 
        onArticleSelect={handleArticleSelect}
        changesSummary={changesSummary}
      />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>NY Times Article Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter NY Times article URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button onClick={() => handleAnalyze(url)} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
                {showError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Unable to Process Article</AlertTitle>
                    <AlertDescription>
                      We cannot process this article. It might be behind a
                      paywall or not accessible. Please make sure you have
                      access to the article and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {showNewspaper && selectedArticle && latestVersion && (
              <Card className="newspaper-card">
                <CardHeader className="text-center border-b border-gray-200 pb-6">
                  <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    The New York Times
                  </p>
                  <CardTitle className="text-4xl font-serif mb-4">
                    {latestVersion.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 italic">
                    Last updated:{" "}
                    {new Date(latestVersion.created_at).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <style jsx global>{`
                    .article-content {
                      font-family: georgia, "times new roman", times, serif;
                      font-size: 1.125rem;
                      line-height: 1.8;
                      color: #333;
                      max-width: 65ch;
                      margin: 0 auto;
                    }
                    .article-content p {
                      margin: 0 0 1.5rem 0;
                      text-indent: 2rem;
                      white-space: pre-wrap;
                    }
                    .article-content .inserted {
                      background-color: #dcfce7;
                      color: #166534;
                      text-decoration: none;
                      padding: 0.125rem 0.25rem;
                      border-radius: 0.25rem;
                    }
                    .article-content .deleted {
                      background-color: #fee2e2;
                      color: #991b1b;
                      text-decoration: line-through;
                      padding: 0.125rem 0.25rem;
                      border-radius: 0.25rem;
                    }
                    .article-content h1,
                    .article-content h2,
                    .article-content h3 {
                      font-family: "times new roman", times, serif;
                      font-weight: bold;
                      margin: 2rem 0 1rem 0;
                    }
                    .newspaper-card {
                      background-color: #fff9f5;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                        0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    }
                  `}</style>
                  <div className="article-content p-6 md:p-8 lg:p-12">
                    <div
                      className="article-content"
                      dangerouslySetInnerHTML={{
                        __html: renderContent() || "",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
