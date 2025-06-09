import { useTheme } from "@/hooks/theme";
import { Stack } from "expo-router";
import { RefreshControl, ScrollView } from "react-native";

export default function Finance() {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: colors.background, gap: 32 }}
      refreshControl={
        /*  <RefreshControl onRefresh={refresh} refreshing={isRefetching} /> */ undefined
      }
      contentInset={{ bottom: 48 }}
    >
      <Stack.Screen options={{ title: "Finance" }} />
    </ScrollView>
  );
}
