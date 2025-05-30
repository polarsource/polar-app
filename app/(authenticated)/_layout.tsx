import { Redirect, Stack } from "expo-router";
import React from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useTheme } from "@/hooks/theme";
import { Button, StatusBar, Text, View } from "react-native";
import { PolarQueryClientProvider } from "@/providers/PolarQueryClientProvider";
import { PolarOrganizationProvider } from "@/providers/OrganizationProvider";
import { useSession } from "@/providers/SessionProvider";
import { PolarClientProvider } from "@/providers/PolarClientProvider";
import NotificationsProvider from "@/providers/NotificationsProvider";
import { useLogout } from "@/hooks/auth";
import { ErrorBoundary as ErrorBoundaryComponent } from "react-error-boundary";

const RootLayout = () => {
  const { colors } = useTheme();
  const { session } = useSession();
  const logout = useLogout();

  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <ErrorBoundaryComponent
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
            gap: 32,
          }}
        >
          <Text>Something went wrong</Text>
          <Button title="Logout" onPress={logout} />
        </View>
      }
    >
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
    </ErrorBoundaryComponent>
  );
};

export default function Providers() {
  return (
    <ThemeProvider value={DarkTheme}>
      <PolarClientProvider>
        <PolarQueryClientProvider>
          <NotificationsProvider>
            <PolarOrganizationProvider>
              <RootLayout />
            </PolarOrganizationProvider>
          </NotificationsProvider>
        </PolarQueryClientProvider>
      </PolarClientProvider>
    </ThemeProvider>
  );
}
