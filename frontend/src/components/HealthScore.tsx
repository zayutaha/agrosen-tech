import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

const HealthScore = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("health_scores")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setHealthData(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!healthData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No health score data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-forest-green";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-secondary to-dark-earth-green";
    if (score >= 60) return "from-primary to-forest-green";
    if (score >= 40) return "from-forest-green to-primary";
    return "from-destructive to-forest-green";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return { label: "Excellent", variant: "secondary" as const };
    if (score >= 60) return { label: "Good", variant: "default" as const };
    if (score >= 40) return { label: "Fair", variant: "outline" as const };
    return { label: "Poor", variant: "destructive" as const };
  };

  const badge = getScoreBadge(healthData.score);
  const factors = healthData.factors || {};

  const getFactorIcon = (status: string) => {
    if (status === "ok")
      return <TrendingUp className="h-5 w-5 text-secondary" />;
    if (status === "low" || status === "high")
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    return <TrendingDown className="h-5 w-5 text-muted-foreground" />;
  };

  const getFactorMessage = (factor: string, status: string) => {
    const messages: any = {
      moisture: {
        ok: "Soil moisture is at optimal levels",
        low: "Soil moisture is too low - irrigation needed",
        high: "Soil moisture is too high - reduce watering",
      },
      nitrogen: {
        ok: "Nitrogen levels are balanced",
        low: "Nitrogen deficiency detected",
        high: "Excessive nitrogen - stop fertilization",
      },
      phosphorus: {
        ok: "Phosphorus levels are adequate",
        low: "Phosphorus deficiency detected",
        high: "Excessive phosphorus - stop fertilization",
      },
      potassium: {
        ok: "Potassium levels are adequate",
        low: "Potassium deficiency detected",
        high: "Excessive potassium - stop fertilization",
      },
    };

    return messages[factor]?.[status] || `${factor}: ${status}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card/50 to-primary/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-medium tracking-wide">
            Current Field Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div
              className={`
            text-8xl 
            font-extrabold 
            mb-4 
            tracking-tight 
            drop-shadow-lg 
            bg-gradient-to-r 
            ${getScoreGradient(healthData.score)} 
            bg-clip-text 
            text-transparent
          `}
            >
              {healthData.score}
            </div>
            <Badge
              variant={badge.variant}
              className="text-sm px-4 py-1.5 font-semibold"
            >
              {badge.label}
            </Badge>
          </div>

          <div className="space-y-2 relative">
            <div className="h-6 bg-muted rounded-full overflow-hidden relative">
              <div
                className="absolute h-full bg-green-500/30 dark:bg-green-600/30"
                style={{ left: "70%", width: "15%" }}
              />
              <div
                className={`h-full bg-gradient-to-r ${getScoreGradient(healthData.score)} transition-all relative z-10`}
                style={{ width: `${healthData.score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>25</span>
              <span className="font-semibold text-foreground">50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Last updated: {new Date(healthData.created_at).toLocaleTimeString()}{" "}
            on {new Date(healthData.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthScore;
