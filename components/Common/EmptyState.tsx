import { useTheme } from "@/hooks/theme";
import { Text, View, StyleSheet } from "react-native";

export interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.subtext }]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 48,
    borderWidth: 1,
    gap: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});
