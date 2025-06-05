import { OrderRow } from "@/components/Orders/OrderRow";
import { useOrders } from "@/hooks/polar/orders";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { Order } from "@polar-sh/sdk/dist/commonjs/models/components/order";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import React, { useContext, useMemo } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const groupOrdersByDate = (orders: Order[]) => {
  if (!orders?.length) return [];

  const result: (Order | string)[] = [];
  let currentDate: string | null = null;

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const wasLastYear = orderDate.getFullYear() < new Date().getFullYear();
    const dateString = orderDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: wasLastYear ? "numeric" : undefined,
    });

    if (dateString !== currentDate) {
      currentDate = dateString;
      result.push(dateString);
    }

    result.push(order);
  });

  return result;
};

export default function Index() {
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();
  const { data, refetch, isRefetching, fetchNextPage, hasNextPage } = useOrders(
    organization.id
  );

  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [data]);

  return (
    <>
      <Stack.Screen options={{ title: "Orders" }} />
      <FlatList
        data={groupOrdersByDate(flatData)}
        renderItem={({ item }: { item: Order | string }) => {
          if (typeof item === "string") {
            return (
              <Text
                style={{
                  color: colors.text,
                  paddingVertical: 12,
                  fontSize: 18,
                }}
              >
                {item}
              </Text>
            );
          }

          return <OrderRow order={item} style={{ marginBottom: 8 }} />;
        }}
        contentContainerStyle={{
          padding: 16,
          backgroundColor: colors.background,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.8}
      />
    </>
  );
}
