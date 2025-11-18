import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, Activity, AlertCircle } from "lucide-react";

const NutritionPlanner = () => {
  const [latestReading, setLatestReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getNPKRecommendation = (nutrient: string, value: number) => {
    const recommendations: any = {
      nitrogen: {
        low: {
          threshold: 20,
          message: "Low nitrogen levels detected",
          action: "Apply Urea fertilizer",
          dosage: "20-30 kg/hectare",
          timing: "Apply in split doses over 2 weeks"
        },
        high: {
          threshold: 200,
          message: "Nitrogen levels are very high",
          action: "Stop all nitrogen fertilization",
          dosage: "N/A",
          timing: "Monitor weekly until levels normalize"
        },
        optimal: {
          message: "Nitrogen levels are optimal",
          action: "Maintain current fertilization schedule",
          dosage: "10-15 kg/hectare monthly",
          timing: "Regular maintenance"
        }
      },
      phosphorus: {
        low: {
          threshold: 10,
          message: "Low phosphorus levels detected",
          action: "Apply DAP (Di-Ammonium Phosphate)",
          dosage: "15-20 kg/hectare",
          timing: "Apply before flowering stage"
        },
        high: {
          threshold: 200,
          message: "Phosphorus levels are very high",
          action: "Stop all phosphorus fertilization",
          dosage: "N/A",
          timing: "Monitor weekly until levels normalize"
        },
        optimal: {
          message: "Phosphorus levels are optimal",
          action: "Maintain current fertilization schedule",
          dosage: "8-12 kg/hectare monthly",
          timing: "Regular maintenance"
        }
      },
      potassium: {
        low: {
          threshold: 10,
          message: "Low potassium levels detected",
          action: "Apply Potash (Muriate of Potash)",
          dosage: "20-25 kg/hectare",
          timing: "Apply during vegetative growth"
        },
        high: {
          threshold: 200,
          message: "Potassium levels are very high",
          action: "Stop all potassium fertilization",
          dosage: "N/A",
          timing: "Monitor weekly until levels normalize"
        },
        optimal: {
          message: "Potassium levels are optimal",
          action: "Maintain current fertilization schedule",
          dosage: "10-15 kg/hectare monthly",
          timing: "Regular maintenance"
        }
      }
    };

    const nutrientData = recommendations[nutrient];
    if (value < nutrientData.low.threshold) return { ...nutrientData.low, status: 'low' };
    if (value > nutrientData.high.threshold) return { ...nutrientData.high, status: 'high' };
    return { ...nutrientData.optimal, status: 'optimal' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!latestReading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No sensor data available</p>
        </CardContent>
      </Card>
    );
  }

  const nitrogenRec = getNPKRecommendation('nitrogen', latestReading.nitrogen);
  const phosphorusRec = getNPKRecommendation('phosphorus', latestReading.phosphorus);
  const potassiumRec = getNPKRecommendation('potassium', latestReading.potassium);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Nutrition Planner</h2>
        <p className="text-muted-foreground">AI-powered fertilization recommendations</p>
      </div>

      {/* Nitrogen */}
      <Card className={`border-l-4 ${
        nitrogenRec.status === 'low' ? 'border-l-destructive' :
        nitrogenRec.status === 'high' ? 'border-l-destructive' :
        'border-l-secondary'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Nitrogen (N) - Current: {latestReading.nitrogen}
            </CardTitle>
            <Badge variant={nitrogenRec.status === 'optimal' ? 'secondary' : 'destructive'}>
              {nitrogenRec.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <p className="font-medium">{nitrogenRec.message}</p>
          </div>
          <div className="bg-accent/50 p-4 rounded-lg space-y-2">
            <div><strong>Action:</strong> {nitrogenRec.action}</div>
            <div><strong>Dosage:</strong> {nitrogenRec.dosage}</div>
            <div><strong>Timing:</strong> {nitrogenRec.timing}</div>
          </div>
        </CardContent>
      </Card>

      {/* Phosphorus */}
      <Card className={`border-l-4 ${
        phosphorusRec.status === 'low' ? 'border-l-destructive' :
        phosphorusRec.status === 'high' ? 'border-l-destructive' :
        'border-l-secondary'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-secondary" />
              Phosphorus (P) - Current: {latestReading.phosphorus}
            </CardTitle>
            <Badge variant={phosphorusRec.status === 'optimal' ? 'secondary' : 'destructive'}>
              {phosphorusRec.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-secondary mt-0.5" />
            <p className="font-medium">{phosphorusRec.message}</p>
          </div>
          <div className="bg-accent/50 p-4 rounded-lg space-y-2">
            <div><strong>Action:</strong> {phosphorusRec.action}</div>
            <div><strong>Dosage:</strong> {phosphorusRec.dosage}</div>
            <div><strong>Timing:</strong> {phosphorusRec.timing}</div>
          </div>
        </CardContent>
      </Card>

      {/* Potassium */}
      <Card className={`border-l-4 ${
        potassiumRec.status === 'low' ? 'border-l-destructive' :
        potassiumRec.status === 'high' ? 'border-l-destructive' :
        'border-l-secondary'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-dark-earth-green" />
              Potassium (K) - Current: {latestReading.potassium}
            </CardTitle>
            <Badge variant={potassiumRec.status === 'optimal' ? 'secondary' : 'destructive'}>
              {potassiumRec.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-dark-earth-green mt-0.5" />
            <p className="font-medium">{potassiumRec.message}</p>
          </div>
          <div className="bg-accent/50 p-4 rounded-lg space-y-2">
            <div><strong>Action:</strong> {potassiumRec.action}</div>
            <div><strong>Dosage:</strong> {potassiumRec.dosage}</div>
            <div><strong>Timing:</strong> {potassiumRec.timing}</div>
          </div>
        </CardContent>
      </Card>

      {/* General Tips */}
      <Card className="bg-primary/5 border-primary">
        <CardHeader>
          <CardTitle className="text-lg">forest-green Fertilization Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Always apply fertilizers in split doses to prevent nutrient burn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Irrigate after fertilizer application to help nutrient absorption</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Avoid fertilizing during extreme temperatures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Conduct soil tests every 3-4 months for accurate nutrient management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Organic matter application improves nutrient retention in soil</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionPlanner;
