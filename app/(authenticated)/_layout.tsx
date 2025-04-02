import { Redirect, Stack } from "expo-router";
import React from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useTheme } from "@/hooks/theme";
import { StatusBar } from "react-native";
import { PolarQueryClientProvider } from "@/providers/PolarQueryClientProvider";
import { PolarOrganizationProvider } from "@/providers/OrganizationProvider";
import { useSession } from "@/providers/SessionProvider";
import { PolarClientProvider } from "@/providers/PolarClientProvider";

export default function RootLayout() {
  const { colors } = useTheme();
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <PolarClientProvider>
        <PolarQueryClientProvider>
          <PolarOrganizationProvider>
            <>
              <StatusBar barStyle="light-content" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: colors.background,
                    borderBottomWidth: 0,
                  },
                  headerTitleStyle: {
                    color: DarkTheme.colors.text,
                    fontSize: 20,
                  },
                  contentStyle: { backgroundColor: colors.background },
                  headerShadowVisible: false,
                }}
              />
            </>
          </PolarOrganizationProvider>
        </PolarQueryClientProvider>
      </PolarClientProvider>
    </ThemeProvider>
  );
}
