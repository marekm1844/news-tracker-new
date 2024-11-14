"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContentLibrary } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, ChevronDown, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ContentLibraryProps {
  library: ContentLibrary;
}

export default function ContentLibraryComponent({
  library,
}: ContentLibraryProps) {
  const getPlatformBadge = (platform: "linkedin" | "twitter") => {
    if (platform === "linkedin") {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Linkedin className="w-3 h-3" />
          LinkedIn
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Twitter className="w-3 h-3" />X
      </Badge>
    );
  };

  return (
    <Card className="h-[calc(100vh-8rem)] bg-white shadow-lg">
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(library).map(([url, contents], index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="border-b last:border-b-0"
              >
                <AccordionTrigger className="text-sm font-medium text-gray-700 hover:bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-indigo-500" />
                      {url}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50 px-4 py-2">
                  <ul className="space-y-4">
                    {contents.map((content, contentIndex) => (
                      <li key={contentIndex} className="text-sm text-gray-700">
                        <Card className="bg-white shadow-sm">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              {getPlatformBadge(content.platform)}
                              <p className="text-xs text-gray-500">
                                {new Date(content.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <h3 className="font-medium text-gray-900">
                              {content.title}
                            </h3>
                            {content.image && (
                              <div className="space-y-1">
                                <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                                  <Image
                                    src={content.image}
                                    alt="Content image"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="text-xs text-gray-500 text-center space-y-0.5">
                                  <div>
                                    Photo by{" "}
                                    <a
                                      href={content.imageAuthorUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline hover:text-gray-700 break-words"
                                    >
                                      {content.imageAuthor}
                                    </a>
                                  </div>
                                  <div>
                                    on{" "}
                                    <a
                                      href="https://unsplash.com"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline hover:text-gray-700"
                                    >
                                      Unsplash
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div>
                              <p className="whitespace-pre-wrap break-words leading-relaxed">
                                {content.text}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
