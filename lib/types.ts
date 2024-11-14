export interface Article {
  title: string;
  url: string;
  description: string;
  content: string;
  image?: string;
}

export interface SavedContent {
  text: string;
  title: string;
  image?: string;
  imageAuthor?: string;
  imageAuthorUrl?: string;
  timestamp: number;
  platform: "linkedin" | "twitter";
}

export interface ImageKeywordHistory {
  url: string;
  usedKeywords: string[];
}

export type ContentLibrary = Record<string, SavedContent[]>;
