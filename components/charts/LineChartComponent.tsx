"use client"

import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend,
} from "recharts";
import { ChartConfig, ChartOptions } from "../../types/dashboard"; // Import ChartConfig

// Define the new props interface
interface LineChartComponentProps {
  config: ChartConfig;
  data: any; // Keep data flexible
}

// Update component signature and destructuring
export function LineChartComponent({ config, data }: LineChartComponentProps) {
  // Extract options from the config prop, providing defaults
  const options = config.options || {};
  const safeOptions = {
    ...options,
    categoryKey: options.categoryKey || "date", // Default category key
  };

  // Handle different data formats (using the passed 'data')
  const formattedData = Array.isArray(data) ? data.map((item, index) => {
    // If data is an array of numbers, convert to objects
    if (typeof item === 'number') {
      return { value: item, index: `Item ${index + 1}` }; // Assign an 'index' key
    }
    return item;
  }) : [];
  
  // Determine data keys for lines dynamically
  let dataKeys: string[] = [];
  if (formattedData.length > 0) {
    const firstItem = formattedData[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      dataKeys = Object.keys(firstItem).filter(key => 
        key !== safeOptions.categoryKey && 
        key !== 'index' && // Exclude the generated index key
        typeof firstItem[key] === 'number' // Only consider numeric keys for lines
      );
    }
  }
  
  // If no data keys found and we have a numeric 'value' key (from formatting numbers)
  if (dataKeys.length === 0 && formattedData.some(item => typeof item?.value === 'number')) {
    dataKeys = ['value'];
  }

  // Determine the X-axis data key based on available keys in formattedData
  const xAxisDataKey = formattedData[0]?.[safeOptions.categoryKey] ? safeOptions.categoryKey :
                       formattedData[0]?.date ? "date" : // Fallback if categoryKey isn't 'date'
                       formattedData[0]?.month ? "month" : // Fallback for month
                       "index"; // Final fallback to generated index
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData} // Use the processed data
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisDataKey} // Use determined X-axis key
            angle={0}
            textAnchor="middle"
            height={30}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ bottom: 0, left: 25 }} />
          
          {/* Render lines based on determined keys or config options */}
          {dataKeys.length > 0 ? (
            dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(var(--chart-${(index % 10) + 1}))`} // Use dynamic color
                activeDot={{ r: 8 }}
              />
            ))
          ) : (
            // Fallback to using line definitions from config if dynamic keys failed
            safeOptions.lines?.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke || `hsl(var(--chart-${(index % 10) + 1}))`} // Use dynamic color
                activeDot={{ r: 8 }}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
