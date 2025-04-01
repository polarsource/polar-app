import { CustomerRow } from "@/components/Customers/CustomerRow";
import { useCustomers } from "@/hooks/polar/customers";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/utils/providers";
import { Customer } from "@polar-sh/sdk/dist/commonjs/models/components/customer";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import { RefreshControl, TextInput, View } from "react-native";
import { SearchBar } from "react-native-screens";

export default function Index() {
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();
  const [search, setSearch] = useState("");

  const { data, refetch, isRefetching, fetchNextPage, hasNextPage } =
    useCustomers(organization.id, { query: search });

  const customersData = useMemo(() => {
    return data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [data]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Customers",
        }}
      />
      <View style={{ padding: 8, backgroundColor: colors.background }}>
        <TextInput
          placeholder="Search Customers"
          onChangeText={setSearch}
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: colors.text,
          }}
        />
      </View>
      <FlashList
        data={customersData}
        renderItem={({ item }: { item: Customer }) => {
          return <CustomerRow customer={item} />;
        }}
        contentContainerStyle={{
          padding: 8,
          backgroundColor: colors.background,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        estimatedItemSize={50}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      />
    </>
  );
}
