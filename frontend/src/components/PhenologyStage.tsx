import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Calendar, TrendingUp } from "lucide-react";

const PhenologyStage = () => {
  // Mock phenology data - in production this would be calculated from sensor data + date
  const currentStage = {
    name: "Vegetative Growth",
    description: "Active leaf and corm development phase",
    startDate: "2024-10-15",
    daysInStage: 45,
    expectedDuration: 60,
    nextStage: "Flowering Initiation",
    recommendations: [
      "Maintain moderate soil moisture (500-700)",
      "Ensure adequate nitrogen levels (80-120)",
      "Monitor for pest activity",
      "Optimal temperature: 15-20°C"
    ]
  };

  const stages = [
    { name: "Dormancy", status: "completed", icon: "🌰" },
    { name: "Sprouting", status: "completed", icon: "🌱" },
    { name: "Vegetative Growth", status: "current", icon: "🌿" },
    { name: "Flowering Initiation", status: "upcoming", icon: "🌸" },
    { name: "Full Bloom", status: "upcoming", icon: "🌺" },
    { name: "Harvest", status: "upcoming", icon: "🧺" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Phenology Stages</h2>
        <p className="text-muted-foreground">Track forest-green growth cycle and development</p>
      </div>

      {/* Current Stage */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Leaf className="h-6 w-6 text-primary" />
              {currentStage.name}
            </CardTitle>
            <Badge variant="default" className="text-lg px-4 py-1">Current</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-foreground">{currentStage.description}</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Started</div>
                <div className="font-medium">{new Date(currentStage.startDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="font-medium">{currentStage.daysInStage} / {currentStage.expectedDuration} days</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Stage Progress</span>
              <span>{Math.round((currentStage.daysInStage / currentStage.expectedDuration) * 100)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-forest-green transition-all"
                style={{ width: `${(currentStage.daysInStage / currentStage.expectedDuration) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold mb-2">Stage Recommendations</h4>
            <ul className="space-y-2">
              {currentStage.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-accent/50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Next Stage:</strong> {currentStage.nextStage}
              <br />
              <span className="text-muted-foreground">
                Expected in approximately {currentStage.expectedDuration - currentStage.daysInStage} days
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* All Stages Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Growth Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  stage.status === 'current' 
                    ? 'border-primary bg-primary/5' 
                    : stage.status === 'completed'
                    ? 'border-secondary bg-secondary/5'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="text-3xl">{stage.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{stage.name}</div>
                  <Badge variant={
                    stage.status === 'current' ? 'default' :
                    stage.status === 'completed' ? 'secondary' : 'outline'
                  }>
                    {stage.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhenologyStage;
