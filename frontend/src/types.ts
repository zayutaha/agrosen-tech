export type MeasurementUnit = {
  low: number;
  high: number;
  unit: string;
};

export type Measurement = {
  name: string;
  value: number;
  unit: MeasurementUnit;
};

export enum Substance {
  Nitrogen = "nitrogen",
  Potassium = "potassium",
  Phosphorus = "phosphorus",
  SoilMoisture = "soil_moisture",
  Temperature = "temperature",
  Humidity = "humidity",
  ElectricalConductivity = "electrical_conductivity",
}
