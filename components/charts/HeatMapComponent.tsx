"use client"

import { HeatMap } from "../../heat-map"
import { ChartConfig, ChartOptions } from "../../types/dashboard"

interface HeatMapComponentProps {
  config: ChartConfig;
  data: any;
}

export function HeatMapComponent({ config, data }: HeatMapComponentProps) {
  const options = config.options || {};

  return (
    <div className={`w-full ${options.className || ""}`}>
      <div className="w-full overflow-hidden">
        <HeatMap data={data} options={options} />
      </div>
    </div>
  )
}

/*
  OLD IMPLEMENTATION FOR REFERENCE
{{ 
  interface HeatMapComponentProps {
    title: string
    description: string
    data: any[]
    options: ChartOptions
  }

  export function HeatMapComponent({ title, description, data, options }: HeatMapComponentProps) {
    return (
      <div className={`w-full ${options.className || ""}`}>
        <div className="w-full overflow-hidden">
          <HeatMap data={data} options={options} />
        </div>
      </div>
    )
  }
}}
*/
