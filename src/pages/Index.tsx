import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import SensorGraphs from "@/components/SensorGraphs";
import PhenologyStage from "@/components/PhenologyStage";
import NutritionPlanner from "@/components/NutritionPlanner";
import HealthScore from "@/components/HealthScore";
import AlertsPanel from "@/components/AlertsPanel";
import Chatbot from "@/components/Chatbot";
import {
  Activity,
  Leaf,
  MessageSquare,
  Bell,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 w-full justify-center">
            <img
              src="/logo.jpg"
              alt="Agrosentech Logo"
              className="h-12 rounded-xl"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 gap-2 bg-card p-2 h-auto">
            <TabsTrigger value="dashboard" className="flex flex-col gap-1 py-3">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="graphs" className="flex flex-col gap-1 py-3">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Graphs</span>
            </TabsTrigger>
            <TabsTrigger value="phenology" className="flex flex-col gap-1 py-3">
              <Leaf className="h-4 w-4" />
              <span className="text-xs">Phenology</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex flex-col gap-1 py-3">
              <ClipboardList className="h-4 w-4" />
              <span className="text-xs">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex flex-col gap-1 py-3">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Health</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex flex-col gap-1 py-3">
              <Bell className="h-4 w-4" />
              <span className="text-xs">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex flex-col gap-1 py-3">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">AI Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>

          <TabsContent value="graphs" className="mt-0">
            <SensorGraphs />
          </TabsContent>

          <TabsContent value="phenology" className="mt-0">
            <PhenologyStage />
          </TabsContent>

          <TabsContent value="nutrition" className="mt-0">
            <NutritionPlanner />
          </TabsContent>

          <TabsContent value="health" className="mt-0">
            <HealthScore />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="chatbot" className="mt-0">
            <Chatbot />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
