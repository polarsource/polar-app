import { useContext, useMemo, useState } from "react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useMetrics } from "@/hooks/polar/metrics";
import { Stack } from "expo-router";
import { Chart } from "@/components/Metrics/Chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/Shared/Tabs";
import {
  dateRangeToInterval,
  getPreviousParams,
  timeRange,
} from "@/components/Metrics/utils";
import React from "react";
import { MetricsTotals } from "@polar-sh/sdk/models/components/metricstotals.js";

export default function Index() {
  const { organization } = useContext(OrganizationContext);
  const [selectedTimeInterval, setSelectedTimeInterval] =
    useState<keyof ReturnType<typeof timeRange>>("30d");

  if (!organization) {
    return null;
  }

  const { startDate, endDate } = useMemo(() => {
    return {
      startDate: timeRange(organization)[selectedTimeInterval].startDate,
      endDate: timeRange(organization)[selectedTimeInterval].endDate,
    };
  }, [selectedTimeInterval]);

  const previousPeriod = useMemo(() => {
    const previousParams = getPreviousParams(startDate);

    if (selectedTimeInterval === "all_time") {
      return null;
    }

    return {
      startDate: previousParams[selectedTimeInterval].startDate,
      endDate: previousParams[selectedTimeInterval].endDate,
    };
  }, [selectedTimeInterval, startDate]);

  const metrics = useMetrics(organization?.id, startDate, endDate, {
    interval: dateRangeToInterval(startDate, endDate),
  });

  const previousMetrics = useMetrics(
    organization?.id,
    previousPeriod?.startDate ?? startDate,
    previousPeriod?.endDate ?? endDate,
    {
      interval: dateRangeToInterval(
        previousPeriod?.startDate ?? startDate,
        previousPeriod?.endDate ?? endDate
      ),
    },
    !!previousPeriod
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Metrics",
        }}
      />
      <SafeAreaView style={MetricsStyles.tabsStyle}>
        <Tabs
          defaultValue={selectedTimeInterval}
          onValueChange={(value) =>
            setSelectedTimeInterval(value as keyof ReturnType<typeof timeRange>)
          }
        >
          <TabsList>
            {Object.entries(timeRange(organization)).map(([key, value]) => {
              return (
                <TabsTrigger key={key} value={key}>
                  {value.title}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </SafeAreaView>
      <FlatList
        style={MetricsStyles.container}
        contentContainerStyle={MetricsStyles.contentContainer}
        contentInset={{ bottom: 48 }}
        data={Object.entries(metrics.data?.metrics ?? {}).map(
          ([metric, value]) => {
            return {
              metric,
              value,
            };
          }
        )}
        renderItem={({ item }) => {
          const trend =
            (metrics.data?.totals[item.value.slug as keyof MetricsTotals] ??
              0) -
            (previousMetrics.data?.totals[
              item.value.slug as keyof MetricsTotals
            ] ?? 0);

          return (
            <Chart
              key={item.metric}
              currentPeriodData={metrics.data}
              previousPeriodData={previousMetrics.data}
              title={item.value.displayName}
              metric={item.value}
              trend={trend}
            />
          );
        }}
        keyExtractor={(item) => item.metric}
        refreshControl={
          <RefreshControl
            refreshing={metrics.isRefetching}
            onRefresh={metrics.refetch}
          />
        }
      />
    </>
  );
}

const MetricsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsStyle: {
    margin: 16,
  },
  contentContainer: {
    flexDirection: "column",
    padding: 16,
    gap: 16,
  },
});
