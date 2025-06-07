import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Customer } from "@polar-sh/sdk/models/components/customer";
import { Avatar } from "../Common/Avatar";
import { Link } from "expo-router";
import { useTheme } from "@/hooks/theme";

export interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  const { colors } = useTheme();

  return (
    <Link
      href={`/customers/${customer.id}`}
      style={[styles.container, { backgroundColor: colors.card }]}
      asChild
    >
      <TouchableOpacity activeOpacity={0.6}>
        <Avatar
          size={64}
          name={customer.name ?? customer.email}
          image={customer.avatarUrl ?? undefined}
        />
        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]}>
            {customer.name ?? "—"}
          </Text>
          <Text
            style={[styles.email, { color: colors.subtext }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {customer.email}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 32,
    borderRadius: 16,
    width: Dimensions.get("screen").width * 0.66,
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
