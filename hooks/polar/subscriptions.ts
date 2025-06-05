import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { usePolarClient } from "@/providers/PolarClientProvider";
import { SubscriptionsListRequest } from "@polar-sh/sdk/models/operations/subscriptionslist";
import { SDKError } from "@polar-sh/sdk/models/errors/sdkerror.js";
import { Alert } from "react-native";
import { useLogout } from "../auth";
import { useOAuth } from "../oauth";
import { queryClient } from "@/utils/query";

export const useSubscription = (id: string) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["subscriptions", { id }],
    queryFn: () => polar.subscriptions.get({ id }),
  });
};

export const useSubscriptions = (
  organizationId?: string,
  parameters?: Omit<SubscriptionsListRequest, "organizationId">
) => {
  const { polar } = usePolarClient();

  return useInfiniteQuery({
    queryKey: ["subscriptions", { organizationId, ...(parameters || {}) }],
    queryFn: async ({ pageParam = 1 }) =>
      polar.subscriptions.list({
        organizationId,
        ...(parameters || {}),
        page: pageParam,
      }),
    enabled: !!organizationId,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.result.items.length === 0) return undefined;
      return pages.length + 1;
    },
  });
};
