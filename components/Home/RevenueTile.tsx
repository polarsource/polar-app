import { View, Text, StyleSheet } from "react-native";
import { Tile } from "./Tile";
import { useMetrics } from "@/hooks/polar/metrics";
import { TimeInterval } from "@polar-sh/sdk/dist/commonjs/models/components/timeinterval";
import { useContext, useMemo } from "react";
import { OrganizationContext } from "@/utils/providers";
import { formatCurrencyAndAmount } from "@/utils/money";
import { useTheme } from "@/hooks/theme";

export const RevenueTile = () => {
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();

  const startOfMonth = useMemo(() => {
    return new Date("2024-01-01");
  }, []);

  const endDate = useMemo(() => {
    return new Date();
  }, []);

  const metrics = useMetrics(organization.id, startOfMonth, endDate, {
    interval: TimeInterval.Month,
  });

  const cumulativeRevenue = useMemo(() => {
    return (
      metrics.data?.periods.reduce((acc, period) => {
        return acc + period.revenue;
      }, 0) ?? 0
    );
  }, [metrics]);

  return (
    <Tile href="/metrics">
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Revenue</Text>
        <Text style={[styles.revenueValue, { color: colors.text }]}>
          {formatCurrencyAndAmount(cumulativeRevenue, "usd", 0)}
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
  revenueValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
