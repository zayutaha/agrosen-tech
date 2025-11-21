import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface ElectricalConductivityReading {
  electrical_conductivity: number;
  created_at: string;
}

const EC_CONFIG = {
  min: 0.2, // dS/m
  max: 2.0, // dS/m
  ideal: "0.2–2.0 dS/m",
  unit: "dS/m",
  color: "#06b6d4",
};

const ElectricalConductivity = () => {
  const [latestEC, setLatestEC] = useState<ElectricalConductivityReading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set dummy data for preview
    setTimeout(() => {
      setLatestEC({ electrical_conductivity: 1.2, created_at: new Date().toISOString() });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-xl font-extrabold">Electrical Conductivity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestEC ? (
          <>
            <div className="text-3xl font-bold text-foreground mb-1">
              {latestEC.electrical_conductivity} {EC_CONFIG.unit}
            </div>
            <Progress
              value={
                (latestEC.electrical_conductivity / EC_CONFIG.max) * 100
              }
              className="mt-2 h-2"
              style={{
                background: `linear-gradient(to right, ${EC_CONFIG.color} ${Math.min(100, (latestEC.electrical_conductivity / EC_CONFIG.max) * 100)}%, #f3f4f6 ${Math.min(100, (latestEC.electrical_conductivity / EC_CONFIG.max) * 100)}%)`,
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ideal: {EC_CONFIG.ideal}
            </p>
            <Badge
              className="mt-2 text-xs"
              variant={
                latestEC.electrical_conductivity < EC_CONFIG.min
                  ? "destructive"
                  : latestEC.electrical_conductivity > EC_CONFIG.max
                    ? "secondary"
                    : "default"
              }
            >
              {latestEC.electrical_conductivity < EC_CONFIG.min
                ? "Low"
                : latestEC.electrical_conductivity > EC_CONFIG.max
                  ? "High"
                  : "Optimal"}
            </Badge>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            No EC data available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ElectricalConductivity;

