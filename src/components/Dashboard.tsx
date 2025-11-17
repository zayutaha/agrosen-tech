import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Droplets, Leaf, Activity, RefreshCw } from "lucide-react";
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
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Live Field Data</h2>
          <p className="text-muted-foreground">Real-time sensor readings from your saffron field</p>
        </div>
        <Button onClick={refreshData} disabled={refreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {latestReading ? (
        <>
          {/* NPK Values */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="h-5 w-5 text-primary" />
                  Nitrogen (N)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{latestReading.nitrogen}</div>
                <Badge variant={latestReading.nitrogen < 20 ? "destructive" : "secondary"} className="mt-2">
                  {latestReading.nitrogen < 20 ? "Low" : latestReading.nitrogen > 200 ? "High" : "Optimal"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="h-5 w-5 text-secondary" />
                  Phosphorus (P)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{latestReading.phosphorus}</div>
                <Badge variant={latestReading.phosphorus < 10 ? "destructive" : "secondary"} className="mt-2">
                  {latestReading.phosphorus < 10 ? "Low" : latestReading.phosphorus > 200 ? "High" : "Optimal"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-earth-green">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="h-5 w-5 text-earth-green" />
                  Potassium (K)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{latestReading.potassium}</div>
                <Badge variant={latestReading.potassium < 10 ? "destructive" : "secondary"} className="mt-2">
                  {latestReading.potassium < 10 ? "Low" : latestReading.potassium > 200 ? "High" : "Optimal"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Conditions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplets className="h-5 w-5 text-sky-blue" />
                  Soil Moisture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{latestReading.moisture}</div>
                <Badge variant={latestReading.moisture < 500 ? "destructive" : "secondary"} className="mt-2">
                  {latestReading.moisture < 500 ? "Needs Water" : "Good"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{latestReading.temperature}°C</div>
                <p className="text-sm text-muted-foreground mt-2">Ambient temperature</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Humidity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{latestReading.humidity}%</div>
                <p className="text-sm text-muted-foreground mt-2">Relative humidity</p>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last updated</span>
                <span className="text-sm font-medium">
                  {new Date(latestReading.created_at).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
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
