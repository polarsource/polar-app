import { useTheme } from "@/hooks/theme";
import { Text, TextProps } from "react-native";

type ThemedTextProps = TextProps & {
  secondary?: boolean;
};

export const ThemedText = (props: ThemedTextProps) => {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      style={[
        { color: props.secondary ? colors.subtext : colors.text },
        props.style,
      ]}
    />
  );
};
