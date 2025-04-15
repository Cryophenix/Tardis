"use client"

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
  Cell
} from "recharts";
import { ChartConfig } from "../../types/dashboard";

interface ScatterPlotComponentProps {
  config: ChartConfig;
  data: any;
}

export function ScatterPlotComponent({ config, data }: ScatterPlotComponentProps) {
  // Extract options from the config
  const options = config.options || {};
  
  // Ensure data is an array
  const chartData = Array.isArray(data) ? data : [];
  
  // Extract axis configuration
  const xAxisKey = options.xAxisKey || 'x';
  const yAxisKey = options.yAxisKey || 'y';
  const zAxisKey = options.zAxisKey; // Optional third dimension (bubble size)
  const nameKey = options.nameKey || 'name'; // For tooltip and legend
  const colorKey = options.colorKey; // Optional for custom colors
  
  // Determine domain for axes
  const xDomain = options.xDomain || ['auto', 'auto'];
  const yDomain = options.yDomain || ['auto', 'auto'];
  const zDomain = options.zDomain || [0, 100];
  
  // Determine if we should use custom colors
  const useCustomColors = Boolean(colorKey && chartData.some(item => item[colorKey]));
  
  // Get colors from options or use default theme colors
  const colors = options.colors || Array(10).fill(0).map((_, i) => `hsl(var(--chart-${(i % 10) + 1}))`);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey={xAxisKey} 
            name={options.xAxisLabel || xAxisKey} 
            domain={xDomain}
            label={{ 
              value: options.xAxisLabel || xAxisKey, 
              position: 'bottom',
              offset: 0,
              style: { textAnchor: 'middle' }
            }}
          />
          <YAxis 
            type="number" 
            dataKey={yAxisKey} 
            name={options.yAxisLabel || yAxisKey} 
            domain={yDomain}
            label={{ 
              value: options.yAxisLabel || yAxisKey, 
              angle: -90, 
              position: 'left',
              offset: 0,
              style: { textAnchor: 'middle' }
            }}
          />
          
          {/* Add Z-axis for bubble size if specified */}
          {zAxisKey && (
            <ZAxis 
              type="number" 
              dataKey={zAxisKey} 
              range={[20, 100]} 
              domain={zDomain}
            />
          )}
          
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            formatter={(value, name) => [value, name === xAxisKey ? (options.xAxisLabel || xAxisKey) : 
                                               name === yAxisKey ? (options.yAxisLabel || yAxisKey) : 
                                               name === zAxisKey ? (options.zAxisLabel || zAxisKey) : name]}
            labelFormatter={(label) => chartData[label]?.[nameKey] || ''}
          />
          
          <Legend />
          
          {options.groups ? (
            // If we have defined groups, render multiple scatters
            options.groups.map((group, index) => (
              <Scatter
                key={group.key || index}
                name={group.label || group.key || `Group ${index + 1}`}
                data={chartData.filter(item => item[group.filterKey] === group.filterValue)}
                fill={group.color || colors[index % colors.length]}
              />
            ))
          ) : (
            // Otherwise render a single scatter with optional custom colors per point
            <Scatter 
              name={options.scatterLabel || "Data Points"} 
              data={chartData}
              fill={colors[0]}
            >
              {useCustomColors && chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry[colorKey] || colors[index % colors.length]} 
                />
              ))}
            </Scatter>
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
