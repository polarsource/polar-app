import {
  MaintainerAccountUnderReviewNotificationPayload,
  MaintainerCreateAccountNotificationPayload,
} from "@/hooks/polar/notifications";
import { MaintainerAccountReviewedNotificationPayload } from "@/hooks/polar/notifications";
import { MaintainerNewProductSaleNotificationPayload } from "@/hooks/polar/notifications";
import { MaintainerNewPaidSubscriptionNotificationPayload } from "@/hooks/polar/notifications";
import { useTheme } from "@/hooks/theme";
import { formatCurrencyAndAmount } from "@/utils/money";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";

export interface NotificationProps {
  style?: StyleProp<ViewStyle>;
  type: string;
  createdAt: string;
  payload:
    | MaintainerAccountUnderReviewNotificationPayload
    | MaintainerAccountReviewedNotificationPayload
    | MaintainerCreateAccountNotificationPayload
    | MaintainerNewPaidSubscriptionNotificationPayload
    | MaintainerNewProductSaleNotificationPayload;
}

export const Notification = ({
  type,
  payload,
  style,
  createdAt,
}: NotificationProps) => {
  const { colors } = useTheme();

  const icon = useMemo(() => {
    switch (type) {
      case "MaintainerNewPaidSubscriptionNotification":
        return (
          <MaterialIcons name="all-inclusive" size={20} color={colors.text} />
        );
      case "MaintainerNewProductSaleNotification":
        return (
          <MaterialIcons
            name="lightbulb-outline"
            size={20}
            color={colors.text}
          />
        );
      case "MaintainerAccountUnderReviewNotification":
        return (
          <MaterialIcons name="person-outline" size={20} color={colors.text} />
        );
      case "MaintainerAccountReviewedNotification":
        return (
          <MaterialIcons name="person-outline" size={20} color={colors.text} />
        );
      case "MaintainerCreateAccountNotification":
        return (
          <MaterialIcons name="person-outline" size={20} color={colors.text} />
        );
      default:
        return (
          <MaterialIcons name="notifications" size={20} color={colors.text} />
        );
    }
  }, [type]);

  const title = useMemo(() => {
    switch (type) {
      case "MaintainerNewPaidSubscriptionNotification":
        return "New Subscription";
      case "MaintainerNewProductSaleNotification":
        return "New Product Sale";
      case "MaintainerAccountUnderReviewNotification":
        return "Account Under Review";
      case "MaintainerAccountReviewedNotification":
        return "Account Reviewed";
      case "MaintainerCreateAccountNotification":
        return "New Account Created";
      default:
        return "New Notification";
    }
  }, [type]);

  const description = useMemo(() => {
    switch (type) {
      case "MaintainerNewPaidSubscriptionNotification":
        const { subscriber_name, tier_name } =
          payload as MaintainerNewPaidSubscriptionNotificationPayload;
        return `${subscriber_name} subscribed to ${tier_name}`;
      case "MaintainerNewProductSaleNotification":
        const { customer_name, product_name, product_price_amount } =
          payload as MaintainerNewProductSaleNotificationPayload;
        return `${customer_name} bought ${product_name} for ${formatCurrencyAndAmount(
          product_price_amount
        )}`;
      case "MaintainerAccountUnderReviewNotification":
        return "Your account is under review";
      case "MaintainerAccountReviewedNotification":
        return "Your account has been reviewed";
      case "MaintainerCreateAccountNotification":
        return "A new account has been created";
      default:
        return "A new notification has been created";
    }
  }, [type]);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.icon, { backgroundColor: colors.card }]}>
        <Text style={{ color: colors.text }}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={{ color: colors.text }}>{title}</Text>
          <Text style={{ color: colors.subtext }}>
            {new Date(createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
        </View>
        <Text style={{ lineHeight: 20, color: colors.subtext }}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  header: {
    flexDirection: "row",
    gap: 12,
  },
});
