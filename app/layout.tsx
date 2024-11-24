import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ArticleProvider } from "@/contexts/ArticleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "News Tracker",
  description: "Track changes in news articles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <ArticleProvider>
          {children}
          <Toaster />
        </ArticleProvider>
      </body>
    </html>
  );
}
