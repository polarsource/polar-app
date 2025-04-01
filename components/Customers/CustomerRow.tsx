import { useTheme } from "@/hooks/theme";
import { Customer } from "@polar-sh/sdk/dist/commonjs/models/components/customer";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "../Common/Avatar";

export interface CustomerRowProps {
  customer: Customer;
}

export const CustomerRow = ({ customer }: CustomerRowProps) => {
  const { colors } = useTheme();

  return (
    <Link
      href={`/customers/${customer.id}`}
      style={[styles.container, { backgroundColor: colors.card }]}
      asChild
    >
      <TouchableOpacity activeOpacity={0.8}>
        <Avatar image={customer.avatarUrl} name={customer.email} size={36} />
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{customer.name ?? "—"}</Text>
          <View style={styles.metadataContainer}>
            <Text style={styles.metadata}>{customer.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    gap: 12,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2d2d2d",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "#fff",
  },
  metadata: {
    fontSize: 16,
    color: "#999",
  },
  dot: {
    fontSize: 16,
    color: "#999",
  },
  metadataContainer: {
    flexDirection: "row",
    gap: 4,
  },
});
