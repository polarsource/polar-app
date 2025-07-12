import { View, StyleSheet } from "react-native";
import { useState, useMemo } from "react";
import { Path } from "react-native-svg";
import Svg from "react-native-svg";
import { useTheme } from "@/hooks/theme";
import { ThemedText } from "@/components/Shared/ThemedText";
import { Metric } from "@polar-sh/sdk/models/components/metric.js";
import { getFormattedMetricValue } from "./utils";
import { toValueDataPoints, useMetrics } from "@/hooks/polar/metrics";
import { MetricsTotals } from "@polar-sh/sdk/models/components/metricstotals.js";
import { Pill } from "../Shared/Pill";
import { ChartPath } from "./ChartPath";
import { MetricPeriod } from "@polar-sh/sdk/models/components/metricperiod.js";
import { format } from "date-fns";

interface ChartProps {
  currentPeriodData: ReturnType<typeof useMetrics>["data"];
  previousPeriodData: ReturnType<typeof useMetrics>["data"];
  title?: string;
  trend?: number;
  height?: number;
  showTotal?: boolean;
  strokeWidth?: number;
  metric: Metric;
  currentPeriod: {
    startDate: Date;
    endDate: Date;
  };
}

export const Chart = ({
  currentPeriodData,
  previousPeriodData,
  title,
  trend,
  height = 80,
  strokeWidth = 2,
  metric,
  currentPeriod,
}: ChartProps) => {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  const totalValue = useMemo(() => {
    return currentPeriodData?.totals[metric.slug as keyof MetricsTotals] ?? 0;
  }, [currentPeriodData]);

  const formattedTotal = useMemo(() => {
    return getFormattedMetricValue(metric, totalValue);
  }, [totalValue, metric]);

  const currentPeriodDataPoints = toValueDataPoints(
    currentPeriodData,
    metric.slug as Exclude<keyof MetricPeriod, "timestamp">
  );
  const previousPeriodDataPoints = toValueDataPoints(
    previousPeriodData,
    metric.slug as Exclude<keyof MetricPeriod, "timestamp">
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        {title && <ThemedText style={styles.title}>{title}</ThemedText>}
        {trend ? (
          <Pill color={trend > 0 ? "green" : trend < 0 ? "red" : "blue"}>
            {`${trend > 0 ? "+" : ""}${trend * 100}%`}
          </Pill>
        ) : null}
      </View>

      <ThemedText style={styles.totalValue}>{formattedTotal}</ThemedText>

      <View
        style={[styles.chartView, { height }]}
        onLayout={(event) => {
          setChartHeight(event.nativeEvent.layout.height);
          setWidth(event.nativeEvent.layout.width);
        }}
      >
        <Svg height={chartHeight} width={width} preserveAspectRatio="none">
          <ChartPath
            dataPoints={previousPeriodDataPoints}
            width={width}
            chartHeight={chartHeight}
            strokeWidth={strokeWidth}
            strokeColor={colors.secondary}
          />
          <ChartPath
            dataPoints={currentPeriodDataPoints}
            width={width}
            chartHeight={chartHeight}
            strokeWidth={strokeWidth}
            strokeColor={colors.primary}
          />
        </Svg>
      </View>
      <View style={styles.chartTimeline}>
        <ThemedText style={styles.chartTimelineText} secondary>
          {format(currentPeriod.startDate, "MMM d")}
        </ThemedText>
        <ThemedText
          style={[styles.chartTimelineText, { textAlign: "right" }]}
          secondary
        >
          {format(currentPeriod.endDate, "MMM d")}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 24,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 18,
  },
  totalValue: {
    fontSize: 36,
  },
  chartView: {
    width: "100%",
  },
  chartTimeline: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartTimelineText: {
    fontSize: 12,
  },
});
