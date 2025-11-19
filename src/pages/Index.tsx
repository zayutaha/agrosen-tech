import { useState } from "react";
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
  MoreHorizontal,
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col ">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 w-full justify-center">
            <img
              src="/logo2.svg"
              alt="Agrosentech Logo"
              className="h-10 rounded-xl"
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-6 pb-28 flex-1 overflow-y-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-12 pb-20 "
        >
          <TabsContent value="dashboard" className="pb-20">
            <Dashboard />
          </TabsContent>
          <TabsContent value="graphs" className="pb-20">
            <SensorGraphs />
          </TabsContent>
          <TabsContent value="phenology" className="pb-20">
            <PhenologyStage />
          </TabsContent>
          <TabsContent value="nutrition" className="pb-20">
            <NutritionPlanner />
          </TabsContent>
          <TabsContent value="health" className="pb-20">
            <HealthScore />
          </TabsContent>
          <TabsContent value="alerts" className="pb-20">
            <AlertsPanel />
          </TabsContent>
          <TabsContent value="chatbot" className="pb-20">
            <Chatbot />
          </TabsContent>
        </Tabs>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg pb-5">
        <div className="max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full gap-1 p-2 bg-card">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col items-center py-2 text-xs"
              >
                <Activity className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="graphs"
                className="flex flex-col items-center py-2 text-xs"
              >
                <TrendingUp className="h-4 w-4" />
                Graphs
              </TabsTrigger>
              <TabsTrigger
                value="phenology"
                className="flex flex-col items-center py-2 text-xs"
              >
                <Leaf className="h-4 w-4" />
                Phenology
              </TabsTrigger>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMore((prev) => !prev)}
                  className={`flex flex-col items-center py-2 text-xs w-full rounded-lg transition-colors ${
                    ["nutrition", "health", "alerts", "chatbot"].includes(
                      activeTab,
                    )
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </button>
                <div
                  className={`${showMore ? "opacity-100" : "opacity-0"} ${
                    showMore ? "pointer-events-auto" : "pointer-events-none"
                  } absolute bottom-full mb-2 left-1/2 -translate-x-1/2 max-w-13 bg-white border border-gray-200 shadow-xl rounded-xl p-2 transition-all duration-200`}
                >
                  <TabsTrigger
                    value="nutrition"
                    onClick={() => {
                      setActiveTab("nutrition");
                      setShowMore(false);
                    }}
                    className={`w-full py-3 px-3 text-xs flex items-center gap-2 rounded-lg transition-colors ${
                      activeTab === "nutrition"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <ClipboardList className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Nutrition</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    onClick={() => {
                      setActiveTab("alerts");
                      setShowMore(false);
                    }}
                    className={`w-full py-3 px-3 text-xs flex items-center gap-2 rounded-lg transition-colors ${
                      activeTab === "alerts"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Bell className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="chatbot"
                    onClick={() => {
                      setActiveTab("chatbot");
                      setShowMore(false);
                    }}
                    className={`w-full py-3 px-3 text-xs flex items-center gap-2 rounded-lg transition-colors ${
                      activeTab === "chatbot"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">AI</span>
                  </TabsTrigger>
                </div>
              </div>
            </TabsList>
          </Tabs>
        </div>
      </nav>
      <style>{`
@keyframes slideUpFade {
0% { opacity: 0; transform: translateY(12px) scale(0.98); }
100% { opacity: 1; transform: translateY(0px) scale(1); }
}
.animate-slide-up {
  animation: slideUpFade 0.22s ease-out;
}
 @keyframes slideDownFade {
0% { opacity: 1; transform: translateY(0px) scale(1); }
100% { opacity: 0; transform: translateY(12px) scale(0.98); }
}
.animate-slide-down {
animation: slideDownFade 0.18s ease-out;
}
}`}</style>
    </div>
  );
};

export default Index;
