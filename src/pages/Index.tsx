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
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMore, setShowMore] = useState(false);
  const [closing, setClosing] = useState(false);

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
      <main className="container mx-auto px-4 py-6 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-12">
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="graphs">
            <SensorGraphs />
          </TabsContent>
          <TabsContent value="phenology">
            <PhenologyStage />
          </TabsContent>
          <TabsContent value="nutrition">
            <NutritionPlanner />
          </TabsContent>
          <TabsContent value="health">
            <HealthScore />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>
          <TabsContent value="chatbot">
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
                  onClick={() => {
                    setClosing(!showMore);
                    setShowMore((prev) => !prev);
                  }}
                  className="flex flex-col items-center py-2 text-xs w-full "
                >
                  •••
                </button>

                {(showMore || closing) && (
                  <div
                    className={`absolute bottom-12 left-0 right-0 bg-card border border-border shadow-xl rounded-xl p-2 flex flex-col ${showMore ? "animate-slide-up" : "animate-slide-down"}`}
                  >
                    <TabsTrigger
                      value="nutrition"
                      onClick={() => setShowMore(false)}
                      className="w-full py-2 text-xs flex items-center gap-2"
                    >
                      <ClipboardList className="h-4 w-4" /> Nutrition
                    </TabsTrigger>
                    <TabsTrigger
                      value="health"
                      onClick={() => setShowMore(false)}
                      className="w-full py-2 text-xs flex items-center gap-2"
                    >
                      <Activity className="h-4 w-4" /> Health
                    </TabsTrigger>
                    <TabsTrigger
                      value="alerts"
                      onClick={() => setShowMore(false)}
                      className="w-full py-2 text-xs flex items-center gap-2"
                    >
                      <Bell className="h-4 w-4" /> Alerts
                    </TabsTrigger>
                    <TabsTrigger
                      value="chatbot"
                      onClick={() => setShowMore(false)}
                      className="w-full py-2 text-xs flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" /> AI
                    </TabsTrigger>
                  </div>
                )}
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
