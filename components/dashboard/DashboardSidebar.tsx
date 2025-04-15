"use client"

import { Train, LayoutDashboard, MapPin, BarChart3, PieChartIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { DashboardConfig } from "../../types/dashboard"

interface DashboardSidebarProps {
  config: DashboardConfig
  activeSection: string
  onSectionChange: (section: string) => void
}

export function DashboardSidebar({ config, activeSection, onSectionChange }: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2">
          <Train className="h-6 w-6" />
          <div className="font-semibold text-lg">SNCF Analytics</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeSection === "dashboard"}
              onClick={() => onSectionChange("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {Object.keys(config.sections)
            .filter(sectionKey => !sectionKey.includes('time')) // Filter out time-based sections
            .map((sectionKey) => (
              <SidebarMenuItem key={sectionKey}>
                <SidebarMenuButton
                  isActive={activeSection === sectionKey}
                  onClick={() => onSectionChange(sectionKey)}
                >
                  {sectionKey === "delayAnalysis" && <BarChart3 className="h-4 w-4" />}
                  {sectionKey === "routePerformance" && <MapPin className="h-4 w-4" />}
                  {sectionKey === "operationalInsights" && <PieChartIcon className="h-4 w-4" />}
                  <span>{config.sections[sectionKey].title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">Data updated: April 15, 2025</div>
      </SidebarFooter>
    </Sidebar>
  )
}
