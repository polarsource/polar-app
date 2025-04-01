import { polar } from "@/utils/polar";
import { OrdersListRequest } from "@polar-sh/sdk/dist/commonjs/models/operations/orderslist";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (organizationId: string, id: string) =>
  useQuery({
    queryKey: ["products", organizationId, { id }],
    queryFn: () => polar.products.get({ id }),
    enabled: !!organizationId,
  });
