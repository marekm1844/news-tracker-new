"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { api, Article, ArticleVersion, ChangesSummary } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SideMenuProps {
  onArticleSelect: (url: string) => void;
  changesSummary: ChangesSummary | null;
}

export default function SideMenu({ onArticleSelect, changesSummary }: SideMenuProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [latestVersion, setLatestVersion] = useState<ArticleVersion | null>(null);
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
    setSelectedArticle(article);
    if (onArticleSelect) {
      onArticleSelect(article.url);
    }

    try {
      // Get all versions and the latest version
      const [versions, latest] = await Promise.all([
        api.getVersions(article.id),
        api.getLatestVersion(article.id)
      ]);

      // Sort versions by id and get the first one (original)
      const originalVersion = versions.sort((a, b) => a.id - b.id)[0];
      setLatestVersion(latest);
      
    } catch (error) {
      console.error("Error fetching versions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch article versions",
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
          {changesSummary ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                {changesSummary.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-600 font-medium">
                      {changesSummary.explanation}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      changesSummary.type === "editorial"
                        ? "bg-green-100 text-green-800"
                        : changesSummary.type === "substantial"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {changesSummary.type.charAt(0).toUpperCase() +
                      changesSummary.type.slice(1)}
                  </span>
                )}
              </div>
              {!changesSummary.loading && (
                <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {changesSummary.explanation}
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
