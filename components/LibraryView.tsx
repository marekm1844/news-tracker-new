import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentLibrary } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

interface LibraryViewProps {
  contentLibrary: ContentLibrary;
}

export function LibraryView({ contentLibrary }: LibraryViewProps) {
  console.log("Content Library Data:", contentLibrary);
  
  // Convert library to array and sort by timestamp
  const sortedContent = Object.entries(contentLibrary || {})
    .flatMap(([url, contents]) =>
      contents.map((content) => ({
        url,
        ...content,
      }))
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  console.log("Sorted Content:", sortedContent);

  if (!contentLibrary || Object.keys(contentLibrary).length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Your library is empty. Generate and save some content to see it here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedContent.map((content, index) => (
        <Card key={`${content.url}-${index}`} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {format(content.timestamp, "PPP")}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {content.text}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                View Article
              </a>
              <div className="text-sm text-muted-foreground">
                {content.platform === "linkedin" ? "LinkedIn" : "Twitter"}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
