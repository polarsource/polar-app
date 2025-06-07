import { useContext } from "react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { useMemo } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/theme";
import { useMetrics } from "@/hooks/polar/metrics";
import { TimeInterval } from "@polar-sh/sdk/dist/commonjs/models/components/timeinterval";
import { formatCurrencyAndAmount } from "@/utils/money";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/Shared/ThemedText";

export default function Index() {
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

  return (
    <ScrollView style={MetricsStyles.container}>
      <Stack.Screen options={{ title: "Metrics" }} />
      <ThemedText style={MetricsStyles.title}>Not implemented</ThemedText>
    </ScrollView>
  );
}

const MetricsStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 16,
  },
  title: {
    fontSize: 24,
  },
});
