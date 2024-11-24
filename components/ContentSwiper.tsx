"use client";

import React from "react";
import { LibraryView } from "@/components/LibraryView";
import { ContentLibrary } from "@/lib/types";

interface ContentSwiperProps {
  contentLibrary: ContentLibrary;
}

export default function ContentSwiper({
  contentLibrary,
}: ContentSwiperProps) {
  return (
    <div className="w-full">
      <LibraryView contentLibrary={contentLibrary} />
    </div>
  );
}
