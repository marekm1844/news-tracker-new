"use client";

import { useState } from "react";
import ContentSwiper from "@/components/ContentSwiper";
import { Sidebar } from "@/components/Sidebar";
import { ContentLibrary } from "@/lib/contentLibrary";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

export default function Home() {
  const [contentLibrary, setContentLibrary] = useState<ContentLibrary>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSaveContent = (updatedLibrary: ContentLibrary) => {
    setContentLibrary(updatedLibrary);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-100 relative">
      <Sidebar
        contentLibrary={contentLibrary}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center">
              <Sparkles className="h-8 w-8 mr-3 text-indigo-500" />
              Your Content Hub
            </h1>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-white hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Welcome to Your Content Generator
            </h2>
            <p className="text-gray-600 mb-4">
              Create, manage, and organize your marketing content with ease. Use
              the content swiper below to get started!
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              How it works:
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>
                Enter the URL for an article, blog post or social media post you
                want to turn into marketing content.
              </li>
              <li>
                If you don&apos;t have a URL in mind, select a sample link from
                the drop-down menu below.
              </li>
              <li>
                Select whether you want the post generated for LinkedIn or X.
              </li>
              <li>Click &quot;Generate&quot;</li>
              <li>
                Click <ThumbsUp className="inline h-4 w-4" /> and the content
                will be saved to the left for you to use. Click{" "}
                <ThumbsDown className="inline h-4 w-4" /> for a new post.
              </li>
            </ol>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ContentSwiper
              onSaveContent={handleSaveContent}
              contentLibrary={contentLibrary}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
