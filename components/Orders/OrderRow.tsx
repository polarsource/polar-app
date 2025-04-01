import { useProduct } from "@/hooks/polar/products";
import { useTheme } from "@/hooks/theme";
import { formatCurrencyAndAmount } from "@/utils/money";
import { OrganizationContext } from "@/utils/providers";
import { Order } from "@polar-sh/sdk/dist/commonjs/models/components/order";
import { Link } from "expo-router";
import { useContext } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export interface OrderRowProps {
  order: Order;
}

export const OrderRow = ({ order }: OrderRowProps) => {
  const { colors } = useTheme();
  const { organization } = useContext(OrganizationContext);
  const { data: product } = useProduct(organization.id, order.product.id);

  return (
    <Link
      href={`/orders/${order.id}`}
      style={[styles.container, { backgroundColor: colors.card }]}
      asChild
    >
      <Pressable>
        <View style={styles.imageContainer}>
          {product?.medias?.[0]?.publicUrl ? (
            <Image
              source={{ uri: product?.medias?.[0]?.publicUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.fallbackText}>
                {order.product.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{order.product.name}</Text>
          <View style={styles.metadataContainer}>
            <Text style={styles.amount}>
              {formatCurrencyAndAmount(order.netAmount)}
            </Text>
            <Text>•</Text>
            <Text style={styles.email}>{order.customer.email}</Text>
          </View>
        </View>
      </Pressable>
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
  image: {
    width: "100%",
    height: "100%",
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
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  amount: {
    fontSize: 16,
    color: "#999",
  },
  email: {
    fontSize: 16,
    color: "#999",
  },
  metadataContainer: {
    flexDirection: "row",
    gap: 4,
  },
});
