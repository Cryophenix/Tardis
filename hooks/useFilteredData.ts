import { useMemo } from 'react';
import { FilterOptions } from '../types/dashboard';

/**
 * Custom hook to filter data based on selected filters
 * @param data The data array to filter
 * @param filters The filter options to apply
 * @returns The filtered data array
 */
export function useFilteredData<T>(data: T[], filters: FilterOptions): T[] {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return data;

    let filteredData = [...data];

    // Apply station filter if not "all"
    if (filters.station !== "all") {
      const stationName = filters.station.replace(/-/g, " ");

      // Check if data has station property
      if (data[0] && 'station' in data[0]) {
        filteredData = filteredData.filter((item) => 
          (item as any).station.toLowerCase().includes(stationName.toLowerCase())
        );
      }
      // Check if data has route property
      else if (data[0] && 'route' in data[0]) {
        filteredData = filteredData.filter((item) => 
          (item as any).route.toLowerCase().includes(stationName.toLowerCase())
        );
      }
    }

    // In a real implementation, we would also filter by date range
    // This would be implemented based on the specific data structure

    return filteredData;
  }, [data, filters]);
}
