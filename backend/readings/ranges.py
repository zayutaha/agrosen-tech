from typing import TypedDict

class Range(TypedDict):
    low: int
    high: int
    unit: str

NITROGEN: Range = {
    "low": 30,
    "high": 50,
    "unit": "mg/kg",
}

PHOSPHORUS: Range = {
    "low": 20,
    "high": 40,
    "unit": "mg/kg",
}

POTASSIUM: Range = {
    "low": 150,
    "high": 200,
    "unit": "mg/kg",
}

SOIL_MOISTURE: Range = {
    "low": 12,
    "high": 15,
    "unit": "%",   
} 

TEMPERATURE = {
  "low": 10,
  "high": 40,
  "unit": "°C",
}

HUMIDITY = {
  "low": 30,
  "high": 90,
  "unit": "%",
}

ELECTRICAL_CONDUCTIVITY = {
  "low": 0.2,
  "high": 2.0,
  "unit": "dS/m",
}
