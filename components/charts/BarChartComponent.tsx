"use client"

import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
  Cell
} from "recharts";
import { ChartConfig, ChartOptions } from "../../types/dashboard";

interface BarChartComponentProps {
  config: ChartConfig;
  data: any;
}

type BarItem = NonNullable<ChartConfig['options']['bars']>[number];

export function BarChartComponent({ config, data }: BarChartComponentProps) {
  const options = config.options || {};

  const hasStationData = data && Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null && 
                       'station' in data[0] && 'delay' in data[0];
                       
  const hasColorData = options.bars?.some(bar => bar.colorKey) && 
                     data && Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null &&
                     'color' in data[0];
  
  const isNumericArray = Array.isArray(data) && data.length > 0 && typeof data[0] === 'number';

  const chartData = isNumericArray
    ? data.map((value, index) => ({ value, index: `Item ${index + 1}` }))
    : data;

  const xAxisDataKey = isNumericArray ? "index" : (options.categoryKey || "index");

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {hasStationData ? (
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 65, left: 70, bottom: 5 }}
            barSize={24}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 'dataMax']} 
              tickCount={6}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              dataKey="station" 
              type="category" 
              width={65} 
              tick={{ fontSize: 11 }}
              axisLine={false}
            />
            <Tooltip formatter={(value) => [`${value} min`, 'Delay']} />
            <Bar 
              dataKey="delay" 
              name="Delay" 
              fill="hsl(var(--chart-1))" 
              label={{
                position: 'right',
                formatter: (value: number) => `${value}`,
                fill: '#333',
                fontSize: 11,
                offset: 5
              }}
              animationDuration={500}
            />
          </BarChart>
        ) : (
          <BarChart
            data={chartData}
            margin={hasColorData ? 
              { top: 30, right: 10, left: 10, bottom: 20 } : 
              { top: 20, right: 30, left: 20, bottom: 10 }
            }
            barSize={hasColorData ? 40 : undefined}
            barGap={hasColorData ? 5 : undefined}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={!hasColorData} />
            <XAxis 
              dataKey={xAxisDataKey}
              tickLine={!hasColorData && false}
              axisLine={!hasColorData && false}
              angle={hasColorData ? 0 : -45} 
              textAnchor={hasColorData ? "middle" : "end"} 
              height={hasColorData ? 30 : 10} 
              tick={!hasColorData ? false : { fontSize: 13 }}
            />
            <YAxis />
            <Tooltip />
            {isNumericArray ? (
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-1))"
                name="Value"
              />
            ) : hasColorData ? (
              options.bars?.map((bar, index) => {
                const barItem = bar as BarItem;
                return (
                  <Bar
                    key={index}
                    dataKey={barItem.dataKey}
                    name={options.chartConfig?.[barItem.dataKey]?.label || barItem.dataKey}
                    fill={barItem.fill || `hsl(var(--chart-${(index % 10) + 1}))`}
                    stackId={barItem.stackId}
                    isAnimationActive={true}
                    animationDuration={750}
                    animationEasing="ease-out"
                    label={{
                      position: 'top',
                      fill: '#333',
                      fontSize: 13,
                      fontWeight: 500
                    }}
                  >
                    {chartData.map((entry: any, i: number) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Bar>
                );
              })
            ) : (
              options.bars?.map((bar, index) => (
                <Bar
                  key={index}
                  dataKey={bar.dataKey}
                  fill={bar.fill || `hsl(var(--chart-${(index % 10) + 1}))`}
                  stackId={bar.stackId}
                />
              ))
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
