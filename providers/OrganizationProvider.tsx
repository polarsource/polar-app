import { useOrganizations } from "@/hooks/polar/organizations";
import { createContext, PropsWithChildren, useEffect, useMemo } from "react";
import { Organization } from "@polar-sh/sdk/models/components/organization.js";
import { useStorageState } from "@/hooks/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSession } from "./SessionProvider";

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

export function PolarOrganizationProvider({ children }: PropsWithChildren) {
  const [[isLoading, organizationId], setOrganizationId] =
    useStorageState("organizationId");

  const { session } = useSession();

  const { data: organizationData } = useOrganizations({
    enabled: !!session,
  });

  useEffect(() => {
    AsyncStorage.getItem("organizationId").then((organizationId) => {
      setOrganizationId(organizationId ?? null);
    });
  }, []);

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

          AsyncStorage.setItem("organizationId", organization.id);
        },
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
