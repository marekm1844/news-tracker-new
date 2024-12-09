"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useArticle } from "@/contexts/ArticleContext";
import { api, Article, ArticleVersion, ChangesSummary, MultiVersionChanges, VersionChanges } from "@/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import SideMenu from "@/components/SideMenu";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [multiVersionChanges, setMultiVersionChanges] = useState<MultiVersionChanges | null>(null);
  const [showError, setShowError] = useState(false);
  const [showNewspaper, setShowNewspaper] = useState(false);
  const [changesSummary, setChangesSummary] = useState<ChangesSummary | null>(null);
  const { toast } = useToast();

  const handleAnalyze = useCallback(async () => {
    if (!url) {
      setShowError(true);
      return;
    }

    try {
      setShowError(false);
      setChangesSummary({
        type: "unknown",
        explanation: "Loading article...",
        loading: true,
      });

      setLoading(true);
      console.log('Starting analysis for URL:', url);

      // Step 1: Submit article if needed
      if (!selectedArticle) {
        console.log('Submitting new article...');
        const article = await api.submitArticle(url);
        console.log('Article submitted:', article);
        setSelectedArticle(article);
        
        try {
          console.log('Fetching versions for article:', article.id);
          const versions = await api.getVersions(article.id);
          console.log('Fetched versions:', versions);

          if (!versions || versions.length === 0) {
            console.log('No versions found');
            setChangesSummary({
              type: "unknown",
              explanation: "No versions found for this article yet. Please check back later.",
              loading: false,
            });
            setLoading(false);
            toast({
              title: "Analysis complete",
              description: "Article submitted successfully. No versions available yet.",
            });
            return;
          }

          // Get changes regardless of version count - compareMultipleVersions will handle single version case
          console.log(`Found ${versions.length} version(s), processing...`);
          const multiChanges = await api.compareMultipleVersions(versions);
          console.log('Processing result:', multiChanges);
          
          setMultiVersionChanges(multiChanges);
          setShowNewspaper(true);
          
          if (versions.length === 1) {
            setChangesSummary({
              type: "unknown",
              explanation: "This is the first version of the article. Check back later for updates.",
              loading: false,
            });
            toast({
              title: "Analysis complete",
              description: "First version of the article loaded successfully.",
            });
          } else {
            const changeExplanations = multiChanges.changes
              .map((change, index) => 
                `Version ${index + 2}: ${change.changes.explanation}`
              )
              .join('\n\n');

            setChangesSummary({
              type: multiChanges.changes[0].changes.type as "editorial" | "substantial" | "multiple",
              explanation: changeExplanations,
              loading: false,
            });
            toast({
              title: "Analysis complete",
              description: `Analyzed ${multiChanges.changes.length} version changes.`,
            });
          }
        } catch (error) {
          console.error('Error processing versions:', error);
          setChangesSummary({
            type: "unknown",
            explanation: error instanceof Error ? 
              `Error processing article versions: ${error.message}` :
              "Error processing article versions.",
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to process article versions",
            variant: "destructive",
          });
        }

        setLoading(false);
      }
    } catch (error) {
      console.error('Error analyzing article:', error);
      setChangesSummary({
        type: "unknown",
        explanation: "Error analyzing article.",
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze article",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast, url, selectedArticle, multiVersionChanges]);

  const handleArticleSelect = useCallback(
    async (selectedUrl: string, changes: MultiVersionChanges | null) => {
      console.log("Article selected with URL:", selectedUrl, "Changes:", changes);
      
      if (!changes) {
        console.warn("No changes provided for article");
        return;
      }

      // Update all states at once
      setUrl(selectedUrl);
      setMultiVersionChanges(changes);
      setShowError(false);
      setShowNewspaper(true);
      setChangesSummary({
        type: "unknown",
        explanation: "Loading article...",
        loading: true,
      });

      // Update changes summary with all version changes
      const changeExplanations = changes.changes
        .map((change, index) => 
          `Version ${index + 2}: ${change.changes.explanation}`
        )
        .join('\n\n');

      setChangesSummary({
        type: changes.changes[0].changes.type as "editorial" | "substantial" | "multiple",
        explanation: changeExplanations,
        loading: false,
      });
    },
    []
  );

  const combineContentAndDiff = (content: string, versionChanges: VersionChanges[]) => {
    if (!versionChanges || versionChanges.length === 0) return formatContent(content);

    let combinedContent = content;
    const changes: { text: string; type: string; date: string }[] = [];

    // Process each version's changes
    versionChanges.forEach((change) => {
      const changeDate = new Date(change.version.created_at).toLocaleDateString();
      
      // Use the existing diff field which contains ins/del tags
      if (change.version.diff) {
        // Convert ins/del tags to our span format with dates
        const processedDiff = change.version.diff
          .replace(/<ins>(.*?)<\/ins>/g, (_, text) => 
            `<span class="inserted" title="Added on ${changeDate}">${text}</span>`
          )
          .replace(/<del>(.*?)<\/del>/g, (_, text) => 
            `<span class="deleted" title="Deleted on ${changeDate}">${text}</span>`
          );
        
        combinedContent = processedDiff;
      }
    });

    return formatContent(combinedContent);
  };

  const formatContent = (content: string) => {
    if (!content) return "";
    
    // Preserve existing spans while formatting paragraphs
    const paragraphs = content.split(/\n{2,}/);
    return paragraphs
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => {
        // Only wrap in <p> if not already wrapped
        if (!paragraph.startsWith('<p>')) {
          return `<p>${paragraph}</p>`;
        }
        return paragraph;
      })
      .join("\n");
  };

  const displayContent = useMemo(() => {
    if (!multiVersionChanges) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-gray-500 mb-2">THE NEW YORK TIMES</div>
          <h1 className="text-4xl font-serif mb-4">
            {multiVersionChanges.originalVersion.title}
          </h1>
          <div className="text-gray-500">
            Original version: {new Date(multiVersionChanges.originalVersion.created_at).toLocaleString()}
          </div>
          {multiVersionChanges.changes.length > 0 && (
            <div className="text-sm text-gray-500 mt-2">
              Latest update: {new Date(multiVersionChanges.changes[multiVersionChanges.changes.length - 1].version.created_at).toLocaleString()}
            </div>
          )}
        </div>
        <div className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: multiVersionChanges.changes.length === 0 ?
                formatContent(multiVersionChanges.originalVersion.content) :
                combineContentAndDiff(
                  multiVersionChanges.originalVersion.content,
                  multiVersionChanges.changes
                ),
            }}
          />
        </div>
      </div>
    );
  }, [multiVersionChanges]);

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

            {showNewspaper && multiVersionChanges && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="text-gray-500 mb-2">THE NEW YORK TIMES</div>
                  <h1 className="text-4xl font-serif mb-4">
                    {multiVersionChanges.originalVersion.title}
                  </h1>
                  <div className="text-gray-500">
                    Original version: {new Date(multiVersionChanges.originalVersion.created_at).toLocaleString()}
                  </div>
                  {multiVersionChanges.changes.length > 0 && (
                    <div className="text-sm text-gray-500 mt-2">
                      Latest update: {new Date(multiVersionChanges.changes[multiVersionChanges.changes.length - 1].version.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="prose max-w-none article-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: multiVersionChanges.changes.length === 0 ?
                        formatContent(multiVersionChanges.originalVersion.content) :
                        combineContentAndDiff(
                          multiVersionChanges.originalVersion.content,
                          multiVersionChanges.changes
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
