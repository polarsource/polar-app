import { usePolarClient } from "@/providers/PolarClientProvider";
import { OrganizationsGetRequest } from "@polar-sh/sdk/models/operations/organizationsget";
import { useQuery } from "@tanstack/react-query";

export const useOrganizations = (
  {
    enabled = true,
  }: {
    enabled?: boolean;
  } = { enabled: true }
) => {
  const { polar } = usePolarClient();

  return useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      polar.organizations.list({
        limit: 100,
      }),
    enabled,
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
