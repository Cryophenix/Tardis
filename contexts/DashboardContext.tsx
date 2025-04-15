// contexts/DashboardContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardContextType, FilterOptions, DashboardConfig } from '../types/dashboard';

// Import the static config/data
import dashboardConfigData from '../dashboard-config.json';

// Type assertion for the imported JSON data - using 'unknown' to bypass complex nested type issues
const typedDashboardConfigData = dashboardConfigData as unknown as DashboardConfig;

// Default state for the context
const defaultContextValue: DashboardContextType = {
  filters: {
    station: 'all', // Default to 'all' stations
    dateRange: {
      from: new Date(new Date().getFullYear(), 0, 1), // Default Jan 1st of current year
      to: new Date(), // Default to today
    },
  },
  setFilters: () => {},
  layoutConfig: null,
  componentData: null,
  isLoading: true,
  error: null,
  stations: [],
};

// Create the context
const DashboardContext = createContext<DashboardContextType>(defaultContextValue);

// Create the provider component
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterOptions>(defaultContextValue.filters);
  const [layoutConfig, setLayoutConfig] = useState<DashboardConfig | null>(null);
  const [componentData, setComponentData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load layout config and stations once on mount
  useEffect(() => {
    setLayoutConfig(typedDashboardConfigData);
    // Simulate initial data fetch
    setIsLoading(true);
    // Mock API call - structure data by ID
    try {
      const processedData: Record<string, any> = {};
      typedDashboardConfigData.kpiCards.forEach(card => {
        processedData[card.id] = card; // Store the whole card object for now
      });
      Object.values(typedDashboardConfigData.sections).forEach(section => {
        section.charts.forEach(chartGroup => {
          chartGroup.items.forEach(item => {
            processedData[item.id] = item; // Store the whole chart config object including its data/options
          });
        });
      });
      setComponentData(processedData);
      setError(null);
    } catch (err) {
      console.error("Error processing dashboard data:", err);
      setError(err instanceof Error ? err : new Error('Failed to process data'));
      setComponentData(null);
    }
    setIsLoading(false);
  }, []); // Runs only once on mount

  // --- MOCK FILTER EFFECT --- 
  // In a real app, this useEffect would trigger an API call based on filters.
  // Here, we just log the filter change, as our static data isn't filterable.
  useEffect(() => {
    console.log("Filters changed (mock effect):", filters);
    // If we had an API: 
    // setIsLoading(true);
    // fetchDashboardData(filters).then(data => { 
    //   setComponentData(data); 
    //   setIsLoading(false); 
    // }).catch(err => { ... });

    // Since data is static, we don't refetch/reprocess here in the mock.
    // If filtering *were* possible on the static data, logic would go here.

  }, [filters]);

  const stations = layoutConfig?.stations || [];

  return (
    <DashboardContext.Provider value={{ 
        filters, 
        setFilters, 
        layoutConfig, 
        componentData, 
        isLoading, 
        error,
        stations
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for easy consumption
export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
