import { Redirect, Stack } from "expo-router";
import React from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useTheme } from "@/hooks/theme";
import { StatusBar } from "react-native";
import { PolarQueryClientProvider } from "@/providers/PolarQueryClientProvider";
import { PolarOrganizationProvider } from "@/providers/OrganizationProvider";
import { useSession } from "@/providers/SessionProvider";
import { PolarClientProvider } from "@/providers/PolarClientProvider";
import NotificationsProvider from "@/providers/NotificationsProvider";

export default function RootLayout() {
  const { colors } = useTheme();
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <PolarClientProvider>
        <PolarQueryClientProvider>
          <NotificationsProvider>
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
                      fontSize: 18,
                    },
                    contentStyle: { backgroundColor: colors.background },
                    headerShadowVisible: false,
                  }}
                />
              </>
            </PolarOrganizationProvider>
          </NotificationsProvider>
        </PolarQueryClientProvider>
      </PolarClientProvider>
    </ThemeProvider>
  );
}
