import { useProduct } from "@/hooks/polar/products";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/utils/providers";
import { Order } from "@polar-sh/sdk/dist/commonjs/models/components/order";
import { Link } from "expo-router";
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from "react-native";

export interface OrderRowProps {
  order: Order;
  showTimestamp?: boolean;
  style?: StyleProp<TextStyle>;
}

export const OrderRow = ({ order, style, showTimestamp }: OrderRowProps) => {
  const { colors } = useTheme();
  const { organization } = useContext(OrganizationContext);
  const { data: product } = useProduct(organization.id, order.product.id);

  return (
    <Link
      href={`/orders/${order.id}`}
      style={[styles.container, { backgroundColor: colors.card }, style]}
      asChild
    >
      <TouchableOpacity activeOpacity={0.6}>
        <View style={styles.imageContainer}>
          {product?.medias?.[0]?.publicUrl ? (
            <Image
              source={{ uri: product?.medias?.[0]?.publicUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={[styles.fallbackText, { color: colors.text }]}>
                {order.product.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{order.product.name}</Text>
          <View style={styles.metadataContainer}>
            {showTimestamp && (
              <>
                <Text style={[styles.amount, { color: colors.subtext }]}>
                  {order.createdAt.toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </Text>
                <Text style={{ color: colors.subtext }}>•</Text>
              </>
            )}
            <Text style={[styles.email, { color: colors.subtext }]}>
              {order.customer.email}
            </Text>
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
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  amount: {
    fontSize: 16,
  },
  email: {
    fontSize: 16,
  },
  metadataContainer: {
    flexDirection: "row",
    gap: 6,
  },
});
