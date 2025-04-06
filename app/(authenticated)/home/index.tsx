import { OrderRow } from "@/components/Orders/OrderRow";
import { useOrders } from "@/hooks/polar/orders";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, Stack, usePathname } from "expo-router";
import { useCallback, useContext, useEffect, useMemo } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RevenueTile } from "@/components/Home/RevenueTile";
import { OrganizationTile } from "@/components/Home/OrganizationTile";
import { useTheme } from "@/hooks/theme";
import PolarLogo from "@/components/Common/PolarLogo";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { useCreateNotificationRecipient } from "@/hooks/polar/notifications";
import { useNotifications } from "@/providers/NotificationsProvider";

export default function Index() {
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();

  const {
    data,
    refetch: refetchOrders,
    isRefetching: isRefetchingOrders,
  } = useOrders(organization.id, {
    limit: 3,
  });

  const flatOrders = useMemo(() => {
    return data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [data]);

  const totalRevenue = useMemo(() => {
    return flatOrders.reduce((acc, order) => acc + order.netAmount, 0);
  }, [flatOrders]);

  const isRefetching = useMemo(() => {
    return isRefetchingOrders;
  }, [isRefetchingOrders]);

  const refresh = useCallback(() => {
    refetchOrders();
  }, [refetchOrders]);

  const { expoPushToken } = useNotifications();
  const { mutate: createNotificationRecipient } =
    useCreateNotificationRecipient();

  useEffect(() => {
    if (expoPushToken) {
      createNotificationRecipient(expoPushToken);
    }
  }, [expoPushToken, createNotificationRecipient]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl onRefresh={refresh} refreshing={isRefetching} />
      }
    >
      <Stack.Screen
        options={{
          header: () => (
            <SafeAreaView
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: colors.background,
                height: 100,
                marginHorizontal: 32,
              }}
            >
              <PolarLogo size={36} />
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Link href="/settings" asChild>
                  <TouchableOpacity activeOpacity={0.6}>
                    <MaterialIcons name="bolt" size={24} color={colors.text} />
                  </TouchableOpacity>
                </Link>
                <Link href="/settings" asChild>
                  <TouchableOpacity activeOpacity={0.6}>
                    <MaterialIcons name="tune" size={24} color={colors.text} />
                  </TouchableOpacity>
                </Link>
              </View>
            </SafeAreaView>
          ),
          headerTitle: "Home",
        }}
      />
      <View style={{ padding: 16, gap: 32, flex: 1, flexDirection: "column" }}>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <OrganizationTile />
            <RevenueTile />
          </View>
        </View>

        <View style={{ gap: 16, flexDirection: "column", flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, color: colors.text }}>
              Recent Orders
            </Text>
            <Link href="/orders" asChild>
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  width: "auto",
                  backgroundColor: colors.primary,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={{ gap: 8 }}>
            {flatOrders.map((order) => (
              <OrderRow key={order.id} order={order} showTimestamp />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
