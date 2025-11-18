import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const HealthScore = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('health_scores')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setHealthData(data);
      } catch (error) {
        console.error('Error:', error);
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
          <p className="text-center text-muted-foreground">No health score data available</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-forest-green';
    return 'text-destructive';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-secondary to-dark-earth-green';
    if (score >= 60) return 'from-primary to-forest-green';
    if (score >= 40) return 'from-forest-green to-primary';
    return 'from-destructive to-forest-green';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', variant: 'secondary' as const };
    if (score >= 60) return { label: 'Good', variant: 'default' as const };
    if (score >= 40) return { label: 'Fair', variant: 'outline' as const };
    return { label: 'Poor', variant: 'destructive' as const };
  };

  const badge = getScoreBadge(healthData.score);
  const factors = healthData.factors || {};

  const getFactorIcon = (status: string) => {
    if (status === 'ok') return <TrendingUp className="h-5 w-5 text-secondary" />;
    if (status === 'low' || status === 'high') return <AlertTriangle className="h-5 w-5 text-destructive" />;
    return <TrendingDown className="h-5 w-5 text-muted-foreground" />;
  };

  const getFactorMessage = (factor: string, status: string) => {
    const messages: any = {
      moisture: {
        ok: 'Soil moisture is at optimal levels',
        low: 'Soil moisture is too low - irrigation needed',
        high: 'Soil moisture is too high - reduce watering'
      },
      nitrogen: {
        ok: 'Nitrogen levels are balanced',
        low: 'Nitrogen deficiency detected',
        high: 'Excessive nitrogen - stop fertilization'
      },
      phosphorus: {
        ok: 'Phosphorus levels are adequate',
        low: 'Phosphorus deficiency detected',
        high: 'Excessive phosphorus - stop fertilization'
      },
      potassium: {
        ok: 'Potassium levels are adequate',
        low: 'Potassium deficiency detected',
        high: 'Excessive potassium - stop fertilization'
      }
    };

    return messages[factor]?.[status] || `${factor}: ${status}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Field Health Score</h2>
        <p className="text-muted-foreground">Overall field condition assessment</p>
      </div>

      {/* Main Score Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Current Health Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className={`text-8xl font-bold mb-4 bg-gradient-to-r ${getScoreGradient(healthData.score)} bg-clip-text text-transparent`}>
              {healthData.score}
            </div>
            <Badge variant={badge.variant} className="text-lg px-6 py-2">
              {badge.label}
            </Badge>
          </div>

          {/* Score Bar */}
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getScoreGradient(healthData.score)} transition-all`}
                style={{ width: `${healthData.score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Last updated: {new Date(healthData.created_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Contributing Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Contributing Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(factors).map(([factor, status]) => (
              <div 
                key={factor}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
              >
                {getFactorIcon(status as string)}
                <div className="flex-1">
                  <div className="font-semibold capitalize">{factor}</div>
                  <div className="text-sm text-muted-foreground">
                    {getFactorMessage(factor, status as string)}
                  </div>
                </div>
                <Badge variant={status === 'ok' ? 'secondary' : 'destructive'}>
                  {status as string}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="bg-accent/30 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {factors.moisture === 'low' && (
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Increase irrigation frequency to maintain optimal soil moisture</span>
              </li>
            )}
            {factors.nitrogen === 'low' && (
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Apply nitrogen-rich fertilizers (Urea) to boost nitrogen levels</span>
              </li>
            )}
            {factors.phosphorus === 'low' && (
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Add phosphorus supplements (DAP) to improve plant growth</span>
              </li>
            )}
            {factors.potassium === 'low' && (
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Apply potassium fertilizers (Potash) to strengthen plant immunity</span>
              </li>
            )}
            {(factors.nitrogen === 'high' || factors.phosphorus === 'high' || factors.potassium === 'high') && (
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Suspend fertilization until nutrient levels normalize</span>
              </li>
            )}
            {healthData.score >= 80 && (
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">✓</span>
                <span>Field conditions are excellent! Maintain current practices</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthScore;
