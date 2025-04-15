// Type definitions for the dashboard components

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface KpiCard {
  id: string;
  title: string;
  value: number | string;
  description: string;
  icon: string;
  showProgress?: boolean;
  progressValue?: number;
}

export interface ChartOptions {
  // General options
  categoryKey?: string;
  chartConfig?: Record<string, { label: string; color: string }>;
  className?: string;
  colorThresholds?: Array<{ value: number; color: string; label?: string }>;
  defaultData?: any;
  label?: string;
  min?: number;
  max?: number;
  title?: string;
  description?: string;
  value?: number;
  nameKey?: string;
  colorKey?: string;
  colors?: string[];
  colorScale?: string[];
  
  // Route map options
  performanceColors?: Array<{ threshold: number; color: string }>;
  
  // Bar chart options
  bars?: Array<{ dataKey: string; fill?: string; stackId?: string; colorKey?: string }>;
  
  // Line chart options
  lines?: Array<{ dataKey: string; stroke?: string }>;
  
  // Pie chart options
  pies?: Array<{ dataKey: string; nameKey: string; colors?: string[] }>;
  
  // Gauge chart options
  thresholds?: Array<{ value: number; color: string }>;
  
  // Heatmap options
  stations?: string[];
  xLabels?: string[];
  yLabels?: string[];
  minValue?: number;
  maxValue?: number;
  
  // Radar chart options
  axes?: Array<{ key: string; label?: string }>;
  
  // Scatter plot options
  xAxisKey?: string;
  yAxisKey?: string;
  zAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  zAxisLabel?: string;
  xDomain?: [string | number, string | number];
  yDomain?: [string | number, string | number];
  zDomain?: [number, number];
  scatterLabel?: string;
  groups?: Array<{ key: string; label?: string; filterKey: string; filterValue: any; color?: string }>;
  
  // Stacked area chart options
  areas?: Array<{ dataKey: string; fill?: string; label?: string }>;
}

export interface ChartConfig {
  id?: string;
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie' | 'heatmap' | 'heatmapChart' | 'gauge' | 'radar' | 'scatter' | 'stackedArea' | 'routeMap' | 'routePerformance';
  options?: ChartOptions;
  data?: any;
}

export interface ChartGroup {
  gridClass?: string;
  items: ChartConfig[];
}

export interface Section {
  title: string;
  charts: ChartGroup[];
}

export interface DashboardConfig {
  kpiCards: KpiCard[];
  stations: string[];
  sections: Record<string, Section>;
}

export interface FilterOptions {
  station: string;
  dateRange: DateRange;
}

export interface DashboardContextType {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  layoutConfig: DashboardConfig | null;
  componentData: Record<string, any> | null; 
  isLoading: boolean;
  error: Error | null;
  stations: string[]; 
}
