"use client";

import React from 'react';
import { Section } from "../../types/dashboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Use Button for clickable items

interface DashboardNavProps {
  sections: { [key: string]: Section };
  activeSectionKey: string;
  onSectionChange: (key: string) => void;
}

export function DashboardNav({ sections, activeSectionKey, onSectionChange }: DashboardNavProps) {
  const sectionEntries = Object.entries(sections);

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 hidden md:block overflow-y-auto">
      <nav className="flex flex-col space-y-2">
        <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">Sections</h3>
        {sectionEntries.map(([key, section]) => (
          <Button
            key={key}
            variant={activeSectionKey === key ? "secondary" : "ghost"} // Highlight active section
            className={cn(
              "w-full justify-start",
              activeSectionKey !== key && "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
            onClick={() => onSectionChange(key)}
          >
            {section.title} {/* Use section title for display */}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
