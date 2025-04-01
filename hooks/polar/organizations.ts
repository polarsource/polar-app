import { polar } from "@/utils/polar";
import { OrganizationsGetRequest } from "@polar-sh/sdk/dist/commonjs/models/operations/organizationsget";
import { useQuery } from "@tanstack/react-query";

export const useOrganizations = () =>
  useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      polar.organizations.list({
        limit: 100,
      }),
  });

export const useOrganization = (
  organizationId?: string,
  parameters?: Omit<OrganizationsGetRequest, "organizationId">
) =>
  useQuery({
    queryKey: ["organizations", { organizationId, ...(parameters || {}) }],
    queryFn: () => polar.orders.list({ organizationId, ...(parameters || {}) }),
    enabled: !!organizationId,
  });
