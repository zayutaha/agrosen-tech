import { FC } from "react";
import HealthScore from "@/components/HealthScore";
import { Activity } from "lucide-react";
import { NutrientCard } from "./NutrientCard";
import { useGetMeasurements } from "@/api/useGetMeasurements";

const Dashboard: FC = () => {
  const { data: measurements, status } = useGetMeasurements();

  if (status === "pending" || status === "error") {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HealthScore />

      <div className="grid gap-2">
        {measurements.map((m) => (
          <NutrientCard measurement={m} key={m.name} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
