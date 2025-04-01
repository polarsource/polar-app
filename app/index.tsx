import { OrderRow } from "@/components/Orders/OrderRow";
import { useOrders } from "@/hooks/polar/orders";
import { OrganizationContext } from "@/utils/providers";
import { Link, Stack } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatCurrencyAndAmount } from "@/utils/money";
import { Tile } from "@/components/Home/Tile";
import { RevenueTile } from "@/components/Home/RevenueTile";
import { OrganizationTile } from "@/components/Home/OrganizationTile";
import { useTheme } from "@/hooks/theme";
import PolarLogo from "@/components/Common/PolarLogo";

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
                justifyContent: "center",
                backgroundColor: colors.background,
                height: 100,
              }}
            >
              <PolarLogo size={36} />
            </SafeAreaView>
          ),
          headerTitle: "Home",
        }}
      />
      <View style={{ padding: 16, gap: 24, flex: 1, flexDirection: "column" }}>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <OrganizationTile />
            <RevenueTile />
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Tile href="/orders">
              <Text style={{ color: "#999", fontSize: 14 }}>
                Available Funds
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                {formatCurrencyAndAmount(totalRevenue)}
              </Text>
            </Tile>

            <Tile href="/customers">
              <Text style={{ color: "#999", fontSize: 14 }}>Customers</Text>
            </Tile>
          </View>
        </View>

        <View style={{ gap: 16 }}>
          <Text style={{ fontSize: 18, color: colors.text }}>
            Recent Orders
          </Text>
          <View style={{ gap: 8 }}>
            {flatOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </View>
          <Link href="/orders" asChild>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>
                View all orders
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
