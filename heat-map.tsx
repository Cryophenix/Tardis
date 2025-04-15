"use client"

import { useMemo } from "react"

interface HeatMapProps {
  data: any
  options: any
}

export function HeatMap({ data, options }: HeatMapProps) {
  // Use the data from props or fallback to default data
  const rawData = data || options.defaultData

  // Process the rawData (which might be an array or object) into the required object format
  const processedData = useMemo(() => {
    const result: { [key: string]: number } = {}
    if (Array.isArray(rawData)) {
      rawData.forEach((item: { route: string; avgDelay: number }) => {
        if (item.route && item.avgDelay !== undefined) {
          result[item.route] = item.avgDelay
        }
      })
    } else if (rawData && typeof rawData === 'object') {
      // Handle if data is already in the expected object format (or fallback)
      Object.assign(result, rawData)
    }
    return result
  }, [rawData])

  // Get stations from the data or options
  const stations = options.stations || [
    "Paris",
    "Lyon",
    "Marseille",
    "Bordeaux",
    "Lille",
    "Strasbourg",
    "Nantes",
    "Rennes",
  ]

  // Color scale function
  const getColor = (value: number) => {
    const thresholds = options.colorThresholds || [
      { value: 5, color: "bg-green-100" },
      { value: 8, color: "bg-green-200" },
      { value: 10, color: "bg-yellow-100" },
      { value: 12, color: "bg-yellow-200" },
      { value: 15, color: "bg-orange-100" },
      { value: 18, color: "bg-orange-200" },
      { value: Number.POSITIVE_INFINITY, color: "bg-red-200" },
    ]

    for (const threshold of thresholds) {
      if (value < threshold.value) {
        return threshold.color
      }
    }
    return thresholds[thresholds.length - 1].color
  }

  // Memoize the color legend to avoid recalculation
  const colorLegend = useMemo(() => {
    const thresholds = options.colorThresholds || [
      { value: 5, color: "bg-green-100", label: "3-5" },
      { value: 8, color: "bg-green-200", label: "5-8" },
      { value: 10, color: "bg-yellow-100", label: "8-10" },
      { value: 12, color: "bg-yellow-200", label: "10-12" },
      { value: 15, color: "bg-orange-100", label: "12-15" },
      { value: 18, color: "bg-orange-200", label: "15-18" },
      { value: Number.POSITIVE_INFINITY, color: "bg-red-200", label: "18+" },
    ]

    return thresholds.map((threshold: { value: number, color: string, label: string }, index: number) => (
      <div key={index} className="flex items-center gap-1">
        <div className={`h-3 w-3 ${threshold.color}`}></div>
        <span className="text-xs">{threshold.label}</span>
      </div>
    ))
  }, [options.colorThresholds])

  return (
    <div className="w-full">
      <div className="rounded-md border bg-white p-4">
        <h3 className="mb-2 text-lg font-medium">{options.title || 'Route Comparison'}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{options.description || 'Average delays between station pairs'}</p>
        
        <div className="w-full overflow-x-auto max-h-[500px]">
          <table className="w-full border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="p-2 text-left text-sm font-medium border min-w-[120px]">From / To</th>
                {stations.map((station: string) => (
                  <th key={station} className="p-2 text-sm font-medium border min-w-[90px]">
                    {station}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stations.map((departure: string) => (
                <tr key={departure}>
                  <td className="border p-2 text-sm font-medium sticky left-0 bg-white">{departure}</td>
                  {stations.map((arrival: string) => {
                    const key = `${departure}-${arrival}`
                    const value = processedData[key]

                    return (
                      <td key={arrival} className="border p-0">
                        {departure !== arrival ? (
                          <div
                            className={`flex h-12 w-full items-center justify-center ${getColor(value)}`}
                            title={`${departure} to ${arrival}: ${value} min avg delay`}
                          >
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ) : (
                          <div className="h-12 w-full bg-gray-100"></div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
