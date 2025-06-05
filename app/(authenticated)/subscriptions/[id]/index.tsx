import { useOrder, useOrders } from "@/hooks/polar/orders";
import { useProduct } from "@/hooks/polar/products";
import { formatCurrencyAndAmount } from "@/utils/money";
import { useTheme } from "@/hooks/theme";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { CustomerRow } from "@/components/Customers/CustomerRow";
import * as Clipboard from "expo-clipboard";
import { DetailRow } from "@/components/Common/Details";
import { Details } from "@/components/Common/Details";
import { useSubscription } from "@/hooks/polar/subscriptions";
import { OrderRow } from "@/components/Orders/OrderRow";
import { useMemo } from "react";
import React from "react";
import { EmptyState } from "@/components/Common/EmptyState";

export default function Index() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const {
    data: subscription,
    refetch,
    isRefetching,
  } = useSubscription(id as string);

  const { data: subscriptionOrders } = useOrders(subscription?.customer.id, {
    customerId: subscription?.customer.id,
    productId: subscription?.product.id,
  });

  const flatSubscriptionOrders = useMemo(() => {
    return subscriptionOrders?.pages.flatMap((page) => page.result.items) ?? [];
  }, [subscriptionOrders]);

  if (!subscription) {
    return (
      <Stack.Screen
        options={{
          title: "Subscription",
        }}
      />
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ flexDirection: "column", gap: 16 }}
      refreshControl={
        <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
      }
      contentInset={{ bottom: 48 }}
    >
      <Stack.Screen
        options={{
          title: "Subscription",
        }}
      />

      <View style={[styles.section, { gap: 12, flexDirection: "row" }]}>
        <TouchableOpacity
          style={[
            styles.box,
            { backgroundColor: colors.card, flex: 1, gap: 4, width: "50%" },
          ]}
          onPress={() => {
            Clipboard.setStringAsync(subscription.id);
          }}
          activeOpacity={0.6}
        >
          <Text style={[styles.label, { color: colors.subtext, fontSize: 18 }]}>
            #
          </Text>
          <Text
            style={[
              styles.value,
              { color: colors.text, textTransform: "uppercase", fontSize: 18 },
            ]}
            numberOfLines={1}
          >
            {subscription.id.split("-").pop()?.slice(-6, -1)}
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.box,
            { backgroundColor: colors.card, flex: 1, gap: 4, width: "50%" },
          ]}
        >
          <Text style={[styles.label, { color: colors.subtext }]}>Date</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {subscription.createdAt.toLocaleDateString("en-US", {
              dateStyle: "medium",
            })}
          </Text>
        </View>
      </View>

      <CustomerRow customer={subscription.customer} />

      <View style={styles.section}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, gap: 0, paddingVertical: 0 },
          ]}
        >
          <View
            style={{
              gap: 4,
              paddingVertical: 16,
            }}
          >
            <Text
              style={[styles.label, { color: colors.text }]}
              numberOfLines={1}
            >
              {subscription.product.name}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(subscription.amount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Details>
          <DetailRow
            label="Status"
            value={subscription.status.split("_").join(" ")}
          />
          <DetailRow
            label="Recurring Interval"
            value={subscription.recurringInterval.split("_").join(" ")}
          />
          <DetailRow
            label="Start Date"
            value={subscription.startedAt?.toLocaleDateString("en-US", {
              dateStyle: "medium",
            })}
          />
          <DetailRow
            label="Renewal Date"
            value={subscription.currentPeriodEnd?.toLocaleDateString("en-US", {
              dateStyle: "medium",
            })}
          />
          {subscription.endsAt && (
            <DetailRow
              label="End Date"
              value={subscription.endsAt?.toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            />
          )}
        </Details>
      </View>

      {subscription.metadata &&
        Object.keys(subscription.metadata).length > 0 && (
          <View style={styles.section}>
            <Details>
              {Object.entries(subscription.metadata).map(([key, value]) => (
                <DetailRow key={key} label={key} value={String(value)} />
              ))}
            </Details>
          </View>
        )}

      <View style={[styles.section, { gap: 16, paddingVertical: 12 }]}>
        <Text style={[styles.label, { color: colors.text, fontSize: 20 }]}>
          Subscription Orders
        </Text>
        {flatSubscriptionOrders.length > 0 ? (
          <>
            {flatSubscriptionOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </>
        ) : (
          <EmptyState
            title="No Subscription Orders"
            description="This Subscription has no associated orders"
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    flexDirection: "column",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  imageFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
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
  box: {
    flexDirection: "column",
    gap: 4,
    borderRadius: 12,
    padding: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
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
  customerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  customerEmail: {
    fontSize: 14,
    color: "#666",
  },
});
