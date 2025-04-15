"use client"

import React from "react"

interface ChartColorsProps {
  children: React.ReactNode
}

export function ChartColors({ children }: ChartColorsProps) {
  return (
    <div
      style={
        {
          "--color-delay": "hsl(200, 70%, 50%)",
          "--color-count": "hsl(230, 70%, 50%)",
          "--color-avgDelay": "hsl(160, 70%, 50%)",
          "--color-onTimeRate": "hsl(260, 70%, 50%)",
          "--chart-1": "200, 70%, 50%",
          "--chart-2": "230, 70%, 50%",
          "--chart-3": "160, 70%, 50%",
          "--chart-4": "260, 70%, 50%",
          "--chart-5": "290, 70%, 50%",
          "--chart-6": "320, 70%, 50%",
          "--chart-7": "350, 70%, 50%",
          "--chart-8": "30, 70%, 50%",
          "--chart-9": "60, 70%, 50%",
          "--chart-10": "90, 70%, 50%",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
