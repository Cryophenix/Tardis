"use client"

import Dashboard from "../dashboard"
import { DashboardProvider } from "../contexts/DashboardContext";

export default function SyntheticV0PageForDeployment() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}