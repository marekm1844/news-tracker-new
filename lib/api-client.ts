import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_NEWS_API || "http://127.0.0.1:8000";

export interface Article {
  title: string;
  content: string;
  created_at: string;
  id: number;
  diff: string;
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
};
