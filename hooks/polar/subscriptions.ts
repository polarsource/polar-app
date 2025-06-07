import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { usePolarClient } from "@/providers/PolarClientProvider";
import { SubscriptionsListRequest } from "@polar-sh/sdk/models/operations/subscriptionslist";
import { SubscriptionRevoke } from "@polar-sh/sdk/models/components/subscriptionrevoke.js";
import { SubscriptionCancel } from "@polar-sh/sdk/models/components/subscriptioncancel.js";
import { queryClient } from "@/utils/query";
import { Subscription } from "@polar-sh/sdk/models/components/subscription.js";

export const useSubscription = (id: string) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["subscription", id],
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

export const useUpdateSubscription = (id: string) => {
  const { polar } = usePolarClient();

  return useMutation({
    mutationFn: (body: SubscriptionRevoke | SubscriptionCancel) =>
      polar.subscriptions.update({ id, subscriptionUpdate: body }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["subscription", id], data);

      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    },
  });
};
