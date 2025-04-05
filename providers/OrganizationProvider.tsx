import { useOrganizations } from "@/hooks/polar/organizations";
import { createContext, useEffect, useMemo, useState } from "react";
import { Organization } from "@polar-sh/sdk/dist/commonjs/models/components/organization";
import { useStorageState } from "@/hooks/storage";

export interface OrganizationContextValue {
  organization: Organization;
  organizations: Organization[];
  setOrganization: (organization: Organization) => void;
}

const stub = (): never => {
  throw new Error(
    "You forgot to wrap your component in <PolarOrganizationProvider>."
  );
};

export const OrganizationContext =
  // @ts-ignore
  createContext<OrganizationContextValue>(stub);

export function PolarOrganizationProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [[isLoading, organizationId], setOrganizationId] =
    useStorageState("organizationId");

  const { data: organizationData } = useOrganizations();

  useEffect(() => {
    if (!organizationId) {
      setOrganizationId(organizationData?.result.items[0].id ?? null);
    }
  }, [organizationData]);

  const organization = useMemo(() => {
    return organizationData?.result.items.find(
      (organization) => organization.id === organizationId
    );
  }, [organizationData, organizationId]);

  if (!organization) {
    return null;
  }

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        organizations: organizationData?.result.items ?? [],
        setOrganization: (organization: Organization) => {
          setOrganizationId(organization.id);
        },
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
