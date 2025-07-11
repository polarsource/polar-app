import { useContext, useState } from "react";
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
import { subDays, subHours } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/Shared/Tabs";
import {
	dateRangeToInterval,
	getPreviousParams,
	timeRange,
} from "@/components/Metrics/utils";
import React from "react";

export default function Index() {
	const { organization } = useContext(OrganizationContext);
	const [selectedTimeInterval, setSelectedTimeInterval] =
		useState<keyof typeof timeRange>("30d");

	const { startDate, endDate } = {
		startDate: timeRange[selectedTimeInterval].startDate,
		endDate: timeRange[selectedTimeInterval].endDate,
	};

	const { startDate: previousPeriodStartDate, endDate: previousPeriodEndDate } =
		{
			startDate: getPreviousParams(startDate)[selectedTimeInterval].startDate,
			endDate: getPreviousParams(startDate)[selectedTimeInterval].endDate,
		};

	const metrics = useMetrics(organization?.id, startDate, endDate, {
		interval: dateRangeToInterval(startDate, endDate),
	});

	const previousMetrics = useMetrics(
		organization?.id,
		previousPeriodStartDate,
		previousPeriodEndDate,
		{
			interval: dateRangeToInterval(
				previousPeriodStartDate,
				previousPeriodEndDate,
			),
		},
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
						setSelectedTimeInterval(value as keyof typeof timeRange)
					}
				>
					<TabsList>
						{Object.entries(timeRange).map(([key, value]) => {
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
					},
				)}
				renderItem={({ item }) => {
					return (
						<Chart
							key={item.metric}
							currentPeriodData={metrics.data}
							previousPeriodData={previousMetrics.data}
							title={item.value.displayName}
							metric={item.value}
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
