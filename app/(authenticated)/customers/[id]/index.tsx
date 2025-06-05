import { Avatar } from "@/components/Common/Avatar";
import { DetailRow } from "@/components/Common/Details";
import { Details } from "@/components/Common/Details";
import { EmptyState } from "@/components/Common/EmptyState";
import { OrderRow } from "@/components/Orders/OrderRow";
import { useCustomer } from "@/hooks/polar/customers";
import { useMetrics } from "@/hooks/polar/metrics";
import { useOrders } from "@/hooks/polar/orders";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { formatCurrencyAndAmount } from "@/utils/money";
import { TimeInterval } from "@polar-sh/sdk/models/components/timeinterval.js";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useContext, useMemo } from "react";
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
    refetch: refetchCustomer,
    isRefetching: isCustomerRefetching,
  } = useCustomer(organization.id, id as string);

  const startDate = useMemo(() => {
    return new Date(customer?.createdAt ?? new Date());
  }, [customer]);

  const endDate = useMemo(() => {
    return new Date();
  }, []);

  const {
    data: metrics,
    refetch: refetchMetrics,
    isRefetching: isMetricsRefetching,
  } = useMetrics(organization.id, startDate, endDate, {
    interval: TimeInterval.Month,
    customerId: id as string,
  });

  const {
    data: orders,
    refetch: refetchOrders,
    isRefetching: isOrdersRefetching,
  } = useOrders(organization.id, {
    customerId: id as string,
  });

  const flatOrders = useMemo(() => {
    return orders?.pages.flatMap((page) => page.result.items) ?? [];
  }, [orders]);

  const isRefetching =
    isCustomerRefetching || isOrdersRefetching || isMetricsRefetching;

  const refetch = useCallback(() => {
    return Promise.allSettled([
      refetchCustomer(),
      refetchOrders(),
      refetchMetrics(),
    ]);
  }, [refetchCustomer, refetchOrders, refetchMetrics]);

  return (
    <>
      <Stack.Screen
        options={{
          title: customer?.name ?? "Customer",
        }}
      />
      <ScrollView
        style={[styles.container]}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        contentContainerStyle={{
          flexDirection: "column",
          gap: 24,
        }}
        contentInset={{ bottom: 48 }}
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
            <Text style={[styles.customerEmail, { color: colors.subtext }]}>
              {customer?.email}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              backgroundColor: colors.card,
              padding: 12,
              borderRadius: 12,
              flex: 1,
              gap: 8,
            }}
          >
            <Text style={[styles.label, { color: colors.subtext }]}>
              Revenue
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(
                metrics?.periods[metrics?.periods.length - 1]
                  .cumulativeRevenue ?? 0
              )}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.card,
              padding: 12,
              borderRadius: 12,
              flex: 1,
              gap: 8,
            }}
          >
            <Text style={[styles.label, { color: colors.subtext }]}>
              First Seen
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {new Date(customer?.createdAt ?? "").toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Details>
            <DetailRow
              label="Address"
              value={customer?.billingAddress?.line1}
            />
            <DetailRow
              label="Address 2"
              value={customer?.billingAddress?.line2}
            />
            <DetailRow label="City" value={customer?.billingAddress?.city} />
            <DetailRow label="State" value={customer?.billingAddress?.state} />
            <DetailRow
              label="Postal Code"
              value={customer?.billingAddress?.postalCode}
            />
            <DetailRow
              label="Country"
              value={customer?.billingAddress?.country}
            />
          </Details>
        </View>

        {customer?.metadata && Object.keys(customer.metadata).length > 0 && (
          <View style={styles.section}>
            <Details>
              {Object.entries(customer.metadata).map(([key, value]) => (
                <DetailRow key={key} label={key} value={String(value)} />
              ))}
            </Details>
          </View>
        )}

        <View style={{ gap: 16, flexDirection: "column", flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 24, color: colors.text }}>Orders</Text>
          </View>
          {flatOrders.length > 0 ? (
            <View style={{ gap: 8 }}>
              {flatOrders.map((order) => (
                <OrderRow key={order.id} order={order} showTimestamp />
              ))}
            </View>
          ) : (
            <EmptyState
              title="No Orders"
              description="No orders found for this customer"
            />
          )}
        </View>
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
    gap: 24,
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
