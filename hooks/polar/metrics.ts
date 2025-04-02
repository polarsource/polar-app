import { usePolarClient } from "@/providers/PolarClientProvider";
import { MetricsGetRequest } from "@polar-sh/sdk/dist/commonjs/models/operations/metricsget";
import { RFCDate } from "@polar-sh/sdk/dist/commonjs/types/rfcdate";
import { useQuery } from "@tanstack/react-query";

export const useMetrics = (
  organizationId: string,
  startDate: Date,
  endDate: Date,
  parameters: Omit<MetricsGetRequest, "startDate" | "endDate">
) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: [
      "metrics",
      organizationId,
      { ...parameters, startDate, endDate },
    ],
    queryFn: () =>
      polar.metrics.get({
        organizationId,
        ...(parameters || {}),
        startDate: new RFCDate(startDate),
        endDate: new RFCDate(endDate),
      }),
    enabled: !!organizationId,
  });
};
