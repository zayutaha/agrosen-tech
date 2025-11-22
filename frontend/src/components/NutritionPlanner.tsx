import { useState, useEffect } from "react";
import {
  Leaf,
  Activity,
  Sparkles,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Readings } from "./Dashboard";

// ============================================================================
// MOCKS FOR SHADCN COMPONENTS (Card, Badge) and SUPABASE/FIREBASE
// NOTE: When integrating this back into your project, delete this section
// and uncomment your original imports for these components.
// ============================================================================

// Mock Component: Card
const Card = ({ children, className }) => (
  <div
    className={`bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({ children, className }) => (
  <div className={`p-4 border-b border-gray-50 bg-gray-50/50 ${className}`}>
    {children}
  </div>
);
const CardTitle = ({ children, className }) => (
  <h3
    className={`font-semibold text-gray-700 text-sm uppercase tracking-wider ${className}`}
  >
    {children}
  </h3>
);
const CardContent = ({ children, className }) => (
  <div className={`divide-y divide-gray-50 ${className}`}>{children}</div>
);

// Mock Component: Badge
const Badge = ({ variant, children, className }) => {
  const baseClasses =
    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border";
  let colorClasses = "";
  // Updated colors for better visibility and contrast
  if (variant === "low") {
    // Stronger yellow for warning
    colorClasses = "bg-yellow-100 text-yellow-800 border-yellow-200";
  } else if (variant === "high") {
    // Stronger red for critical alert
    colorClasses = "bg-red-100 text-red-800 border-red-200";
  } else {
    // Vibrant green for optimal/success
    colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`}>
      {children}
    </span>
  );
};

// Mock Data for Demo (To show all three statuses: High, Optimal, Low)
const mockReading = {
  nitrogen: 255, // Should be High
  phosphorus: 45, // Should be Optimal
  potassium: 5, // Should be Low
  // Added fixed values for other display elements
  calcium: 150,
  magnesium: 35,
  soil_ph: 6.8,
  moisture: 42,
};
// ============================================================================
// END MOCKS
// ============================================================================

// Logic function to determine status and generate a simplified status object
const getNPKRecommendation = (nutrient, value) => {
  // Thresholds based on typical agricultural ranges (simplified)
  const recommendations = {
    nitrogen: { low: 30, high: 50 },
    phosphorus: { low: 20, high: 40 },
    potassium: { low: 150, high: 200 },
  };

  const thresholds = recommendations[nutrient];
  let status;
  let variant;

  if (value < thresholds.low) {
    status = "Low";
    variant = "low";
  } else if (value > thresholds.high) {
    status = "High";
    variant = "high";
  } else {
    status = "Optimal";
    variant = "optimal";
  }

  return {
    value: `${value} ppm`,
    status: status,
    variant: variant,
    isProblem: status !== "Optimal",
  };
};
type NutritionPlannerProps = {
  readings: Readings;
};
const NutritionPlanner = ({ readings }: NutritionPlannerProps) => {
  const [loading, setLoading] = useState(true);

  // MOCKING DATA FETCHING using the structure from the old code
  useEffect(() => {
    // Simulate API call delay
    const simulateFetch = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(simulateFetch);
  }, [readings]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-lg">
        <Activity className="h-8 w-8 animate-spin text-green-600" />
        <p className="mt-4 text-sm text-gray-500">Loading sensor data...</p>
      </div>
    );
  }

  if (!readings) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mb-2" />
            No sensor data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate data for NPK using the logic function
  const nitrogenData = getNPKRecommendation("nitrogen", readings.nitrogen);
  const phosphorusData = getNPKRecommendation(
    "phosphorus",
    readings.phosphorus,
  );
  const potassiumData = getNPKRecommendation("potassium", readings.potassium);

  const nutrientList = [
    { name: "Nitrogen (N)", ...nitrogenData },
    { name: "Phosphorus (P)", ...phosphorusData },
    { name: "Potassium (K)", ...potassiumData },
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto p-4 md:p-8 rounded-xl bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Nutrition Status</h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time soil composition analysis
          </p>
        </div>
        {/* The Badge component now uses the updated 'optimal' colors */}
        <Badge variant="optimal">LIVE</Badge>
      </div>

      {/* Main Soil Composition Card */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Soil Composition: Macronutrients</CardTitle>
          <span className="text-xs text-gray-400 font-normal">
            Updated 3 min ago
          </span>
        </CardHeader>

        <CardContent>
          {nutrientList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  {item.name}
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  {item.value}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <Badge
                  variant={item.variant}
                  className="min-w-[70px] text-center"
                >
                  {item.status}
                </Badge>

                {/* AI Action Button Area - Fix for alignment. 
                  Always renders the button wrapped in a div to reserve space.
                  Uses opacity-0 and pointer-events-none when no problem exists.
                */}
                <div
                  className={`transition-opacity duration-150 ${
                    item.isProblem
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={() =>
                      console.log(`AI Fix requested for: ${item.name}`)
                    }
                    className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 text-white pl-2 pr-3 py-1.5 rounded-full shadow-md shadow-blue-500/50 hover:bg-blue-700 active:scale-95 transition-all duration-150"
                    title={`Get AI recommendation for ${item.name}`}
                  >
                    <Sparkles className="w-3 h-3 fill-current text-white" />
                    Ask AI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <button className="w-full py-2 text-sm font-medium text-gray-500 hover:text-green-600 flex items-center justify-center gap-1 transition-colors">
            View Historical Data & Trends <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Quick Stats Row for other key indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">
            Soil pH
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {readings.soil_ph}
          </div>
          <div className="text-xs text-green-500 mt-1 font-medium">
            Optimal Range
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">
            Moisture Level
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {readings.soil_moisture}%
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">
            Adequate (Last 24h)
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanner;
