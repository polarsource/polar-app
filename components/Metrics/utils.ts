import { formatCurrencyAndAmount } from "@/utils/money";
import { Metric } from "@polar-sh/sdk/models/components/metric.js";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  subDays,
  subHours,
} from "date-fns";

const scalarFormatter = Intl.NumberFormat("en-US", {});
const percentageFormatter = Intl.NumberFormat("en-US", {
  style: "percent",
});

export const getFormattedMetricValue = (
  metric: Metric,
  value: number
): string => {
  switch (metric.type) {
    case "scalar":
      return scalarFormatter.format(value);
    case "currency":
      return formatCurrencyAndAmount(value, "usd", 0);
    case "percentage":
      return percentageFormatter.format(value);
  }
};

export const dateRangeToInterval = (startDate: Date, endDate: Date) => {
  const diffInYears = differenceInYears(endDate, startDate);
  const diffInMonths = differenceInMonths(endDate, startDate);
  const diffInWeeks = differenceInWeeks(endDate, startDate);
  const diffInDays = differenceInDays(endDate, startDate);

  if (diffInYears >= 3) {
    return "year";
  } else if (diffInMonths >= 4) {
    return "month";
  } else if (diffInWeeks > 4) {
    return "week";
  } else if (diffInDays > 1) {
    return "day";
  } else {
    return "hour";
  }
};

export const timeRange = {
  "24h": {
    startDate: subHours(new Date(), 24),
    endDate: new Date(),
    title: "24h",
    description: "Last 24 hours",
  },
  "30d": {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    title: "30d",
    description: "Last 30 days",
  },
  "3m": {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    title: "3m",
    description: "Last 3 months",
  },
  all_time: {
    startDate: subDays(new Date(), 365),
    endDate: new Date(),
    title: "All Time",
    description: "All time",
  },
} as const;

export const getPreviousParams = (startDate: Date): typeof timeRange => {
  return {
    "24h": {
      startDate: subHours(startDate, 24),
      endDate: startDate,
      title: "24h",
      description: "Last 24 hours",
    },
    "30d": {
      startDate: subDays(startDate, 30),
      endDate: startDate,
      title: "30d",
      description: "Last 30 days",
    },
    "3m": {
      startDate: subDays(startDate, 30),
      endDate: startDate,
      title: "3m",
      description: "Last 3 months",
    },
    all_time: {
      startDate: subDays(startDate, 365),
      endDate: startDate,
      title: "All Time",
      description: "All time",
    },
  };
};
