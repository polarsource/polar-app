import { useProduct } from "@/hooks/polar/products";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
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
import { Pill } from "../Common/Pill";

export interface SubscriptionRowProps {
  subscription: Subscription;
  showCustomer?: boolean;
  style?: StyleProp<TextStyle>;
}

export const SubscriptionRow = ({
  subscription,
  style,
  showCustomer,
}: SubscriptionRowProps) => {
  const { colors } = useTheme();
  const product = subscription.product;

  return (
    <Link
      href={`/subscriptions/${subscription.id}`}
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
                  backgroundColor: colors.border,
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
          <Text style={styles.productName}>{subscription.product.name}</Text>
          <View style={styles.metadataContainer}>
            <Pill color={subscription.status === "active" ? "green" : "red"}>
              {subscription.status.split("_").join(" ")}
            </Pill>
            {showCustomer && (
              <>
                <Text style={{ color: colors.subtext }}>•</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.email,
                    { color: colors.subtext, flexWrap: "wrap" },
                  ]}
                >
                  {subscription.customer.email}
                </Text>
              </>
            )}
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
  status: {
    fontSize: 16,
    textTransform: "capitalize",
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
