import {
  Atom,
  BellElectric,
  Cloud,
  FlaskRound,
  Leaf,
  Thermometer,
  Wind,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "./ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Measurement, Substance } from "@/types";
import { FC } from "react";

interface NutrientCardProps {
  measurement: Measurement;
}

export const NutrientCard: React.FC<NutrientCardProps> = ({ measurement }) => {
  const {
    value,
    unit: { low, high, unit },
  } = measurement;

  const { label, variant } = getStatus();

  return (
    <Card>
      <Header measurement={measurement} />
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">
          {value} {unit}
        </div>
        <ProgressBar value={value} max={high} />
        <p className="text-xs text-muted-foreground mt-1">
          {`Ideal: ${low}-${high} ${unit}`}
        </p>
        <Badge className="mt-2 text-xs" variant={variant}>
          {label}
        </Badge>
      </CardContent>
    </Card>
  );

  function getStatus() {
    if (value < low) return { label: "Low", variant: "destructive" as const };
    if (value > high) return { label: "High", variant: "secondary" as const };
    return { label: "Optimal", variant: "default" as const };
  }
};

const Header: FC<{ measurement: Measurement }> = ({ measurement }) => {
  const { title, icon } = DisplayMetadata[measurement.name] ?? {
    title: measurement.name,
    Icon: <FlaskRound {...CommonIconProps} />,
  };
  return (
    <CardHeader className="pb-1">
      <CardTitle className="flex items-center gap-2 text-base">
        {icon}
        <span className="text-xl font-extrabold">{title}</span>{" "}
      </CardTitle>
    </CardHeader>
  );
};

const CommonIconProps = {
  className: "h-4 w-4 text-primary",
};

const DisplayMetadata: Record<Substance, { title: string; icon: JSX.Element }> =
  {
    [Substance.Nitrogen]: {
      title: "Nitrogen",
      icon: <FlaskRound {...CommonIconProps} />,
    },
    [Substance.Potassium]: {
      title: "Potassium",
      icon: <Leaf {...CommonIconProps} />,
    },
    [Substance.Phosphorus]: {
      title: "Potassium",
      icon: <Atom {...CommonIconProps} />,
    },
    [Substance.SoilMoisture]: {
      title: "Soil Moisture",
      icon: <Cloud {...CommonIconProps} />,
    },
    [Substance.Temperature]: {
      title: "Temperature",
      icon: <Thermometer {...CommonIconProps} />,
    },
    [Substance.Humidity]: {
      title: "Humidity",
      icon: <Wind {...CommonIconProps} />,
    },
    [Substance.ElectricalConductivity]: {
      title: "Electrical Conductivity",
      icon: <BellElectric {...CommonIconProps} />,
    },
  };
