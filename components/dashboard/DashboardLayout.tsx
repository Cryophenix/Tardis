"use client"

import { ChartColors } from "./ChartColors"
import { DashboardNav } from "./DashboardNav"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardConfig, DateRange, FilterOptions, Section } from "../../types/dashboard"
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode
  sectionsConfig: { [key: string]: Section }
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  activeSectionKey: string
  onSectionChange: (key: string) => void
}

export function DashboardLayout({
  children,
  sectionsConfig,
  filters,
  onFiltersChange,
  activeSectionKey,
  onSectionChange,
}: DashboardLayoutProps) {
  return (
    <ChartColors>
      <div className="flex flex-col min-h-screen w-full bg-background">
        <DashboardHeader
          filters={filters}
          onFiltersChange={onFiltersChange}
        />

        {/* This container now prevents its own overflow */}
        <div className="flex flex-1 overflow-hidden w-full">
          <DashboardNav
            sections={sectionsConfig}
            activeSectionKey={activeSectionKey}
            onSectionChange={onSectionChange}
          />

          <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
            <div className="max-w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ChartColors>
  )
}
