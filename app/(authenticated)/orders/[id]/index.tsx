import { useOrder } from "@/hooks/polar/orders";
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

export default function Index() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const { data: order, refetch, isRefetching } = useOrder(id as string);

  if (!order) {
    return (
      <Stack.Screen
        options={{
          title: "Order",
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
          title: "Order",
        }}
      />

      <View style={[styles.section, { gap: 12, flexDirection: "row" }]}>
        <TouchableOpacity
          style={[
            styles.box,
            { backgroundColor: colors.card, flex: 1, gap: 4, width: "50%" },
          ]}
          onPress={() => {
            Clipboard.setStringAsync(order.id);
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
            {order.id.split("-").pop()?.slice(-6, -1)}
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
            {order.createdAt.toLocaleDateString("en-US", {
              dateStyle: "medium",
            })}
          </Text>
        </View>
      </View>

      <CustomerRow customer={order.customer} />

      <View style={styles.section}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, gap: 0, paddingVertical: 0 },
          ]}
        >
          {order.items.map((item, index, arr) => (
            <View
              key={item.id}
              style={{
                borderBottomWidth: index === arr.length - 1 ? 0 : 1,
                borderColor: colors.border,
                gap: 4,
                paddingVertical: 16,
              }}
            >
              <Text
                style={[styles.label, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {formatCurrencyAndAmount(item.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.subtext }]}>
              Subtotal
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(order.subtotalAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.subtext }]}>
              Discount
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              -{formatCurrencyAndAmount(order.discountAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.subtext }]}>
              Net amount
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(order.netAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.subtext }]}>Tax</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(order.taxAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Total</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(order.totalAmount)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Details>
          <DetailRow
            label="Address"
            value={order.customer.billingAddress?.line1}
          />
          <DetailRow
            label="Address 2"
            value={order.customer.billingAddress?.line2}
          />
          <DetailRow label="City" value={order.customer.billingAddress?.city} />
          <DetailRow
            label="State"
            value={order.customer.billingAddress?.state}
          />
          <DetailRow
            label="Postal Code"
            value={order.customer.billingAddress?.postalCode}
          />
          <DetailRow
            label="Country"
            value={order.customer.billingAddress?.country}
          />
        </Details>
      </View>

      {order.metadata && Object.keys(order.metadata).length > 0 && (
        <View style={styles.section}>
          <Details>
            {Object.entries(order.metadata).map(([key, value]) => (
              <DetailRow key={key} label={key} value={String(value)} />
            ))}
          </Details>
        </View>
      )}
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
