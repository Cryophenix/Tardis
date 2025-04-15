"use client"

import { GaugeChart } from "../../gauge-chart"; 
import { ChartConfig, ChartOptions } from "../../types/dashboard";

interface GaugeChartComponentProps {
  config: ChartConfig;
  data: any; 
}

export function GaugeChartComponent({ config, data }: GaugeChartComponentProps) {
  const options = config.options || {};

  let value = 0;
  
  if (data !== null && data !== undefined) {
    if (typeof data === 'number') {
      value = data;
    } else if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0];
      if (typeof firstItem === 'number') {
        value = firstItem;
      } else if (typeof firstItem === 'object' && firstItem !== null) {
        if (firstItem.value !== undefined && typeof firstItem.value === 'number') {
          value = firstItem.value;
        } else {
          const numericKeys = Object.keys(firstItem).filter(key => 
            typeof firstItem[key] === 'number'
          );
          if (numericKeys.length > 0) {
            value = firstItem[numericKeys[0]];
          }
        }
      }
    } else if (typeof data === 'object' && data.value !== undefined && typeof data.value === 'number') {
       value = data.value;
    }
  }
  
  if (value === 0 && options.value !== undefined && typeof options.value === 'number') {
    value = options.value;
  }
  
  const thresholds = options.thresholds || [
    { value: 33, color: "#ef4444" }, 
    { value: 66, color: "#f59e0b" }, 
    { value: 100, color: "#10b981" } 
  ];
  
  return (
    <div className="h-[300px] w-full flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-2">
        <GaugeChart 
          value={value} 
          min={options.min ?? 0} 
          max={options.max ?? 100} 
          label={options.label || config.title || ''}
          thresholds={thresholds} 
        />
      </div>
      <div className="flex justify-between px-10 -mt-8 text-sm text-gray-500">
        <span>{options.min ?? 0}%</span> 
        <span>{options.max ?? 100}%</span>
      </div>
    </div>
  )
}
