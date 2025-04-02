import { Avatar } from "@/components/Common/Avatar";
import { useCustomer } from "@/hooks/polar/customers";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useContext } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function Index() {
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();

  const { id } = useLocalSearchParams();
  const {
    data: customer,
    isLoading,
    refetch,
    isRefetching,
  } = useCustomer(organization.id, id as string);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Customer Details",
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        contentContainerStyle={{ flex: 1, flexDirection: "column", gap: 32 }}
      >
        <View style={styles.hero}>
          <Avatar
            image={customer?.avatarUrl}
            name={customer?.name ?? ""}
            size={120}
          />
          <View style={styles.heroInfo}>
            <Text style={[styles.customerName, { color: "#fff" }]}>
              {customer?.name ?? "—"}
            </Text>
            <Text style={[styles.customerEmail, { color: colors.text }]}>
              {customer?.email}
            </Text>
          </View>
        </View>
        {customer?.billingAddress && (
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {customer.billingAddress.line1 && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Address
                  </Text>
                  <Text style={[styles.value]}>
                    {customer.billingAddress.line1}
                  </Text>
                </View>
              )}
              {customer.billingAddress.line2 && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Address 2
                  </Text>
                  <Text style={[styles.value]}>
                    {customer.billingAddress.line2}
                  </Text>
                </View>
              )}
              {customer.billingAddress.city && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    City
                  </Text>
                  <Text style={[styles.value]}>
                    {customer.billingAddress.city}
                  </Text>
                </View>
              )}
              {customer.billingAddress.state && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    State
                  </Text>
                  <Text style={[styles.value]}>
                    {customer.billingAddress.state}
                  </Text>
                </View>
              )}
              {customer.billingAddress.postalCode && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Postal Code
                  </Text>
                  <Text style={[styles.value]}>
                    {customer.billingAddress.postalCode}
                  </Text>
                </View>
              )}
              {customer.billingAddress.country && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Country
                  </Text>
                  <Text style={[styles.value]}>
                    {customer.billingAddress.country}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {customer?.metadata && Object.keys(customer.metadata).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Additional Information
            </Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {Object.entries(customer.metadata).map(([key, value]) => (
                <View key={key} style={styles.row}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <Text style={[styles.value, { color: colors.text }]}>
                    {String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    flexDirection: "column",
  },
  hero: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  heroInfo: {
    alignItems: "center",
    flexDirection: "column",
    gap: 6,
  },
  customerName: {
    fontSize: 24,
    fontWeight: "600",
  },
  customerEmail: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  imageFallback: {
    width: 120,
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  fallbackText: {
    fontSize: 36,
    fontWeight: "600",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: "#fff",
  },
  customerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: {
    fontSize: 16,
    fontWeight: "600",
  },
  customerInfo: {
    flexDirection: "column",
    gap: 4,
  },
});
