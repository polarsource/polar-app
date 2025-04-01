import { polar } from "@/utils/polar";
import { CustomersListRequest } from "@polar-sh/sdk/dist/commonjs/models/operations/customerslist";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useCustomer = (organizationId: string, id: string) =>
  useQuery({
    queryKey: ["customers", organizationId, { id }],
    queryFn: () => polar.customers.get({ id }),
  });

export const useCustomers = (
  organizationId?: string,
  parameters?: Omit<CustomersListRequest, "organizationId">
) =>
  useInfiniteQuery({
    queryKey: ["customers", { organizationId, ...(parameters || {}) }],
    queryFn: ({ pageParam = 1 }) =>
      polar.customers.list({
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
