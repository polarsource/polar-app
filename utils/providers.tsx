import { useOrganizations } from "@/hooks/polar/organizations";
import { queryClient, QueryClientProvider } from "./query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { createContext, useEffect, useState } from "react";
import { Organization } from "@polar-sh/sdk/dist/commonjs/models/components/organization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

export function PolarQueryClientProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

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

export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = "@app_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Use system theme as default if no saved theme
        setTheme(systemColorScheme || "light");
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
