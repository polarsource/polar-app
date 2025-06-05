import { View, Text, StyleSheet } from "react-native";

export const Pill = ({
  color,
  children,
}: {
  color: "green" | "yellow" | "red" | "blue";
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
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    textTransform: "capitalize",
    fontSize: 12,
  },
  green: {
    color: "#10b981",
    backgroundColor: "#022c22",
  },
  yellow: {
    color: "#eab308",
    backgroundColor: "#422006",
  },
  red: {
    color: "#ef4444",
    backgroundColor: "#450a0a",
  },
  blue: {
    color: "#6366f1",
    backgroundColor: "#1e1b4b",
  },
});
