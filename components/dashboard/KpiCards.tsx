"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Train, Clock, TrendingUp, AlertTriangle, ThumbsUp } from "lucide-react"
import { KpiCard } from "../../types/dashboard"

interface KpiCardsProps {
  cards: KpiCard[]
}

export function KpiCards({ cards }: KpiCardsProps) {
  // Determine the grid columns based on the number of cards
  // For 5 cards, use a 5-column grid on large screens
  const gridClass = cards.length === 5
    ? "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8"
    : cards.length === 3
      ? "grid gap-4 grid-cols-1 md:grid-cols-3 mb-8"
      : "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8";
    
  return (
    <div className={gridClass}>
      {cards.map((card, index) => (
        <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
          {/* Fixed height header with flex layout to ensure consistent spacing */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-16">
            <CardTitle className="text-sm font-medium line-clamp-2">{card.title}</CardTitle>
            <div className="h-5 w-5 text-primary flex-shrink-0 ml-2">
              <span className="sr-only">{card.icon}</span>
              {card.icon === "Train" && <Train className="h-5 w-5" />}
              {card.icon === "Clock" && <Clock className="h-5 w-5" />}
              {card.icon === "TrendingUp" && <TrendingUp className="h-5 w-5" />}
              {card.icon === "AlertTriangle" && <AlertTriangle className="h-5 w-5" />}
              {card.icon === "ThumbsUp" && <ThumbsUp className="h-5 w-5" />}
            </div>
          </CardHeader>
          {/* Content with consistent spacing */}
          <CardContent className="flex-1 flex flex-col">
            {/* Fixed height for the value to ensure alignment */}
            <div className="text-3xl font-bold h-10 flex items-center">
              {typeof card.value === 'number' && 
               (card.title.toLowerCase().includes('rate') || 
                card.title.toLowerCase().includes('percentage') || 
                card.title.toLowerCase().includes('satisfaction'))
                ? `${card.value.toFixed(1)}%`
                : typeof card.value === 'number' && card.title.toLowerCase().includes('delay')
                ? `${card.value.toFixed(1)} min`
                : card.value}
            </div>
            {/* Fixed height for description */}
            <p className="text-xs text-muted-foreground mt-1 h-8">{card.description}</p>
            {/* Progress bar section with consistent height */}
            {card.showProgress && typeof card.value === 'number' ? (
              <div className="mt-auto pt-2 h-12">
                <Progress value={card.value} className="h-2" />
                <p className="text-xs text-right mt-1 text-muted-foreground">{card.value.toFixed(1)}%</p>
              </div>
            ) : (
              <div className="mt-auto pt-2 h-12"></div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
