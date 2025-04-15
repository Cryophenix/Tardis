"use client"

import { useMemo } from "react";
import { ChartConfig } from "../../types/dashboard";

interface HeatmapChartComponentProps {
  config: ChartConfig;
  data: any;
}

export function HeatmapChartComponent({ config, data }: HeatmapChartComponentProps) {
  // Extract options from the config
  const options = config.options || {};
  
  // Get labels for x and y axes
  const xLabels = options.xLabels || [];
  const yLabels = options.yLabels || [];
  
  // Get color scale
  const colorScale = options.colorScale || ["#f3f4f6", "#1e40af"]; // Light to dark blue default
  
  // Process data - expecting format: [[x-index, y-index, value], ...]
  const heatmapData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    // Create a 2D array filled with nulls
    const grid = Array(yLabels.length).fill(null).map(() => 
      Array(xLabels.length).fill(null)
    );
    
    // Fill in the values from the data
    data.forEach(([x, y, value]) => {
      if (x >= 0 && x < xLabels.length && y >= 0 && y < yLabels.length) {
        grid[y][x] = value;
      }
    });
    
    return grid;
  }, [data, xLabels.length, yLabels.length]);
  
  // Function to get color based on value
  const getColor = (value: number | null) => {
    if (value === null) return "bg-gray-100";
    
    // Find min and max values for normalization
    const minValue = options.minValue || 0;
    const maxValue = options.maxValue || 100;
    
    // Normalize value between 0 and 1
    const normalizedValue = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
    
    // If custom color thresholds are provided, use them
    if (options.colorThresholds && Array.isArray(options.colorThresholds)) {
      for (const threshold of options.colorThresholds) {
        if (value < threshold.value) {
          return threshold.color;
        }
      }
      return options.colorThresholds[options.colorThresholds.length - 1].color;
    }
    
    // Otherwise, use the color scale with interpolation
    if (normalizedValue <= 0) return colorScale[0];
    if (normalizedValue >= 1) return colorScale[colorScale.length - 1];
    
    // Simple linear interpolation between two colors
    const index = normalizedValue * (colorScale.length - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    
    // Return the color at the nearest index
    return colorScale[Math.round(index)];
  };
  
  // Generate color legend
  const colorLegend = useMemo(() => {
    if (options.colorThresholds && Array.isArray(options.colorThresholds)) {
      return options.colorThresholds.map((threshold, index) => (
        <div key={index} className="flex items-center gap-1">
          <div className={`h-3 w-3 ${threshold.color}`}></div>
          <span className="text-xs">{threshold.label || `< ${threshold.value}`}</span>
        </div>
      ));
    }
    
    // Generate a simple gradient legend
    const steps = 5;
    return Array(steps).fill(0).map((_, index) => {
      const value = options.minValue + (index / (steps - 1)) * (options.maxValue - options.minValue);
      return (
        <div key={index} className="flex items-center gap-1">
          <div className={`h-3 w-3 ${getColor(value)}`}></div>
          <span className="text-xs">{Math.round(value)}</span>
        </div>
      );
    });
  }, [options.colorThresholds, options.minValue, options.maxValue, getColor]);

  return (
    <div className="w-full">
      <div className="rounded-md border bg-white p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium">{config.title || 'Heatmap'}</h3>
            <p className="text-sm text-muted-foreground">{config.description || 'Data visualization'}</p>
          </div>
          <div className="flex flex-col gap-1">
            {colorLegend}
          </div>
        </div>
        
        <div className="w-full overflow-x-auto max-h-[500px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="p-2 text-left text-sm font-medium border"></th>
                {xLabels.map((label, index) => (
                  <th key={index} className="p-2 text-sm font-medium border min-w-[80px] text-center">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yLabels.map((yLabel, yIndex) => (
                <tr key={yIndex}>
                  <td className="border p-2 text-sm font-medium sticky left-0 bg-white min-w-[120px]">
                    {yLabel}
                  </td>
                  {xLabels.map((_, xIndex) => {
                    const value = heatmapData[yIndex]?.[xIndex];
                    return (
                      <td key={xIndex} className="border p-0">
                        <div
                          className={`flex h-12 w-full items-center justify-center ${getColor(value)}`}
                          title={`${yLabel} / ${xLabels[xIndex]}: ${value !== null ? value : 'N/A'}`}
                        >
                          <span className="text-sm font-medium">
                            {value !== null ? value : ''}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
