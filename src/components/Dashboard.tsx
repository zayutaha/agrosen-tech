import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import HealthScore from "@/components/HealthScore";
import ElectricalConductivity from "@/components/ElectricalConductivity";
import {
  Droplets,
  Activity,
  RefreshCw,
  Thermometer,
  AtomIcon,
  FlaskRound,
  Wind,
  CloudRain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface SensorReading {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  temperature: number;
  humidity: number;
  created_at: string;
}

// Field configuration constants
const FIELD_CONFIG = {
  nitrogen: {
    label: "Nitrogen",
    icon: FlaskRound,
    color: "#4ade80",
    min: 100,
    max: 300,
    unit: "ppm",
    ideal: "100–300 ppm",
  },
  phosphorus: {
    label: "Phosphorus ",
    icon: AtomIcon,
    color: "#818cf8",
    min: 50,
    max: 250,
    unit: "ppm",
    ideal: "50–250 ppm",
  },
  potassium: {
    label: "Potassium ",
    icon: Droplets,
    color: "#fbbf24",
    min: 50,
    max: 250,
    unit: "ppm",
    ideal: "50–250 ppm",
  },
  moisture: {
    label: "Soil Moisture",
    icon: Droplets,
    color: "#38bdf8",
    min: 500,
    max: 1000,
    unit: "%",
    ideal: "500–1000",
  },
  temperature: {
    label: "Temperature",
    icon: Thermometer,
    color: "#ef4444",
    min: 10,
    max: 40,
    unit: "°C",
    ideal: "10–40 °C",
  },
  humidity: {
    label: "Humidity",
    icon: Wind,
    color: "#3b82f6",
    min: 30,
    max: 90,
    unit: "%",
    ideal: "30–90%",
  },
};

const Dashboard = () => {
  const [latestReading, setLatestReading] = useState<SensorReading | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchLatestReading = async () => {
    try {
      const { data, error } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setLatestReading(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const { data, error } =
        await supabase.functions.invoke("poll-thingspeak");

      if (error) throw error;

      toast({
        title: "Data Refreshed",
        description: "Latest sensor readings have been fetched.",
      });

      await fetchLatestReading();
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not fetch new data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestReading();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("sensor_readings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
        },
        (payload) => {
          setLatestReading(payload.new as SensorReading);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Health Score Card on Top */}
      <HealthScore />
      {/* Electrical Conductivity Card */}
      <ElectricalConductivity />
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">Live Field Data</h2>
        </div>
        <Button
          onClick={refreshData}
          disabled={refreshing}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {latestReading ? (
        <>
          {/* NPK Values */}
          <div className="grid gap-2 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FlaskRound className="h-4 w-4 text-primary " />
                  <span className="text-xl font-extrabold">Nitrogen</span>{" "}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Value with Units */}
                <div className="text-3xl font-bold text-foreground mb-1">
                  {latestReading.nitrogen} ppm
                </div>

                {/* Progress Bar with Threshold Indicator */}
                <Progress
                  value={
                    (latestReading.nitrogen / FIELD_CONFIG.nitrogen.max) * 100
                  }
                  className="mt-2 h-2"
                  style={{
                    background: `linear-gradient(to right, ${FIELD_CONFIG.nitrogen.color} ${Math.min(100, (latestReading.nitrogen / FIELD_CONFIG.nitrogen.max) * 100)}%, #f3f4f6 ${Math.min(100, (latestReading.nitrogen / FIELD_CONFIG.nitrogen.max) * 100)}%)`,
                  }}
                />

                {/* Ideal Range Info */}
                <p className="text-xs text-muted-foreground mt-1">
                  Ideal: 100–300 ppm
                </p>

                {/* Status Badge with Better Labeling */}
                <Badge
                  className="mt-2 text-xs"
                  variant={
                    latestReading.nitrogen < 100
                      ? "destructive"
                      : latestReading.nitrogen > 300
                        ? "secondary" // High but not critical
                        : "default"
                  }
                >
                  {latestReading.nitrogen < 100
                    ? "Low"
                    : latestReading.nitrogen > 300
                      ? "High"
                      : "Optimal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AtomIcon className="h-4 w-4 text-secondary" />
                  <span className="text-xl font-extrabold">Phosphorus </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Value with Units */}
                <div className="text-3xl font-bold text-foreground mb-1">
                  {latestReading.phosphorus} ppm
                </div>

                {/* Progress Bar with Threshold Indicator */}
                <Progress
                  value={
                    (latestReading.phosphorus / FIELD_CONFIG.phosphorus.max) *
                    100
                  }
                  className="mt-2 h-2"
                  style={{
                    background: `linear-gradient(to right, ${FIELD_CONFIG.phosphorus.color} ${Math.min(100, (latestReading.phosphorus / FIELD_CONFIG.phosphorus.max) * 100)}%, #f3f4f6 ${Math.min(100, (latestReading.phosphorus / FIELD_CONFIG.phosphorus.max) * 100)}%)`,
                  }}
                />

                {/* Ideal Range Info */}
                <p className="text-xs text-muted-foreground mt-1">
                  Ideal: 50–250 ppm
                </p>

                {/* Status Badge with Better Labeling */}
                <Badge
                  className="mt-2 text-xs"
                  variant={
                    latestReading.phosphorus < 50
                      ? "destructive"
                      : latestReading.phosphorus > 250
                        ? "secondary"
                        : "default"
                  }
                >
                  {latestReading.phosphorus < 50
                    ? "Low"
                    : latestReading.phosphorus > 250
                      ? "High"
                      : "Optimal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplets className="h-4 w-4 text-dark-earth-green" />
                  <span className="text-xl font-extrabold">Potassium </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Value with Units */}
                <div className="text-3xl font-bold text-foreground mb-1">
                  {latestReading.potassium} ppm
                </div>

                {/* Progress Bar with Threshold Indicator */}
                <Progress
                  value={
                    (latestReading.potassium / FIELD_CONFIG.potassium.max) * 100
                  }
                  className="mt-2 h-2"
                  style={{
                    background: `linear-gradient(to right, ${FIELD_CONFIG.potassium.color} ${Math.min(100, (latestReading.potassium / FIELD_CONFIG.potassium.max) * 100)}%, #f3f4f6 ${Math.min(100, (latestReading.potassium / FIELD_CONFIG.potassium.max) * 100)}%)`,
                  }}
                />

                {/* Ideal Range Info */}
                <p className="text-xs text-muted-foreground mt-1">
                  Ideal: 50–250 ppm
                </p>

                {/* Status Badge with Better Labeling */}
                <Badge
                  className="mt-2 text-xs"
                  variant={
                    latestReading.potassium < 50
                      ? "destructive"
                      : latestReading.potassium > 250
                        ? "secondary"
                        : "default"
                  }
                >
                  {latestReading.potassium < 50
                    ? "Low"
                    : latestReading.potassium > 250
                      ? "High"
                      : "Optimal"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Conditions */}
          <div className="grid gap-2 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplets className="h-4 w-4 text-sky-blue" />
                  <span className="text-xl font-extrabold">Soil Moisture</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Value with Units */}
                <div className="text-3xl font-bold text-foreground mb-1">
                  {latestReading.moisture} %
                </div>

                {/* Progress Bar with Threshold Indicator */}
                <Progress
                  value={(latestReading.moisture / 1000) * 100}
                  className="mt-2 h-2"
                  style={{
                    background: `linear-gradient(to right, #38bdf8 ${Math.min(100, (latestReading.moisture / 1000) * 100)}%, #f3f4f6 ${Math.min(100, (latestReading.moisture / 1000) * 100)}%)`,
                  }}
                />

                {/* Ideal Range Info */}
                <p className="text-xs text-muted-foreground mt-1">
                  Ideal: 500–1000
                </p>

                {/* Status Badge with Better Labeling */}
                <Badge
                  className="mt-2 text-xs"
                  variant={
                    latestReading.moisture < 500
                      ? "destructive"
                      : latestReading.moisture > 1000
                        ? "secondary"
                        : "default"
                  }
                >
                  {latestReading.moisture < 500
                    ? "Needs Water"
                    : latestReading.moisture > 1000
                      ? "High"
                      : "Optimal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-xl font-extrabold">
                    {FIELD_CONFIG.temperature.label}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Value with Units */}
                <div className="text-3xl font-bold text-foreground mb-1">
                  {latestReading.temperature} {FIELD_CONFIG.temperature.unit}
                </div>

                {/* Progress Bar with Threshold Indicator */}
                <Progress
                  value={
                    (latestReading.temperature / FIELD_CONFIG.temperature.max) *
                    100
                  }
                  className="mt-2 h-2"
                  style={{
                    background: `linear-gradient(to right, ${FIELD_CONFIG.temperature.color} ${Math.min(100, (latestReading.temperature / FIELD_CONFIG.temperature.max) * 100)}%, #f3f4f6 ${Math.min(100, (latestReading.temperature / FIELD_CONFIG.temperature.max) * 100)}%)`,
                  }}
                />

                {/* Ideal Range Info */}
                <p className="text-xs text-muted-foreground mt-1">
                  Ideal: {FIELD_CONFIG.temperature.ideal}
                </p>

                {/* Status Badge with Better Labeling */}
                <Badge
                  className="mt-2 text-xs"
                  variant={
                    latestReading.temperature < FIELD_CONFIG.temperature.min
                      ? "destructive"
                      : latestReading.temperature > FIELD_CONFIG.temperature.max
                        ? "secondary"
                        : "default"
                  }
                >
                  {latestReading.temperature < FIELD_CONFIG.temperature.min
                    ? "Low"
                    : latestReading.temperature > FIELD_CONFIG.temperature.max
                      ? "High"
                      : "Optimal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-xl font-extrabold">
                    {FIELD_CONFIG.humidity.label}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Value with Units */}
                <div className="text-3xl font-bold text-foreground mb-1">
                  {latestReading.humidity} {FIELD_CONFIG.humidity.unit}
                </div>

                {/* Progress Bar with Threshold Indicator */}
                <Progress
                  value={
                    (latestReading.humidity / FIELD_CONFIG.humidity.max) * 100
                  }
                  className="mt-2 h-2"
                  style={{
                    background: `linear-gradient(to right, ${FIELD_CONFIG.humidity.color} ${Math.min(100, (latestReading.humidity / FIELD_CONFIG.humidity.max) * 100)}%, #f3f4f6 ${Math.min(100, (latestReading.humidity / FIELD_CONFIG.humidity.max) * 100)}%)`,
                  }}
                />

                {/* Ideal Range Info */}
                <p className="text-xs text-muted-foreground mt-1">
                  Ideal: {FIELD_CONFIG.humidity.ideal}
                </p>

                {/* Status Badge with Better Labeling */}
                <Badge
                  className="mt-2 text-xs"
                  variant={
                    latestReading.humidity < FIELD_CONFIG.humidity.min
                      ? "destructive"
                      : latestReading.humidity > FIELD_CONFIG.humidity.max
                        ? "secondary"
                        : "default"
                  }
                >
                  {latestReading.humidity < FIELD_CONFIG.humidity.min
                    ? "Low"
                    : latestReading.humidity > FIELD_CONFIG.humidity.max
                      ? "High"
                      : "Optimal"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No sensor data available yet. Click "Refresh" to fetch data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
