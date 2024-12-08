"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useArticle } from "@/contexts/ArticleContext";
import { api, ArticleVersion, ChangesSummary } from "@/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import SideMenu from "@/components/SideMenu";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestVersion, setLatestVersion] = useState<ArticleVersion | null>(
    null
  );
  const [showError, setShowError] = useState(false);
  const [showNewspaper, setShowNewspaper] = useState(false);
  const [changesSummary, setChangesSummary] = useState<ChangesSummary | null>(
    null
  );
  const { toast } = useToast();
  const { selectedArticle, setSelectedArticle } = useArticle();

  const handleAnalyze = useCallback(async () => {
    if (!url && !selectedArticle) {
      setShowError(true);
      return;
    }

    setLoading(true);
    setShowError(false);
    let articleToAnalyze;
    let latestVersionToAnalyze;

    setChangesSummary({
      type: "unknown",
      explanation: "Loading article...",
      loading: true,
    });

    try {
      const urlToAnalyze = selectedArticle ? selectedArticle.url : url;

      // Step 1: Load the article
      if (selectedArticle) {
        console.log("Using existing article:", selectedArticle);
        articleToAnalyze = selectedArticle;
        console.log(
          "Fetching latest version for article:",
          articleToAnalyze.id
        );
        latestVersionToAnalyze = await api.getLatestVersion(
          articleToAnalyze.id
        );
      } else {
        console.log("Submitting new article:", urlToAnalyze);
        const result = await api.submitArticle(urlToAnalyze);
        articleToAnalyze = result;
        console.log(
          "Fetching latest version for new article:",
          articleToAnalyze.id
        );
        latestVersionToAnalyze = await api.getLatestVersion(
          articleToAnalyze.id
        );
        setSelectedArticle(articleToAnalyze);
      }

      // Update UI with article content immediately
      setLatestVersion(latestVersionToAnalyze);
      setShowNewspaper(true);

      // Step 2: Perform change analysis
      if (latestVersionToAnalyze.diff) {
        setChangesSummary({
          type: "unknown",
          explanation: "Analyzing changes...",
          loading: true,
        });

        // Get all versions for analysis
        const versions = await api.getVersions(articleToAnalyze.id);
        const originalVersion = versions[0];

        // Compare content only if there are multiple versions
        if (versions.length > 1) {
          const analysisResult = await api.compareContent(
            originalVersion.content,
            latestVersionToAnalyze.content
          );

          setChangesSummary({
            type: analysisResult.type,
            explanation: analysisResult.explanation,
            loading: false,
          });

          toast({
            title: "Analysis complete",
            description: "Article changes have been analyzed.",
          });
        } else {
          // Handle case where there's only one version (no diff)
          setChangesSummary({
            type: "unknown",
            explanation: "This is the first version of the article.",
            loading: false,
          });

          toast({
            title: "Article loaded",
            description: "This is the first version of this article.",
          });
        }
      } else {
        setChangesSummary({
          type: "unknown",
          explanation: "No changes detected in this article.",
          loading: false,
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
        error: "Analysis failed",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, setSelectedArticle, selectedArticle]);

  const handleArticleSelect = useCallback(
    async (selectedUrl: string, version: ArticleVersion | null) => {
      console.log("Article selected with URL:", selectedUrl);
      setUrl(selectedUrl);
      setShowError(false);
      setShowNewspaper(true);

      if (version) {
        console.log("Setting latest version:", version);
        setLatestVersion(version);
      }

      setChangesSummary({
        type: "unknown",
        explanation: "Loading article...",
        loading: true,
      });
    },
    []
  );

  useEffect(() => {
    if (selectedArticle) {
      setUrl(selectedArticle.url);
    }
  }, [selectedArticle]);

  const combineContentAndDiff = (content: string, diff: string) => {
    if (!diff) return content;
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

  const displayContent = useMemo(() => {
    if (!latestVersion) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-gray-500 mb-2">THE NEW YORK TIMES</div>
          <h1 className="text-4xl font-serif mb-4">{latestVersion.title}</h1>
          <div className="text-gray-500">
            Last updated: {new Date(latestVersion.created_at).toLocaleString()}
          </div>
        </div>
        <div className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: combineContentAndDiff(
                latestVersion.content,
                latestVersion.diff || ""
              ),
            }}
          />
        </div>
      </div>
    );
  }, [latestVersion]);

  return (
    <div className="flex h-screen">
      <SideMenu
        onArticleSelect={handleArticleSelect}
        changesSummary={changesSummary}
      />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold mb-6">
                NY Times Article Tracker
              </h1>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter NY Times article URL"
                  className="flex-grow"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={handleAnalyze} disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
              {showError && (
                <div className="mt-4 text-red-500">
                  Please enter a valid NY Times URL
                </div>
              )}
            </div>

            {showNewspaper && latestVersion && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="text-gray-500 mb-2">THE NEW YORK TIMES</div>
                  <h1 className="text-4xl font-serif mb-4">
                    {latestVersion.title}
                  </h1>
                  <div className="text-gray-500">
                    Last updated:{" "}
                    {new Date(latestVersion.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="prose max-w-none article-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: combineContentAndDiff(
                        latestVersion.content,
                        latestVersion.diff || ""
                      ),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
