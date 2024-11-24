import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_NEWS_API;

export interface Article {
  url: string;
  id: number;
  title: string;
  content: string;
  created_at: string;
  diff?: string;
}

export interface ArticleVersion {
  id: number;
  title: string;
  content: string;
  created_at: string;
  diff: string;
}

export interface ChangesSummary {
  type: "editorial" | "substantial" | "unknown";
  explanation: string;
  loading?: boolean;
  error?: string;
}

export const api = {
  async submitArticle(url: string): Promise<Article> {
    const response = await axios.post(`${API_BASE_URL}/articles`, { url });
    return response.data;
  },

  async getArticle(id: number): Promise<Article> {
    const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  },

  async getArticles(): Promise<Article[]> {
    const response = await axios.get(`${API_BASE_URL}/articles`);
    return response.data;
  },

  async getLatestVersion(articleId: number): Promise<ArticleVersion> {
    const response = await axios.get(`${API_BASE_URL}/articles/${articleId}/latest_version`);
    return response.data;
  },

  async getVersions(articleId: number): Promise<ArticleVersion[]> {
    const response = await axios.get(`${API_BASE_URL}/articles/${articleId}/versions`);
    return response.data;
  },

  async compareContent(originalContent: string, newContent: string): Promise<{
    type: 'editorial' | 'substantial' | 'unknown';
    explanation: string;
  }> {
    // If contents are identical, return immediately without making API call
    if (originalContent === newContent) {
      return {
        type: 'unknown',
        explanation: 'No changes detected'
      };
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalContent,
        newContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze changes');
    }

    return response.json();
  },
};
