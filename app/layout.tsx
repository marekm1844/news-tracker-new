import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketing Content Swiper",
  description: "Generate and swipe marketing content for LinkedIn and Twitter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "red",
              color: "white",
            },
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
