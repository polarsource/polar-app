import { useTheme } from "@/hooks/theme";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "./ThemedText";

export const MiniButton = ({
  children,
  onPress,
  style,
  ...props
}: TouchableOpacityProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, { backgroundColor: colors.primary }, style]}
      onPress={onPress}
      {...props}
    >
      <ThemedText style={{ fontSize: 14, fontWeight: "500" }}>
        {children}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "auto",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
