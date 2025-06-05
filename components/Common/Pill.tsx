import { View, Text, StyleSheet } from "react-native";

export const Pill = ({
  color,
  children,
}: {
  color: "green" | "yellow" | "red" | "blue" | "purple";
  children: React.ReactNode;
}) => {
  return (
    <View style={[styles.pill, styles[color]]}>
      <Text style={[styles.text, styles[color]]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  text: {
    color: "#fff",
    textTransform: "capitalize",
  },
  green: {
    color: "#10B981",
    backgroundColor: "#10B981",
  },
  yellow: {
    color: "#F59E0B",
    backgroundColor: "#F59E0B",
  },
  red: {
    color: "#EF4444",
    backgroundColor: "#EF4444",
  },
  blue: {
    color: "#3B82F6",
    backgroundColor: "#3B82F6",
  },
  purple: {
    color: "#A855F7",
    backgroundColor: "#A855F7",
  },
});
