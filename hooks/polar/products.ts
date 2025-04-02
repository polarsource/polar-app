import { usePolarClient } from "@/providers/PolarClientProvider";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (organizationId: string, id: string) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["products", organizationId, { id }],
    queryFn: () => polar.products.get({ id }),
    enabled: !!organizationId,
  });
};
