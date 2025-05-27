import { useTheme } from "@/hooks/theme";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button = (props: ButtonProps) => {
  const { children, onPress, disabled, loading, style } = props;
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      style={[styles.button, { backgroundColor: colors.primary }, style]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
