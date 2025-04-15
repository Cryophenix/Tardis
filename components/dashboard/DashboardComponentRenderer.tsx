"use client";

import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext'; // Assuming @ is configured for src
import { ChartConfig } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// --- Import Actual Chart Components --- 
import { BarChartComponent } from "../charts/BarChartComponent";
import { LineChartComponent } from "../charts/LineChartComponent";
import { HeatMapComponent } from "../charts/HeatMapComponent";
import { HeatmapChartComponent } from "../charts/HeatmapChartComponent";
import { GaugeChartComponent } from "../charts/GaugeChartComponent";
import { PieChartComponent } from "../charts/PieChartComponent";
import { RadarChartComponent } from "../charts/RadarChartComponent";
import { ScatterPlotComponent } from "../charts/ScatterPlotComponent";
import { StackedAreaChartComponent } from "../charts/StackedAreaChartComponent";
import { RouteMapComponent } from "../charts/RouteMapComponent";
import { RoutePerformanceView } from "./RoutePerformanceView";

// --- Placeholder Display Components --- 
// Kept for other chart types until they are integrated
const PlaceholderDisplayComponent = ({ config, data }: { config: ChartConfig, data: any }) => (
  <div className="mt-2">
    <p className="text-xs text-gray-500">Displaying: {config.type}</p>
    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);
// const BarChartDisplay = PlaceholderDisplayComponent; // Replaced
// const LineChartDisplay = PlaceholderDisplayComponent; // Replaced
// const GaugeDisplay = PlaceholderDisplayComponent; // Replaced
// const PieChartDisplay = PlaceholderDisplayComponent; // Replaced
// --- End Placeholder Display Components ---

interface DashboardComponentRendererProps {
  componentConfig: ChartConfig;
}

export const DashboardComponentRenderer: React.FC<DashboardComponentRendererProps> = ({ componentConfig }) => {
  const { componentData, isLoading: isContextLoading, error: contextError } = useDashboard();

  // Derive state for this specific component
  const isLoading = isContextLoading; // For now, component loading mirrors context loading
  const error = contextError;
  const data = !isLoading && !error && componentData ? componentData[componentConfig.id] : null;

  // Find the actual data payload within the stored item (currently the whole config)
  // This might need adjustment based on final data structure from API
  const displayData = data ? (data.data || data.value || data.options || data) : null;

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-sm text-gray-500">Loading...</p>; // Replace with Skeleton
    }
    if (error) {
      return <p className="text-sm text-red-500">Error loading data.</p>;
    }
    if (!data) {
      return <p className="text-sm text-orange-500">Data unavailable (ID: {componentConfig.id}).</p>;
    }

    // Switch based on component type
    switch (componentConfig.type) {
      case 'bar':
        // Bar chart for categorical data
        return <BarChartComponent config={componentConfig} data={displayData} />;
      case 'line':
        // Line chart for time series data
        return <LineChartComponent config={componentConfig} data={displayData} />;
      case 'gauge':
        // Gauge chart for single value with thresholds
        return <GaugeChartComponent config={componentConfig} data={displayData} />;
      case 'heatmap':
        // Route-based heatmap (station to station)
        return <HeatMapComponent config={componentConfig} data={displayData} />;
      case 'heatmapChart':
        // Generic heatmap for any grid data
        return <HeatmapChartComponent config={componentConfig} data={displayData} />;
      case 'pie':
        // Pie chart for part-to-whole relationships
        return <PieChartComponent config={componentConfig} data={displayData} />;
      case 'radar':
        // Radar chart for multivariate data
        return <RadarChartComponent config={componentConfig} data={displayData} />;
      case 'scatter':
        // Scatter plot for correlation analysis
        return <ScatterPlotComponent config={componentConfig} data={displayData} />;
      case 'stackedArea':
        // Stacked area chart for part-to-whole over time
        return <StackedAreaChartComponent config={componentConfig} data={displayData} />;
      case 'routeMap':
        // Map of routes with performance indicators
        return <RouteMapComponent config={componentConfig} data={displayData} />;
      case 'routePerformance':
        // Combined route performance view with map and table
        return <RoutePerformanceView config={componentConfig} data={displayData} />;
      default:
        // Fallback for unknown types or if component not ready
        return <p className="text-sm text-red-500">Unknown component type: {componentConfig.type}</p>;
    }
  };

  // Render component within a Card structure (similar to original)
  // Special handling for heatmap which might not need a card
  if (componentConfig.type === 'heatmap') {
      return (
          <CardContent className="pt-0 h-[350px]">
              {renderContent()}
          </CardContent>
      );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{componentConfig.title}</CardTitle>
        {componentConfig.description && (
          <p className="text-sm text-muted-foreground">{componentConfig.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
