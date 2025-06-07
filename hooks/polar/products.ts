import { usePolarClient } from "@/providers/PolarClientProvider";
import { ProductsListRequest } from "@polar-sh/sdk/models/operations/productslist.js";
import { useQuery } from "@tanstack/react-query";

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
