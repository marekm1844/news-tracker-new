"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { api, Article, ArticleVersion, ChangesSummary, MultiVersionChanges } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SideMenuProps {
  onArticleSelect: (url: string, changes: MultiVersionChanges | null) => void;
  changesSummary: ChangesSummary | null;
}

export default function SideMenu({ onArticleSelect, changesSummary }: SideMenuProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [latestVersion, setLatestVersion] = useState<ArticleVersion | null>(null);
  const [changesSummaryState, setChangesSummary] = useState<ChangesSummary | null>(changesSummary);
  const { toast } = useToast();

  const fetchArticles = useCallback(async () => {
    try {
      const fetchedArticles = await api.getArticles();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleArticleClick = async (article: Article) => {
    try {
      console.log('Article selected:', article);
      
      // Get all versions
      const versions = await api.getVersions(article.id);
      if (versions.length === 0) {
        throw new Error("No versions found for article");
      }

      // Compare all versions
      const multiVersionChanges = await api.compareMultipleVersions(versions);
      
      // Set states only after we have all the data
      setSelectedArticle(article);
      onArticleSelect(article.url, multiVersionChanges);

      if (versions.length > 1) {
        // Create a combined explanation of all changes
        const changeExplanations = multiVersionChanges.changes
          .map((change, index) => 
            `Version ${index + 2}: ${change.changes.explanation}`
          )
          .join('\n\n');

        setChangesSummary({
          type: multiVersionChanges.changes[0].changes.type as "editorial" | "substantial" | "multiple",
          explanation: changeExplanations,
          loading: false,
        });

        toast({
          title: "Analysis complete",
          description: `Analyzed ${versions.length - 1} version changes.`,
        });
      } else {
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
    } catch (error) {
      console.error('Error analyzing article:', error);
      toast({
        title: "Error",
        description: "Failed to analyze article changes.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchArticles();
    };

    window.addEventListener("refreshArticles", handleRefresh);
    return () => window.removeEventListener("refreshArticles", handleRefresh);
  }, [fetchArticles]);

  return (
    <div className="w-96 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Upper section - Articles List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Articles Library</h2>
        <div className="space-y-2">
          {articles.map((article) => (
            <Card
              key={article.id}
              className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedArticle?.id === article.id ? "bg-gray-100" : ""
              }`}
              onClick={() => handleArticleClick(article)}
            >
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {article.title || "Untitled Article"}
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Divider */}
      <Separator className="my-2" />

      {/* Lower section - Analysis Results */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Analysis Results</h2>
        <div className="space-y-3">
          {changesSummaryState ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                {changesSummaryState.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-600 font-medium">
                      {changesSummaryState.explanation}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      changesSummaryState.type === "editorial"
                        ? "bg-green-100 text-green-800"
                        : changesSummaryState.type === "substantial"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {changesSummaryState.type.charAt(0).toUpperCase() +
                      changesSummaryState.type.slice(1)}
                  </span>
                )}
              </div>
              {!changesSummaryState.loading && (
                <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {changesSummaryState.explanation}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Select an article to see changes analysis
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
