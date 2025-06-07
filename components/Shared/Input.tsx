import { useTheme } from "@/hooks/theme";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

export const Input = (props: TextInputProps) => {
  const { colors, theme } = useTheme();

  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.subtext}
      keyboardAppearance={theme === "dark" ? "dark" : "light"}
      style={[
        styles.input,
        { backgroundColor: colors.card, color: colors.text },
        props.style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
});
