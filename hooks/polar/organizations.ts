import { usePolarClient } from "@/providers/PolarClientProvider";
import { OrganizationsGetRequest } from "@polar-sh/sdk/dist/commonjs/models/operations/organizationsget";
import { useQuery } from "@tanstack/react-query";

export const useOrganizations = () => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      polar.organizations.list({
        limit: 100,
      }),
  });
};

export const useOrganization = (
  organizationId?: string,
  parameters?: Omit<OrganizationsGetRequest, "organizationId">
) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["organizations", { organizationId, ...(parameters || {}) }],
    queryFn: () => polar.orders.list({ organizationId, ...(parameters || {}) }),
    enabled: !!organizationId,
  });
};
