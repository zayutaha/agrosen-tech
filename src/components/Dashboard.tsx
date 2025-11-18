import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Droplets, Leaf, Activity, RefreshCw, Thermometer, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SensorReading {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  temperature: number;
  humidity: number;
  created_at: string;
}

const Dashboard = () => {
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchLatestReading = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setLatestReading(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('poll-thingspeak');
      
      if (error) throw error;
      
      toast({
        title: "Data Refreshed",
        description: "Latest sensor readings have been fetched.",
      });
      
      await fetchLatestReading();
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not fetch new data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestReading();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('sensor_readings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings'
        },
        (payload) => {
          setLatestReading(payload.new as SensorReading);
        }
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
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">Live Field Data</h2>
        </div>
        <Button onClick={refreshData} disabled={refreshing} variant="ghost" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {latestReading ? (
        <>
          {/* NPK Values */}
          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <div className="pb-1">
                <div className="flex items-center gap-2 text-base">
                  <Leaf className="h-4 w-4 text-primary" />
                  Nitrogen (N)
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{latestReading.nitrogen}</div>
                <Badge variant={latestReading.nitrogen < 20 ? "destructive" : "secondary"} className="mt-1 text-xs">
                  {latestReading.nitrogen < 20 ? "Low" : latestReading.nitrogen > 200 ? "High" : "Optimal"}
                </Badge>
              </div>
            </div>

            <div>
              <div className="pb-1">
                <div className="flex items-center gap-2 text-base">
                  <Leaf className="h-4 w-4 text-secondary" />
                  Phosphorus (P)
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{latestReading.phosphorus}</div>
                <Badge variant={latestReading.phosphorus < 10 ? "destructive" : "secondary"} className="mt-1 text-xs">
                  {latestReading.phosphorus < 10 ? "Low" : latestReading.phosphorus > 200 ? "High" : "Optimal"}
                </Badge>
              </div>
            </div>

            <div>
              <div className="pb-1">
                <div className="flex items-center gap-2 text-base">
                  <Leaf className="h-4 w-4 text-dark-earth-green" />
                  Potassium (K)
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{latestReading.potassium}</div>
                <Badge variant={latestReading.potassium < 10 ? "destructive" : "secondary"} className="mt-1 text-xs">
                  {latestReading.potassium < 10 ? "Low" : latestReading.potassium > 200 ? "High" : "Optimal"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <div className="pb-1">
                <div className="flex items-center gap-2 text-base">
                  <Droplets className="h-4 w-4 text-sky-blue" />
                  Soil Moisture
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{latestReading.moisture}</div>
                <Badge variant={latestReading.moisture < 500 ? "destructive" : "secondary"} className="mt-1 text-xs">
                  {latestReading.moisture < 500 ? "Needs Water" : "Good"}
                </Badge>
              </div>
            </div>

            <div>
              <div className="pb-1">
                <div className="flex items-center gap-2 text-base">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  Temperature
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{latestReading.temperature}°C</div>
              </div>
            </div>

            <div>
              <div className="pb-1">
                <div className="flex items-center gap-2 text-base">
                  <Wind className="h-4 w-4 text-blue-500" />
                  Humidity
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{latestReading.humidity}%</div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-right">
            <div className="py-3">
              <div className="flex items-center justify-end">
                <span className="text-sm text-muted-foreground">Last updated</span>
                <span className="text-sm font-medium ml-2">
                  {new Date(latestReading.created_at).toLocaleString()}
                </span>
              </div>
            </div>
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
