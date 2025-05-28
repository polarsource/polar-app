import { View, Text, StyleSheet } from "react-native";
import { Tile } from "./Tile";
import { useMetrics } from "@/hooks/polar/metrics";
import { TimeInterval } from "@polar-sh/sdk/dist/commonjs/models/components/timeinterval";
import { useContext, useMemo, useState } from "react";
import { formatCurrencyAndAmount } from "@/utils/money";
import { useTheme } from "@/hooks/theme";
import { Path } from "react-native-svg";
import Svg from "react-native-svg";
import { OrganizationContext } from "@/providers/OrganizationProvider";

export const RevenueTile = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();

  const startOfMonth = useMemo(() => {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }, []);

  const endDate = useMemo(() => {
    return new Date();
  }, []);

  const metrics = useMetrics(organization.id, startOfMonth, endDate, {
    interval: TimeInterval.Day,
  });

  const cumulativeRevenue = useMemo(() => {
    return (
      metrics.data?.periods.reduce((acc, period) => {
        return acc + period.revenue;
      }, 0) ?? 0
    );
  }, [metrics]);

  const cumulativeRevenueData = useMemo(() => {
    return (
      metrics.data?.periods.reduce<{ value: number; date: Date }[]>(
        (acc, period) => [
          ...acc,
          {
            value: (acc[acc.length - 1]?.value ?? 0) + (period.revenue ?? 0),
            date: period.timestamp,
          },
        ],
        []
      ) ?? []
    );
  }, [metrics]);

  return (
    <Tile href="/metrics">
      <View style={styles.container}>
        <View style={{ flexDirection: "column", gap: 4 }}>
          <Text style={[styles.title, { color: colors.text }]}>Revenue</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            This Month
          </Text>
        </View>
        {cumulativeRevenueData && (
          <View
            style={{ height: 40, width: "100%" }}
            onLayout={(event) => {
              setHeight(event.nativeEvent.layout.height);
              setWidth(event.nativeEvent.layout.width);
            }}
          >
            <Svg height={height} width={width} preserveAspectRatio="none">
              <Path
                d={cumulativeRevenueData
                  .map((period, index) => {
                    const x =
                      index === 0
                        ? 1 // Start 1px in to avoid clipping
                        : (index / (cumulativeRevenueData.length - 1)) *
                          (width - 2); // Subtract 2 to avoid clipping

                    const values = cumulativeRevenueData.map((d) => d.value);
                    const maxValue = Math.max(...values);
                    const minValue = Math.min(...values);
                    const valueRange = Math.abs(maxValue - minValue) || 1; // Prevent division by zero

                    // Scale y value between top and bottom padding
                    const y =
                      height -
                      2 - // Bottom padding
                      ((period.value - minValue) / valueRange) * (height - 4); // Scale to available height

                    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                stroke={colors.primary}
                strokeWidth="2"
                fill="none"
              />
            </Svg>
          </View>
        )}
        <Text style={[styles.revenueValue, { color: colors.text }]}>
          {formatCurrencyAndAmount(cumulativeRevenue, "usd", 0, "compact")}
        </Text>
      </View>
    </Tile>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
  },
  revenueValue: {
    fontSize: 26,
  },
});
