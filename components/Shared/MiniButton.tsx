import { useTheme } from "@/hooks/theme";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface MiniButtonProps extends TouchableOpacityProps {
  icon?: React.ReactNode;
}

export const MiniButton = ({
  children,
  onPress,
  style,
  icon,
  ...props
}: MiniButtonProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, { backgroundColor: colors.primary }, style]}
      onPress={onPress}
      {...props}
    >
      {icon && <View style={{ marginRight: 4 }}>{icon}</View>}
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
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
