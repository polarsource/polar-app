import { Path } from "react-native-svg";

export interface ChartPathProps {
  dataPoints: {
    value: number;
    date: Date;
  }[];
  width: number;
  chartHeight: number;
  strokeWidth: number;
  strokeColor: string;
}

export const ChartPath = ({
  dataPoints,
  width,
  chartHeight,
  strokeWidth,
  strokeColor,
}: ChartPathProps) => {
  const pathString = dataPoints
    .map((point, index) => {
      const x =
        index === 0 ? 1 : (index / (dataPoints.length - 1)) * (width - 2);

      const values = dataPoints.map((d) => d.value);
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);
      const valueRange = Math.abs(maxValue - minValue) || 1;

      const y =
        chartHeight -
        2 -
        ((point.value - minValue) / valueRange) * (chartHeight - 4);

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <Path
      d={pathString}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      fill="none"
    />
  );
};
