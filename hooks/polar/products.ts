import { usePolarClient } from "@/providers/PolarClientProvider";
import { ProductsListRequest } from "@polar-sh/sdk/models/operations/productslist.js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useProduct = (organizationId: string, id: string) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["product", organizationId, { id }],
    queryFn: () => polar.products.get({ id }),
    enabled: !!organizationId,
  });
};

export const useProducts = (
  organizationId: string,
  options: Omit<ProductsListRequest, "organizationId">
) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["products", organizationId, { ...options }],
    queryFn: () => polar.products.list({ organizationId, ...options }),
  });
};

export const useInfiniteProducts = (
  organizationId: string,
  options?: Omit<ProductsListRequest, "organizationId">
) => {
  const { polar } = usePolarClient();

  return useInfiniteQuery({
    queryKey: ["infinite", "products", organizationId, { ...options }],
    queryFn: () => polar.products.list({ organizationId, ...options }),
    enabled: !!organizationId,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.result.items.length === 0) return undefined;
      return pages.length + 1;
    },
  });
};
