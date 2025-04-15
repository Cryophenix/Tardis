"use client"

// Import the actual renderer
import { DashboardComponentRenderer } from "./DashboardComponentRenderer"
import { Section, ChartConfig } from "../../types/dashboard"

// Props now take the whole section config
interface DashboardSectionProps {
  sectionConfig: Section;
}

export function DashboardSection({ sectionConfig }: DashboardSectionProps) {
  // Filters are no longer passed as props, handled by renderer via context

  return (
    <div className="grid gap-8 mb-8 w-full">
      {sectionConfig.charts.map((chartGroup, groupIndex) => {
        // Override the grid class to ensure 2 items per row (half screen each)
        const itemCount = chartGroup.items.length;
        // Use 2-column grid for 2 or more items, 1-column for single item
        const gridClass = itemCount >= 2 
          ? "grid grid-cols-1 md:grid-cols-2 gap-6 w-full" 
          : "grid grid-cols-1 gap-6 w-full";
          
        return (
          <div key={groupIndex} className={gridClass}>
            {chartGroup.items.map((itemConfig) => (
              // Use the actual renderer, passing the config for this specific item
              <DashboardComponentRenderer key={itemConfig.id} componentConfig={itemConfig} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* 
  OLD IMPLEMENTATION (kept for reference during refactor)
{{ ... }}
*/
