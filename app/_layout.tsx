import {
  PolarOrganizationProvider,
  PolarQueryClientProvider,
} from "@/utils/providers";
import { Stack } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useTheme } from "@/hooks/theme";
import { StatusBar } from "react-native";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <ThemeProvider value={DarkTheme}>
      <PolarQueryClientProvider>
        <PolarOrganizationProvider>
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
        </PolarOrganizationProvider>
      </PolarQueryClientProvider>
    </ThemeProvider>
  );
}
