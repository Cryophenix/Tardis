"use client"

import { useState, useEffect } from "react";
import { ChartConfig } from "../../types/dashboard";

interface RouteMapComponentProps {
  config: ChartConfig;
  data: any;
}

// Define city coordinates to match the new SVG map of France
const CITY_COORDINATES: Record<string, [number, number]> = {
  // Major cities with their coordinates - calibrated to match the SVG
  "Paris": [370, 300],
  "Marseille": [450, 710],
  "Lyon": [450, 450],
  "Toulouse": [300, 650],
  "Nice": [550, 650],
  "Nantes": [200, 400],
  "Strasbourg": [550, 300],
  "Bordeaux": [250, 550],
  "Lille": [350, 200],
  "Rennes": [200, 350],
  "Reims": [400, 250],
  "Saint-Étienne": [430, 500],
  "Toulon": [470, 730],
  "Le Havre": [250, 250],
  "Dijon": [450, 400]
};

// Function to extract city names from route string (e.g., "Paris-Lyon" => ["Paris", "Lyon"])
const extractCitiesFromRoute = (route: string): [string, string] => {
  const cities = route.split('-');
  if (cities.length !== 2) {
    console.warn(`Invalid route format: ${route}. Expected format: "CityA-CityB"`);  
    return ["", ""];
  }
  return [cities[0], cities[1]];
};

export function RouteMapComponent({ config, data }: RouteMapComponentProps) {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [citiesInData, setCitiesInData] = useState<Set<string>>(new Set());
  
  // Get chart options from config
  const options = config.options || {};
  
  // Ensure data is an array
  const routes = Array.isArray(data) ? data : [];
  
  // Get performance threshold colors (or use defaults)
  const performanceColors: Array<{threshold: number, color: string}> = options.performanceColors || [
    { threshold: 40, color: "#ef4444" },  // Red for poor performance
    { threshold: 60, color: "#f59e0b" },  // Amber for medium performance
    { threshold: 80, color: "#10b981" },  // Green for good performance
    { threshold: 100, color: "#047857" }  // Dark green for excellent performance
  ];
  
  // Function to get color based on performance
  const getPerformanceColor = (performance: number) => {
    for (const { threshold, color } of performanceColors) {
      if (performance <= threshold) {
        return color;
      }
    }
    return performanceColors[performanceColors.length - 1].color;
  };
  
  // Function to get route details
  const getRouteDetails = (routeName: string) => {
    return routes.find(route => route.route === routeName);
  };
  
  // Function to draw a route between two cities
  const drawRoute = (from: string, to: string, performance: number) => {
    const fromCoords = CITY_COORDINATES[from];
    const toCoords = CITY_COORDINATES[to];
    
    if (!fromCoords || !toCoords) return null;
    
    const routeName = `${from}-${to}`;
    const isHovered = hoveredRoute === routeName;
    const color = getPerformanceColor(performance);
    
    // Calculate control point for curved line (simple bezier)
    const midX = (fromCoords[0] + toCoords[0]) / 2;
    const midY = (fromCoords[1] + toCoords[1]) / 2;
    const distance = Math.sqrt(
      Math.pow(toCoords[0] - fromCoords[0], 2) + 
      Math.pow(toCoords[1] - fromCoords[1], 2)
    );
    
    // Perpendicular offset for curve - increased for better visibility on new map
    const offsetX = (toCoords[1] - fromCoords[1]) * 0.3;
    const offsetY = -(toCoords[0] - fromCoords[0]) * 0.3;
    
    const controlX = midX + offsetX;
    const controlY = midY + offsetY;
    
    // Create SVG path
    const path = `M ${fromCoords[0]} ${fromCoords[1]} Q ${controlX} ${controlY} ${toCoords[0]} ${toCoords[1]}`;
    
    return (
      <path
        key={routeName}
        d={path}
        stroke={color}
        strokeWidth={isHovered ? 6 : 4}
        fill="none"
        strokeLinecap="round"
        onMouseEnter={() => setHoveredRoute(routeName)}
        onMouseLeave={() => setHoveredRoute(null)}
        className="transition-all duration-200"
      />
    );
  };
  
  // Parse route names and draw them - only for routes where both cities have coordinates
  const routePaths = routes.map((route, index) => {
    // Extract source and destination from route name (e.g., "Paris-Lyon")
    const [source, destination] = extractCitiesFromRoute(route.route);
    
    // Get coordinates for source and destination
    const sourceCoords = CITY_COORDINATES[source];
    const destCoords = CITY_COORDINATES[destination];
    
    if (!sourceCoords || !destCoords) {
      // Skip routes where we don't have coordinates for both cities
      return null;
    }
    
    // Draw route
    return drawRoute(source, destination, route.onTimePercentage);
  }).filter(Boolean); // Remove null routes
  
  // Extract all cities from the routes and check if they exist in our coordinates
  useEffect(() => {
    const cities = new Set<string>();
    routes.forEach(route => {
      const [source, destination] = extractCitiesFromRoute(route.route);
      if (source && CITY_COORDINATES[source]) {
        cities.add(source);
      }
      if (destination && CITY_COORDINATES[destination]) {
        cities.add(destination);
      }
    });
    setCitiesInData(cities);
  }, [routes]);
  
  // Render city dots and labels - only for cities that exist in our data
  const cityMarkers = Object.entries(CITY_COORDINATES)
    .filter(([city]) => citiesInData.has(city)) // Only show cities that are in routes and have coordinates
    .map(([city, [x, y]]) => (
      <g key={city}>
        <circle
          cx={x}
          cy={y}
          r={6}
          fill="#3b82f6"
          stroke="#ffffff"
          strokeWidth={2}
        />
        <text
          x={x}
          y={y - 12}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill="#374151"
        >
          {city}
        </text>
      </g>
    ));
  
  // Render route details panel
  const renderRouteDetails = () => {
    if (!hoveredRoute) return null;
    
    const [from, to] = hoveredRoute.split('-');
    const details = getRouteDetails(hoveredRoute);
    
    if (!details) return null;
    
    return (
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
        <h3 className="font-bold text-lg mb-2">{from} to {to}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">On-time:</span>
            <span className="font-medium">{details.onTimePercentage.toFixed(1)}%</span>
          </div>
          {details.averageDelay !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Delay:</span>
              <span className="font-medium">{details.averageDelay.toFixed(1)} min</span>
            </div>
          )}
          {details.cancelRate !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cancellations:</span>
              <span className="font-medium">{details.cancelRate.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render performance legend
  const renderLegend = () => {
    return (
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <h4 className="font-medium text-sm mb-2">On-time Performance</h4>
        <div className="flex items-center space-x-4">
          {performanceColors.map((item: {threshold: number, color: string}, index: number) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 mr-1 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs">
                {index === 0 ? `0-${item.threshold}%` : 
                 `${performanceColors[index-1].threshold}-${item.threshold}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Main component render
  return (
    <div className="relative h-[600px] w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      {/* France map with SVG background */}
      <div className="absolute inset-0 z-0">
        <img src="/france_outline.svg" alt="France outline" className="w-full h-full object-contain" />
      </div>
      
      <svg 
        viewBox="0 0 800 900" 
        className="w-full h-full relative z-10"
      >
        {/* Draw routes */}
        <g className="routes">{routePaths}</g>
        
        {/* Draw city markers */}
        <g className="cities">{cityMarkers}</g>
      </svg>
      
      {/* Route details panel */}
      {renderRouteDetails()}
      
      {/* Performance legend */}
      {renderLegend()}
      
      {/* City labels - render on top for better visibility */}
      <g className="city-labels">
        {Object.entries(CITY_COORDINATES)
          .filter(([city]) => citiesInData.has(city))
          .map(([city, [x, y]]) => (
            <text
              key={`label-${city}`}
              x={x}
              y={y - 12}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill="#1e40af"
              stroke="#ffffff"
              strokeWidth={0.5}
              paintOrder="stroke"
            >
              {city}
            </text>
          ))}
      </g>
      
      {/* No data message if applicable */}
      {routes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20">
          <div className="text-center p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">No Route Data Available</h3>
            <p className="text-gray-600 mt-2">Please check your data source or configuration.</p>
          </div>
        </div>
      )}
    </div>
  );
}
