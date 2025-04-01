import { polar } from "@/utils/polar";
import { OrdersListRequest } from "@polar-sh/sdk/dist/commonjs/models/operations/orderslist";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ["orders", { id }],
    queryFn: () => polar.orders.get({ id }),
  });

export const useOrders = (
  organizationId?: string,
  parameters?: Omit<OrdersListRequest, "organizationId">
) =>
  useInfiniteQuery({
    queryKey: ["orders", { organizationId, ...(parameters || {}) }],
    queryFn: ({ pageParam = 1 }) =>
      polar.orders.list({
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
