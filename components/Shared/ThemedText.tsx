import { useTheme } from "@/hooks/theme";
import { Text, TextProps, StyleSheet } from "react-native";

type ThemedTextProps = TextProps & {
  secondary?: boolean;
};

export const ThemedText = ({ secondary, style, ...props }: ThemedTextProps) => {
  const { colors } = useTheme();

  const lineHeight = (fontSize: number) => {
    const multiplier = fontSize > 20 ? 1.5 : 1.4;
    return fontSize * multiplier;
  };

  const styles = StyleSheet.flatten(style);

  return (
    <Text
      {...props}
      style={[
        {
          color: secondary ? colors.subtext : colors.text,
          lineHeight: lineHeight(styles?.fontSize ?? 14),
        },
        styles,
      ]}
    />
  );
};
