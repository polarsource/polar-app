import {
  MaintainerAccountUnderReviewNotificationPayload,
  MaintainerCreateAccountNotificationPayload,
} from "@/hooks/polar/notifications";
import { MaintainerAccountReviewedNotificationPayload } from "@/hooks/polar/notifications";
import { MaintainerNewProductSaleNotificationPayload } from "@/hooks/polar/notifications";
import { MaintainerNewPaidSubscriptionNotificationPayload } from "@/hooks/polar/notifications";
import { useTheme } from "@/hooks/theme";
import { View, Text, StyleSheet } from "react-native";

export interface PaidSubscriptionNotificationProps {
  type: string;
  payload: MaintainerNewPaidSubscriptionNotificationPayload;
}

export const PaidSubscriptionNotification = ({
  type,
  payload,
}: PaidSubscriptionNotificationProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={{ fontSize: 12, color: colors.text }}>{type}</Text>
      <Text style={{ fontSize: 12, color: colors.text }}>
        {payload.subscriber_name} has subscribed to {payload.tier_name}
      </Text>
    </View>
  );
};

export interface ProductSaleNotificationProps {
  type: string;
  payload: MaintainerNewProductSaleNotificationPayload;
}

export const ProductSaleNotification = ({
  type,
  payload,
}: ProductSaleNotificationProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={{ fontSize: 12, color: colors.text }}>{type}</Text>
      <Text style={{ fontSize: 12, color: colors.text }}>
        {payload.customer_name} has purchased {payload.product_name}
      </Text>
    </View>
  );
};

export interface NotificationProps {
  type: string;
  payload:
    | MaintainerAccountUnderReviewNotificationPayload
    | MaintainerAccountReviewedNotificationPayload
    | MaintainerCreateAccountNotificationPayload
    | MaintainerNewPaidSubscriptionNotificationPayload
    | MaintainerNewProductSaleNotificationPayload;
}

export const Notification = ({ type, payload }: NotificationProps) => {
  switch (type) {
    case "MaintainerNewPaidSubscriptionNotification":
      return (
        <PaidSubscriptionNotification
          type={type}
          payload={payload as MaintainerNewPaidSubscriptionNotificationPayload}
        />
      );
    case "MaintainerNewProductSaleNotification":
      return (
        <ProductSaleNotification
          type={type}
          payload={payload as MaintainerNewProductSaleNotificationPayload}
        />
      );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});
