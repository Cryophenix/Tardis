"use client"

import { DateRange } from "react-day-picker"
import { FilterOptions } from "../../types/dashboard"

interface DashboardHeaderProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function DashboardHeader({
  filters,
  onFiltersChange,
}: DashboardHeaderProps) {
  const { station: selectedStation, dateRange } = filters;

  const handleStationChange = (newStation: string) => {
    onFiltersChange({ ...filters, station: newStation });
  };

  const handleDateChange = (newDateRange?: DateRange) => {
    if (newDateRange) {
      onFiltersChange({ ...filters, dateRange: newDateRange });
    }
  };

  const stationOptions = ["All Stations", "Central Station", "North Station", "South Station", "West Station"];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold text-lg">
              Train Dashboard
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}
