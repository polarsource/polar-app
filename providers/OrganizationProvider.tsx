import { useOrganizations } from "@/hooks/polar/organizations";
import { createContext, useEffect, useState } from "react";
import { Organization } from "@polar-sh/sdk/dist/commonjs/models/components/organization";

export interface OrganizationContextValue {
  organization: Organization;
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
  const [organization, setOrganization] = useState<Organization | null>(null);

  const { data: organizationData } = useOrganizations();

  useEffect(() => {
    setOrganization(organizationData?.result.items[0] ?? null);
  }, [organizationData]);

  if (!organization) {
    return null;
  }

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
}
