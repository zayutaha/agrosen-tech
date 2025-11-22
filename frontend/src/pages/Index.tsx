import React, { useState } from "react";
import {
  Activity,
  Leaf,
  MessageSquare,
  Bell,
  ClipboardList,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import SensorGraphs from "@/components/SensorGraphs";
import PhenologyStage from "@/components/PhenologyStage";
import NutritionPlanner from "@/components/NutritionPlanner";
import HealthScore from "@/components/HealthScore";
import AlertsPanel from "@/components/AlertsPanel";
import Chatbot from "@/components/Chatbot";

const BASE_URL = import.meta.env.VITE_API_URL;

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMore, setShowMore] = useState(false);
  const [readings, setReadings] = useState();
  React.useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    const response = await fetch(`${BASE_URL}/api/reading`).then((res) =>
      res.json(),
    );
    setReadings(response);
  };
  return (
    <div className="min-h-screen bg-background flex flex-col ">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 w-full justify-center">
            {/* Replaced img with div for preview safety, revert to your img tag */}
            <div className="h-10 px-4 text-xl flex items-center font-bold ">
              Saffron Monitor
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-6 pb-28 flex-1 overflow-y-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-12 pb-20 "
        >
          {/* NOTE: For the preview to work perfectly with the Mock Tabs above, 
               conditional rendering would normally be needed. 
               In your real app with ShadCN, the code below is perfect.
           */}
          {activeTab === "dashboard" && (
            <TabsContent value="dashboard" className="pb-20">
              <Dashboard readings={readings} />
            </TabsContent>
          )}
          {activeTab === "graphs" && (
            <TabsContent value="graphs" className="pb-20">
              <SensorGraphs />
            </TabsContent>
          )}
          {activeTab === "phenology" && (
            <TabsContent value="phenology" className="pb-20">
              <PhenologyStage />
            </TabsContent>
          )}
          {activeTab === "nutrition" && (
            <TabsContent value="nutrition" className="pb-20">
              <NutritionPlanner readings={readings} />
            </TabsContent>
          )}
          {activeTab === "health" && (
            <TabsContent value="health" className="pb-20">
              <HealthScore />
            </TabsContent>
          )}
          {activeTab === "alerts" && (
            <TabsContent value="alerts" className="pb-20">
              <AlertsPanel />
            </TabsContent>
          )}
          {activeTab === "chatbot" && (
            <TabsContent value="chatbot" className="pb-20">
              <Chatbot />
            </TabsContent>
          )}
        </Tabs>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg pb-5">
        <div className="max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full gap-1 p-2 bg-card">
              <TabsTrigger
                value="dashboard"
                className={`flex flex-col items-center py-2 text-xs ${
                  activeTab === "dashboard" ? "text-green-600" : "text-gray-500"
                }`}
              >
                <Activity className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="graphs"
                className={`flex flex-col items-center py-2 text-xs ${
                  activeTab === "graphs" ? "text-green-600" : "text-gray-500"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Graphs
              </TabsTrigger>
              <TabsTrigger
                value="phenology"
                className={`flex flex-col items-center py-2 text-xs ${
                  activeTab === "phenology" ? "text-green-600" : "text-gray-500"
                }`}
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
                      ? "bg-gray-100 text-green-600"
                      : "hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </button>

                {/* --- EDITED SECTION: FIXED ALIGNMENT AND SIZE --- */}
                <div
                  className={`${
                    showMore
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  } absolute bottom-full right-0 mb-2 w-max min-w-[120px] bg-white border border-gray-200 shadow-xl rounded-xl p-1 transition-all duration-200 origin-bottom-right`}
                >
                  <TabsTrigger
                    value="nutrition"
                    onClick={() => {
                      setActiveTab("nutrition");
                      setShowMore(false);
                    }}
                    className={`w-full py-2 px-3 text-xs flex justify-start items-center gap-3 rounded-lg transition-colors ${
                      activeTab === "nutrition"
                        ? "bg-gray-100 text-green-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <ClipboardList
                      className={`h-4 w-4 flex-shrink-0 ${
                        activeTab === "nutrition"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="whitespace-nowrap font-medium">
                      Nutrition
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    onClick={() => {
                      setActiveTab("alerts");
                      setShowMore(false);
                    }}
                    className={`w-full py-2 px-3 text-xs flex justify-start items-center gap-3 rounded-lg transition-colors ${
                      activeTab === "alerts"
                        ? "bg-gray-100 text-green-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Bell
                      className={`h-4 w-4 flex-shrink-0 ${
                        activeTab === "alerts"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="whitespace-nowrap font-medium">
                      Alerts
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="chatbot"
                    onClick={() => {
                      setActiveTab("chatbot");
                      setShowMore(false);
                    }}
                    className={`w-full py-2 px-3 text-xs flex justify-start items-center gap-3 rounded-lg transition-colors ${
                      activeTab === "chatbot"
                        ? "bg-gray-100 text-green-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <MessageSquare
                      className={`h-4 w-4 flex-shrink-0 ${
                        activeTab === "chatbot"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="whitespace-nowrap font-medium">
                      AI Assistant
                    </span>
                  </TabsTrigger>
                </div>
                {/* --- END OF EDITED SECTION --- */}
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
`}</style>
    </div>
  );
};

export default Index;
