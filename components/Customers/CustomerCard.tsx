import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Customer } from "@polar-sh/sdk/dist/commonjs/models/components/customer";
import { Avatar } from "../Common/Avatar";
import { Link } from "expo-router";

export interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <Link href={`/customers/${customer.id}`} asChild>
      <TouchableOpacity style={styles.container} activeOpacity={0.6}>
        <Avatar
          size={64}
          name={customer.name ?? undefined}
          image={customer.avatarUrl ?? undefined}
        />
        <View style={styles.content}>
          <Text style={styles.name}>{customer.name ?? "—"}</Text>
          <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
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
    backgroundColor: "#1c1c1e",
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
