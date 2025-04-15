"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ChartConfig } from "../../types/dashboard";

interface StackedAreaChartComponentProps {
  config: ChartConfig;
  data: any;
}

export function StackedAreaChartComponent({ config, data }: StackedAreaChartComponentProps) {
  // Extract options from the config
  const options = config.options || {};
  
  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : [];
  
  // Extract category key (x-axis)
  const categoryKey = options.categoryKey || "date";
  
  // Extract areas configuration
  const areas = options.areas || [];
  
  // If no areas are configured, try to determine them from the first data item
  const dataKeys = areas.length > 0 
    ? areas.map(area => area.dataKey) 
    : (chartData.length > 0 && typeof chartData[0] === 'object' 
        ? Object.keys(chartData[0]).filter(key => key !== categoryKey && typeof chartData[0][key] === 'number') 
        : []);
  
  // Get colors from areas config or generate default colors
  const colors = areas.length > 0
    ? areas.map((area, index) => area.fill || `hsl(var(--chart-${(index % 10) + 1}))`)
    : dataKeys.map((_, index) => `hsl(var(--chart-${(index % 10) + 1}))`);
  
  // Get labels from areas config or use dataKeys
  const labels = areas.length > 0
    ? areas.map(area => area.label || area.dataKey)
    : dataKeys;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={categoryKey} 
            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          />
          <Legend />
          
          {/* Render areas in reverse order to ensure proper stacking */}
          {dataKeys.map((dataKey, index) => (
            <Area
              key={dataKey}
              type="monotone"
              dataKey={dataKey}
              name={labels[index] || dataKey}
              stackId="1"
              fill={colors[index]}
              stroke={colors[index]}
              fillOpacity={0.6}
            />
          )).reverse()}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
