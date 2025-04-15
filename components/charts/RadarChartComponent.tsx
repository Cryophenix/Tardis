"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { ChartConfig } from "../../types/dashboard";

interface RadarChartComponentProps {
  config: ChartConfig;
  data: any;
}

export function RadarChartComponent({ config, data }: RadarChartComponentProps) {
  // Extract options from the config
  const options = config.options || {};
  
  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : [];
  
  // Extract axes configuration if available
  const axes = options.axes || [];
  
  // Get keys to display from axes or from first data item
  const dataKeys = axes.length > 0 
    ? axes.map(axis => axis.key) 
    : (chartData.length > 0 && typeof chartData[0] === 'object' 
        ? Object.keys(chartData[0]).filter(key => key !== 'name' && key !== 'service') 
        : []);
  
  // Get axis labels from configuration or use the keys
  const axisLabels = axes.length > 0
    ? axes.map(axis => axis.label || axis.key)
    : dataKeys;
  
  // Determine the name property to use
  const nameKey = options.nameKey || 'service';

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey={nameKey} 
            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: 'var(--foreground)', fontSize: 10 }}
          />
          
          {dataKeys.map((key, index) => (
            <Radar
              key={key}
              name={axisLabels[index] || key}
              dataKey={key}
              stroke={`hsl(var(--chart-${(index % 10) + 1}))`}
              fill={`hsl(var(--chart-${(index % 10) + 1}))`}
              fillOpacity={0.2}
            />
          ))}
          
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
