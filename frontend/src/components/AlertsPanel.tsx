import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bell, AlertTriangle, Info, X, Activity } from "lucide-react";

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: string;
  resolved: boolean;
  created_at: string;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) throw error;
        setAlerts(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    const channel = supabase
      .channel("alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts",
        },
        (payload) => {
          setAlerts((prev) => [payload.new as Alert, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <Bell className="h-5 w-5 text-forest-green" />;
      default:
        return <Info className="h-5 w-5 text-forest-green" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return (
          <Badge variant="default" className="bg-forest-green">
            Warning
          </Badge>
        );
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Alerts & Notifications
          </h2>
          <p className="text-muted-foreground">
            Field monitoring alerts and warnings
          </p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2 text-center">
          {activeAlerts.length} Active
        </Badge>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Active Alerts
          </h3>
          {activeAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`border-l-4 ${
                alert.severity === "critical"
                  ? "border-l-destructive bg-destructive/5"
                  : alert.severity === "warning"
                    ? "border-l-forest-green bg-forest-green/5"
                    : "border-l-primary bg-primary/5"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {getAlertIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold capitalize">
                        {alert.type}
                      </span>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-foreground mb-2">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-secondary/10 border-secondary">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                <Info className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-lg font-medium">All Clear!</p>
              <p className="text-muted-foreground">
                No active alerts. Your field is in good condition.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolved Alerts History */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
            <X className="h-5 w-5" />
            Recently Resolved
          </h3>
          {resolvedAlerts.slice(0, 5).map((alert) => (
            <Card key={alert.id} className="opacity-60">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {getAlertIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold capitalize line-through">
                        {alert.type}
                      </span>
                      <Badge variant="outline">Resolved</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alert Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-destructive/10">
              <div className="text-3xl font-bold text-destructive">
                {
                  alerts.filter((a) => a.severity === "critical" && !a.resolved)
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Critical Alerts
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-forest-green/10">
              <div
                className="text-3xl font-bold"
                style={{ color: "hsl(var(--forest-green))" }}
              >
                {
                  alerts.filter((a) => a.severity === "warning" && !a.resolved)
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground mt-1">Warnings</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <div className="text-3xl font-bold text-secondary">
                {resolvedAlerts.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Resolved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPanel;
