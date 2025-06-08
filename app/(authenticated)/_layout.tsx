import { Redirect, Stack, useRouter } from "expo-router";
import React from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useTheme } from "@/hooks/theme";
import { StatusBar } from "react-native";
import { PolarQueryClientProvider } from "@/providers/PolarQueryClientProvider";
import { PolarOrganizationProvider } from "@/providers/OrganizationProvider";
import { useSession } from "@/providers/SessionProvider";
import { PolarClientProvider } from "@/providers/PolarClientProvider";
import NotificationsProvider from "@/providers/NotificationsProvider";
import { ErrorBoundary as ErrorBoundaryComponent } from "react-error-boundary";
import { ErrorFallback } from "@/components/Errors/Fallback";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

const RootLayout = () => {
  const { colors, theme } = useTheme();
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 18,
          },
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      />
    </>
  );
};

export default function Providers() {
  const router = useRouter();

  return (
    <PolarQueryClientProvider>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundaryComponent
            onReset={() => {
              reset();
              router.replace("/");
            }}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
              />
            )}
          >
            <ThemeProvider value={DarkTheme}>
              <PolarClientProvider>
                <NotificationsProvider>
                  <PolarOrganizationProvider>
                    <RootLayout />
                  </PolarOrganizationProvider>
                </NotificationsProvider>
              </PolarClientProvider>
            </ThemeProvider>
          </ErrorBoundaryComponent>
        )}
      </QueryErrorResetBoundary>
    </PolarQueryClientProvider>
  );
}
