import { useOrder } from "@/hooks/polar/orders";
import { useProduct } from "@/hooks/polar/products";
import { formatCurrencyAndAmount } from "@/utils/money";
import { useTheme } from "@/hooks/theme";
import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { OrganizationContext } from "@/utils/providers";
import { useContext } from "react";

export default function Index() {
  const { id } = useLocalSearchParams();
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();

  const { data: order } = useOrder(id as string);
  const { data: product } = useProduct(
    organization.id,
    order?.product?.id ?? ""
  );

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
    >
      <Stack.Screen
        options={{
          title: "Order",
        }}
      />
      <View style={styles.header}>
        {product?.medias?.[0]?.publicUrl ? (
          <Image
            source={{ uri: product.medias[0].publicUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[styles.imageFallback, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.fallbackText, { color: colors.text }]}>
              {order.product.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={[styles.productName, { color: colors.text }]}>
          {order.product.name}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.customerContainer}>
          <View style={styles.avatarContainer}>
            {order.customer.avatarUrl ? (
              <Image
                source={{ uri: order.customer.avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  { backgroundColor: colors.card },
                ]}
              >
                <Text
                  style={[styles.avatarFallbackText, { color: colors.text }]}
                >
                  {order.customer.name?.charAt(0).toUpperCase() ||
                    order.customer.email.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.customerInfo}>
            {order.customer.name && (
              <Text style={[styles.customerName, { color: colors.text }]}>
                {order.customer.name}
              </Text>
            )}
            <Text style={[styles.customerEmail, { color: colors.text }]}>
              {order.customer.email}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Order Details
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Order ID</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {order.id}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>
              Order Date
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {order.createdAt.toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Subtotal</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(order.subtotalAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Discount</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              -{formatCurrencyAndAmount(order.discountAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>
              Net amount
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatCurrencyAndAmount(order.netAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Tax</Text>
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

      {order.billingAddress && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Billing Address
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {order.billingAddress.line1 && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Address
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {order.billingAddress.line1}
                </Text>
              </View>
            )}
            {order.billingAddress.line2 && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Address 2
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {order.billingAddress.line2}
                </Text>
              </View>
            )}
            {order.billingAddress.city && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>City</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {order.billingAddress.city}
                </Text>
              </View>
            )}
            {order.billingAddress.state && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>
                  State
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {order.billingAddress.state}
                </Text>
              </View>
            )}
            {order.billingAddress.postalCode && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Postal Code
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {order.billingAddress.postalCode}
                </Text>
              </View>
            )}
            {order.billingAddress.country && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Country
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {order.billingAddress.country}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {order.metadata && Object.keys(order.metadata).length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Additional Information
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {Object.entries(order.metadata).map(([key, value]) => (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    flexDirection: "column",
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
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
