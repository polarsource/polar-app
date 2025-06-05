import { View, Text, StyleSheet } from "react-native";
import { Button, ButtonProps } from "./Button";
import { useTheme } from "@/hooks/theme";

export interface BannerProps {
  title: string;
  description: string;
  button?: ButtonProps;
}

export const Banner = ({ title, description, button }: BannerProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.subtext }]}>
          {description}
        </Text>
      </View>
      {button && (
        <Button
          {...button}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    height: 32,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "normal",
  },
});
