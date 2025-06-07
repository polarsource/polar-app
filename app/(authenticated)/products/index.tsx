import { ProductRow } from "@/components/Products/ProductRow";
import { ThemedText } from "@/components/Shared/ThemedText";
import { useInfiniteProducts } from "@/hooks/polar/products";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { Product } from "@polar-sh/sdk/models/components/product";
import { Stack } from "expo-router";
import React, { useContext, useMemo } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function Index() {
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();
  const { data, refetch, isRefetching, fetchNextPage, hasNextPage } =
    useInfiniteProducts(organization.id);

  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [data]);

  return (
    <>
      <Stack.Screen options={{ title: "Products" }} />
      <FlatList
        data={flatData}
        renderItem={({ item }: { item: Product | string }) => {
          if (typeof item === "string") {
            return (
              <ThemedText
                style={{
                  paddingVertical: 12,
                  fontSize: 18,
                }}
              >
                {item}
              </ThemedText>
            );
          }

          return <ProductRow product={item} style={{ marginBottom: 8 }} />;
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
