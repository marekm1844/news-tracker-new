import ContentLibraryComponent from "./ContentLibrary";
import { ContentLibrary } from "@/lib/contentLibrary";
import { Button } from "@/components/ui/button";
import { X, BookOpen } from "lucide-react";

interface SidebarProps {
  contentLibrary: ContentLibrary;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ contentLibrary, isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-indigo-50 to-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-indigo-800 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
              Library
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <ContentLibraryComponent library={contentLibrary} />
        </div>
      </div>
    </aside>
  );
}
