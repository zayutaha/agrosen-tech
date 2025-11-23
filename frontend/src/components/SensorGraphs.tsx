import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Activity } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const SensorGraphs = () => {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const { data, error } = await supabase
          .from("sensor_readings")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) throw error;

        const formattedData = (data || []).map((reading) => ({
          ...reading,
          time: new Date(reading.created_at).toLocaleTimeString(),
        }));

        setReadings(formattedData);
      } catch (error) {
        console.error("Error fetching readings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div>
          <Skeleton height={40} />
          <Skeleton />
        </div>

        <div className="flex flex-col gap-5">
          <Skeleton width={"100%"} height={398} borderRadius={"12px"} />
          <Skeleton width={"100%"} height={398} borderRadius={"12px"} />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton width={"100%"} height={398} borderRadius={"12px"} />
            <Skeleton width={"100%"} height={398} borderRadius={"12px"} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Sensor Trends</h2>
        <p className="text-muted-foreground">Historical data visualization</p>
      </div>

      {readings.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>NPK Levels Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={readings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="nitrogen"
                    stroke="hsl(var(--primary))"
                    name="Nitrogen"
                  />
                  <Line
                    type="monotone"
                    dataKey="phosphorus"
                    stroke="hsl(var(--secondary))"
                    name="Phosphorus"
                  />
                  <Line
                    type="monotone"
                    dataKey="potassium"
                    stroke="hsl(var(--dark-earth-green))"
                    name="Potassium"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soil Moisture</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={readings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="hsl(var(--sky-blue))"
                    name="Moisture"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={readings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(var(--destructive))"
                      name="Temp (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Humidity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={readings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="hsl(var(--accent))"
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No historical data available yet. Refresh the dashboard to collect
              data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SensorGraphs;
