import { CustomerRow } from "@/components/Customers/CustomerRow";
import { useCustomers } from "@/hooks/polar/customers";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { Customer } from "@polar-sh/sdk/models/components/customer.js";
import { Stack } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import { FlatList, RefreshControl, TextInput, View } from "react-native";

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
      <View style={{ padding: 16, backgroundColor: colors.background }}>
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
          placeholderTextColor={colors.subtext}
        />
      </View>
      <FlatList
        data={customersData}
        renderItem={({ item }: { item: Customer }) => {
          return <CustomerRow customer={item} />;
        }}
        contentContainerStyle={{
          padding: 16,
          backgroundColor: colors.background,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        keyExtractor={(item) => item.id}
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
