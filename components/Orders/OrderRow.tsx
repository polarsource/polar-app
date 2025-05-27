import { useProduct } from "@/hooks/polar/products";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
        <View style={[styles.imageContainer]}>
          {product?.medias?.[0]?.publicUrl ? (
            <Image
              source={{ uri: product?.medias?.[0]?.publicUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.imageFallback,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                },
              ]}
            >
              <MaterialIcons name="texture" size={24} color={colors.subtext} />
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
            <Text
              numberOfLines={1}
              style={[
                styles.email,
                { color: colors.subtext, flexWrap: "wrap" },
              ]}
            >
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
    flexShrink: 1,
  },
  metadataContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
});
