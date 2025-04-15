"use client"

import { useState } from "react";
import { RouteMapComponent } from "../charts/RouteMapComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartConfig } from "../../types/dashboard";

interface RoutePerformanceViewProps {
  config: ChartConfig;
  data: any[];
}

type SortField = "route" | "onTimePercentage" | "averageDelay" | "cancelRate";
type SortDirection = "asc" | "desc";

export function RoutePerformanceView({ config, data }: RoutePerformanceViewProps) {
  const [sortField, setSortField] = useState<SortField>("onTimePercentage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  // Function to toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  // Sort data based on current sort field and direction
  const sortedData = [...data].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (valueA === undefined || valueB === undefined) return 0;
    
    const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });
  
  // Function to get the color for a performance value
  const getPerformanceColor = (value: number) => {
    if (value < 40) return "text-red-600 font-semibold";
    if (value < 60) return "text-amber-600 font-semibold";
    if (value < 80) return "text-green-600 font-semibold";
    return "text-emerald-700 font-semibold";
  };
  
  // Function to get the color for a delay value
  const getDelayColor = (value: number) => {
    if (value > 12) return "text-red-600";
    if (value > 8) return "text-amber-600";
    if (value > 5) return "text-amber-500";
    return "text-green-600";
  };
  
  // Function to get the color for a cancellation rate
  const getCancellationColor = (value: number) => {
    if (value > 4) return "text-red-600";
    if (value > 3) return "text-amber-600";
    if (value > 2) return "text-amber-500";
    return "text-green-600";
  };
  
  // Function to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map View */}
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Route Performance Map</CardTitle>
          <p className="text-sm text-muted-foreground">
            Interactive map of train routes colored by on-time performance
          </p>
        </CardHeader>
        <CardContent>
          <RouteMapComponent config={config} data={data} />
          <div className="mt-2 text-xs text-gray-500 italic">
            Hover over routes to see detailed performance metrics
          </div>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Route Performance Data</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed performance metrics by route
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("route")}
                      className="font-medium text-xs flex items-center"
                    >
                      Route {renderSortIndicator("route")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("onTimePercentage")}
                      className="font-medium text-xs flex items-center"
                    >
                      On-time % {renderSortIndicator("onTimePercentage")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("averageDelay")}
                      className="font-medium text-xs flex items-center"
                    >
                      Avg. Delay {renderSortIndicator("averageDelay")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => toggleSort("cancelRate")}
                      className="font-medium text-xs flex items-center"
                    >
                      Cancel % {renderSortIndicator("cancelRate")}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((route, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{route.route}</TableCell>
                    <TableCell className={getPerformanceColor(route.onTimePercentage)}>
                      {route.onTimePercentage.toFixed(1)}%
                    </TableCell>
                    <TableCell className={getDelayColor(route.averageDelay)}>
                      {route.averageDelay !== undefined ? 
                        `${route.averageDelay.toFixed(1)} min` : 
                        "N/A"}
                    </TableCell>
                    <TableCell className={getCancellationColor(route.cancelRate)}>
                      {route.cancelRate !== undefined ? 
                        `${route.cancelRate.toFixed(1)}%` : 
                        "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
