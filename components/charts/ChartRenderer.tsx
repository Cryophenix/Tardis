"use client"

import { ChartConfig, FilterOptions } from '../../types/dashboard'
import { BarChartComponent } from './BarChartComponent'
import { LineChartComponent } from './LineChartComponent'
import { PieChartComponent } from './PieChartComponent'
import { HeatMapComponent } from './HeatMapComponent'
import { GaugeChartComponent } from './GaugeChartComponent'
import { useFilteredData } from '../../hooks/useFilteredData'

interface ChartRendererProps {
  chartConfig: ChartConfig
  filters: FilterOptions
}

/**
 * Factory component that renders the appropriate chart based on the chart configuration
 */
export function ChartRenderer({ chartConfig, filters }: ChartRendererProps) {
  const { type, title, description, data, options } = chartConfig
  const filteredData = useFilteredData(data, filters)

  switch (type) {
    case "bar":
      return (
        <BarChartComponent 
          title={title} 
          description={description} 
          data={filteredData} 
          options={options} 
        />
      )
    
    case "line":
      return (
        <LineChartComponent 
          title={title} 
          description={description} 
          data={filteredData} 
          options={options} 
        />
      )
    
    case "pie":
      return (
        <PieChartComponent 
          title={title} 
          description={description} 
          data={filteredData} 
          options={options} 
        />
      )
    
    case "heatmap":
      return (
        <HeatMapComponent 
          title={title} 
          description={description} 
          data={filteredData} 
          options={options} 
        />
      )
    
    case "gauge":
      return (
        <GaugeChartComponent 
          title={title} 
          description={description} 
          data={filteredData} 
          options={options} 
        />
      )
    
    default:
      return null
  }
}
