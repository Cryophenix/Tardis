"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartConfig, ChartOptions } from "../../types/dashboard";

interface PieChartComponentProps {
  config: ChartConfig;
  data: any;
}

export function PieChartComponent({ config, data }: PieChartComponentProps) {
  const options = config.options || {};
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {options.pies?.map((pie, pieIndex) => {
            const { dataKey, nameKey, colors } = pie;
            const effectiveDataKey = dataKey || 'value';
            const effectiveNameKey = nameKey || 'name';
            
            return (
              <Pie
                key={pieIndex}
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={pieIndex === 0 ? 80 : 110}
                innerRadius={pieIndex === 0 ? 0 : 90}
                fill="#8884d8"
                dataKey={effectiveDataKey}
                nameKey={effectiveNameKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      colors?.[index % (colors?.length || 1)] ||
                      `hsl(var(--chart-${(index % 10) + 1}))`
                    }
                  />
                ))}
              </Pie>
            );
          })}
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
