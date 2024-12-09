import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_NEWS_API;

export interface Article {
  id: string;
  url: string;
  title: string;
  content: string;
  created_at: string;
  diff?: string;
}

export interface ArticleVersion {
  id: string;
  article_id: string;
  title: string;
  content: string;
  created_at: string;
  diff?: string;
}

export interface ChangesSummary {
  type: "editorial" | "substantial" | "unknown" | "multiple";
  explanation: string;
  loading?: boolean;
  error?: string;
}

export interface CompareContentResponse {
  type: "editorial" | "substantial" | "unknown";
  explanation: string;
  diff?: string;
}

export interface VersionChanges {
  version: ArticleVersion;
  changes: {
    type: string;
    explanation: string;
    diff: string;
  };
}

export interface MultiVersionChanges {
  originalVersion: ArticleVersion;
  changes: VersionChanges[];
}

export const api = {
  async submitArticle(url: string): Promise<Article> {
    const response = await axios.post(`${API_BASE_URL}/articles/`, { url });
    const data = response.data;

    if (!data || !data.id) {
      throw new Error("Invalid response from server: missing article ID");
    }

    return {
      ...data,
      id: data.id.toString(),
    };
  },

  async getArticle(id: string): Promise<Article> {
    const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
    const data = response.data;

    if (!data || !data.id) {
      throw new Error("Invalid response from server: missing article ID");
    }

    return {
      ...data,
      id: data.id.toString(),
    };
  },

  async getArticles(): Promise<Article[]> {
    const response = await axios.get(`${API_BASE_URL}/articles/`);
    return response.data;
  },

  async getVersions(articleId: string): Promise<ArticleVersion[]> {
    try {
      console.log("Fetching versions for article:", articleId);
      const response = await axios.get(
        `${API_BASE_URL}/articles/${articleId}/versions`
      );
      console.log("Raw versions response:", response.data);
      const versions = response.data;

      if (!Array.isArray(versions)) {
        console.error("Invalid versions response:", versions);
        throw new Error(
          "Invalid response from server: versions is not an array"
        );
      }

      return versions.map((version: any) => {
        console.log("Processing version:", version);

        // More lenient validation - check if we have at least an ID
        if (!version || typeof version !== "object") {
          console.error("Invalid version object:", version);
          throw new Error("Invalid version data: not an object");
        }

        // Default values for missing fields
        const processedVersion: ArticleVersion = {
          id: (version.id || version._id || "").toString(),
          article_id: (version.article_id || articleId).toString(),
          content: version.content || "",
          title: version.title || "",
          created_at: version.created_at || new Date().toISOString(),
          diff: version.diff || "",
        };

        console.log("Processed version:", processedVersion);
        return processedVersion;
      });
    } catch (error) {
      console.error("Error in getVersions:", error);
      throw error;
    }
  },

  async getLatestVersion(articleId: string): Promise<ArticleVersion> {
    const versions = await this.getVersions(articleId);
    if (!versions || versions.length === 0) {
      throw new Error("No versions found for article");
    }
    return versions[versions.length - 1];
  },

  async compareContent(
    originalContent: string,
    newContent: string
  ): Promise<CompareContentResponse> {
    try {
      // If contents are identical, return immediately
      if (originalContent === newContent) {
        return {
          type: "editorial",
          explanation: "No changes detected",
          diff: originalContent,
        };
      }

      // Use the API route instead of direct OpenAI call
      const response = await axios.post(`${API_BASE_URL}/compare`, {
        originalContent,
        newContent,
      });

      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      const result = response.data;

      // Determine change type based on the extent of changes
      const changeType = this.determineChangeType(result.diff || "");

      return {
        type: changeType,
        explanation: result.explanation || "Changes detected",
        diff: result.diff || originalContent,
      };
    } catch (error) {
      console.error("Error comparing content:", error);
      throw error;
    }
  },

  determineChangeType(diff: string): "editorial" | "substantial" | "unknown" {
    if (!diff) return "editorial";
    
    const deletedCount = (diff.match(/<del>/g) || []).length;
    const insertedCount = (diff.match(/<ins>/g) || []).length;
    const totalChanges = deletedCount + insertedCount;

    if (totalChanges > 10) return "substantial";
    if (totalChanges > 5) return "substantial";
    return "editorial";
  },

  async compareMultipleVersions(
    versions: ArticleVersion[]
  ): Promise<MultiVersionChanges> {
    if (!versions || versions.length === 0) {
      throw new Error("No versions provided");
    }

    // If there's only one version, return it without comparison
    if (versions.length === 1) {
      return {
        originalVersion: versions[0],
        changes: [],
      };
    }

    const originalVersion = versions[0];
    const changes: VersionChanges[] = [];

    // Compare original version with each subsequent version
    for (let i = 1; i < versions.length; i++) {
      const currentVersion = versions[i];
      const diff = currentVersion.diff || "";
      
      changes.push({
        version: currentVersion,
        changes: {
          type: this.determineChangeType(diff),
          explanation: `Changes from version ${i + 1}`,
          diff: diff,
        },
      });
    }

    return {
      originalVersion,
      changes,
    };
  },
};
