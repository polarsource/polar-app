import { useTheme } from "@/hooks/theme";
import { StyleSheet, Text, View } from "react-native";

export const Details = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
};

export const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>
      <Text
        numberOfLines={1}
        style={[styles.value, { color: value ? colors.text : colors.subtext }]}
      >
        {value && value?.length > 0 ? value : "—"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: "#fff",
  },
});
