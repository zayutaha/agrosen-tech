import React from "react";

interface ProgressBarProps {
  value: number;
  color?: string;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "#4ade80",
  max,
}) => {
  const percent = (value / max) * 100;
  const gradient = `linear-gradient(to right, ${color} ${Math.min(
    100,
    percent,
  )}%, #f3f4f6 ${Math.min(100, percent)}%)`;

  return (
    <div
      className="mt-2 h-2 rounded-sm"
      style={{
        background: gradient,
      }}
    />
  );
};

export default ProgressBar;
