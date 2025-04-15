"use client"

import { useMemo } from "react"

interface GaugeChartProps {
  value: number
  min?: number
  max?: number
  label?: string
  thresholds?: Array<{
    value: number
    color: string
  }>
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  label = "",
  thresholds = [
    { value: 33, color: "#ef4444" },
    { value: 66, color: "#f59e0b" },
    { value: 100, color: "#10b981" },
  ],
}: GaugeChartProps) {
  // Calculate the percentage of the value within the range
  const percentage = ((value - min) / (max - min)) * 100

  // Calculate the angle for the gauge needle
  const angle = (percentage * 180) / 100 - 90

  // Determine the color based on thresholds
  const color = useMemo(() => {
    for (const threshold of thresholds) {
      if (percentage <= threshold.value) {
        return threshold.color
      }
    }
    return thresholds[thresholds.length - 1].color
  }, [percentage, thresholds])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Gauge background */}
        <div className="absolute w-48 h-48 rounded-full border-8 border-gray-200 top-0"></div>

        {/* Gauge colored arc */}
        <div
          className="absolute w-48 h-48 rounded-full border-8 top-0"
          style={{
            borderColor: color,
            clipPath: "polygon(50% 50%, 0 0, 0 50%, 100% 50%, 100% 0)",
          }}
        ></div>

        {/* Gauge needle */}
        <div
          className="absolute top-0 left-24 w-1 h-24 bg-gray-800 origin-bottom"
          style={{ transform: `rotate(${angle}deg)` }}
        ></div>

        {/* Gauge center point */}
        <div className="absolute top-0 left-24 w-4 h-4 rounded-full bg-gray-800 transform -translate-x-1/2"></div>
      </div>

      {/* Value display */}
      <div className="mt-4 text-center">
        <div className="text-3xl font-bold">{value}%</div>
        {label && <div className="text-sm text-muted-foreground">{label}</div>}
      </div>

      {/* Gauge scale */}
      <div className="flex justify-between w-48 mt-2">
        <span className="text-xs">{min}%</span>
        <span className="text-xs">{max / 2}%</span>
        <span className="text-xs">{max}%</span>
      </div>
    </div>
  )
}
