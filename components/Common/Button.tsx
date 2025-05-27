import { useTheme } from "@/hooks/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { children, onPress, disabled, loading } = props;
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      style={[styles.button, { backgroundColor: colors.primary }]}
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
    height: 40,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
