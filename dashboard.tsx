"use client"

import { useState, useEffect, useMemo } from "react";
import { useDashboard } from "./contexts/DashboardContext";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { KpiCards } from "./components/dashboard/KpiCards";
import { DashboardSection } from "./components/dashboard/DashboardSection";
import { Section } from "./types/dashboard"; 

export default function Dashboard() {
  // --- Hooks at the top level ---
  const {
    filters,
    setFilters,
    layoutConfig,
    isLoading,
    error,
  } = useDashboard();

  // Initialize activeSectionKey to null initially
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null);

  // --- Derived State Calculations (Memoized) ---
  const { filteredSections, filteredKpiCards, availableSectionKeys } = useMemo(() => {
    if (!layoutConfig) {
      // Return empty state if config is not loaded
      return { filteredSections: {}, filteredKpiCards: [], availableSectionKeys: [] };
    }
    // Use all KPI cards from the layout config
    const kpis = layoutConfig.kpiCards;
    
    // Filter sections if needed
    const sections = Object.fromEntries(
      Object.entries(layoutConfig.sections).filter(
        ([key]) => !key.includes('time') && !key.includes('operational')
      )
    );
    const keys = Object.keys(sections);
    return { filteredSections: sections, filteredKpiCards: kpis, availableSectionKeys: keys };
  }, [layoutConfig]); // Recalculate only when layoutConfig changes

  // --- Effect to Manage Active Section Key ---
  useEffect(() => {
    // Only run if we have available sections
    if (availableSectionKeys.length > 0) {
      // Check if the current key is valid among the available ones
      const isValid = activeSectionKey !== null && availableSectionKeys.includes(activeSectionKey);
      // If the key is null (initial state) or invalid, set it to the first available key
      if (!isValid) {
        setActiveSectionKey(availableSectionKeys[0]);
      }
    } else if (activeSectionKey !== null) {
      // Optional: Reset if no sections become available
      setActiveSectionKey(null);
    }
    // Dependencies ensure this runs when keys change or the key itself changes externally
  }, [availableSectionKeys, activeSectionKey]);

  // --- Early Returns (After Hooks) ---
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !layoutConfig) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error loading dashboard data: {error?.message || "Config not found"}</div>;
  }

  // --- Safety check before rendering section ---
  if (activeSectionKey === null) {
      // Handle state where no section is selected or available
      // Render layout without a specific section, or a message
       return (
           <DashboardLayout
             sectionsConfig={filteredSections}
             filters={filters}
             onFiltersChange={setFilters}
             activeSectionKey={''} // Pass empty string or handle in Layout/Nav
             onSectionChange={setActiveSectionKey}
           >
             <KpiCards cards={filteredKpiCards} />
             <div className="mt-6">No section selected or available.</div>
           </DashboardLayout>
       );
   }

  // Get the config for the currently active section
  const activeSectionConfig = filteredSections[activeSectionKey];

  // Determine if we should show KPI cards (only on dashboard section)
  const shouldShowKpiCards = activeSectionKey === 'dashboard';

  // --- Render the Dashboard ---
  return (
    <DashboardLayout
      sectionsConfig={filteredSections} // For nav/tabs
      filters={filters}
      onFiltersChange={setFilters}
      activeSectionKey={activeSectionKey} // Pass the validated key
      onSectionChange={setActiveSectionKey} // Allow user/nav to change it
    >
      {/* Only render KPI cards on the dashboard section */}
      {shouldShowKpiCards && <KpiCards cards={filteredKpiCards} />}

      {/* Render only the currently active section's content */}
      {activeSectionConfig ? (
        <div className="grid gap-6 mt-6">
          <DashboardSection sectionConfig={activeSectionConfig} />
        </div>
      ) : (
        // This case might be less likely now due to the safety check above,
        // but kept for robustness
        <div className="mt-6">No content for this section (ID: {activeSectionKey}).</div>
      )}
    </DashboardLayout>
  );
}