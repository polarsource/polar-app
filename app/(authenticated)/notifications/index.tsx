import { View, Text } from "react-native";
import { useTheme } from "@/hooks/theme";
import { Stack } from "expo-router";

export default function Notifications() {
  const { colors } = useTheme();

  return (
    <View>
      <Stack.Screen options={{ title: "Notifications" }} />
      <Text style={{ color: colors.text }}>Notifications</Text>
    </View>
  );
}
