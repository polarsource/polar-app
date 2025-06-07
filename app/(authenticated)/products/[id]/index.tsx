import { useProduct } from "@/hooks/polar/products";
import { useTheme } from "@/hooks/theme";
import { StyleSheet, ScrollView, RefreshControl, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { FormInput } from "@/components/Form/FormInput";
import { useForm } from "react-hook-form";
import { ProductUpdate } from "@polar-sh/sdk/models/components/productupdate.js";
import { ProductMediaFileRead } from "@polar-sh/sdk/models/components/productmediafileread.js";
import { Button } from "@/components/Shared/Button";
import {
  TabsContent,
  TabsList,
  Tabs,
  TabsTrigger,
} from "@/components/Shared/Tabs";
import { ThemedText } from "@/components/Shared/ThemedText";
import { useMetrics } from "@/hooks/polar/metrics";
import { Box } from "@/components/Metrics/Box";
import { formatCurrencyAndAmount } from "@/utils/money";
import { useOrders } from "@/hooks/polar/orders";
import { OrderRow } from "@/components/Orders/OrderRow";

export interface ProductFullMediasMixin {
  full_medias: ProductMediaFileRead[];
}

type ProductUpdateForm = Omit<ProductUpdate, "metadata"> &
  ProductFullMediasMixin & {
    metadata: { key: string; value: string | number | boolean }[];
  };

export default function Index() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { organization } = useContext(OrganizationContext);

  const {
    data: product,
    refetch,
    isRefetching,
  } = useProduct(organization.id, id as string);

  const { data: metrics } = useMetrics(
    organization.id,
    organization.createdAt,
    new Date(),
    {
      productId: id as string,
      interval: "month",
    }
  );

  const { data: latestProductOrders } = useOrders(organization.id, {
    productId: id as string,
    limit: 10,
  });

  const flatLatestProductOrders = latestProductOrders?.pages.flatMap(
    (page) => page.result.items
  );

  const form = useForm<ProductUpdateForm>({
    defaultValues: {
      ...product,
      medias: product?.medias.map((media) => media.id),
      full_medias: product?.medias,
      metadata: Object.entries(product?.metadata ?? {}).map(([key, value]) => ({
        key,
        value,
      })),
    },
  });

  const { control } = form;

  if (!product) {
    return (
      <Stack.Screen
        options={{
          title: "Product",
        }}
      />
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ flexDirection: "column", gap: 32 }}
      refreshControl={
        <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
      }
      contentInset={{ bottom: 48 }}
    >
      <Stack.Screen
        options={{
          title: product.name,
        }}
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        <TabsContent
          value="overview"
          style={{ flexDirection: "column", gap: 32 }}
        >
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Box
              label="Orders"
              value={(
                metrics?.periods.reduce(
                  (acc, period) => acc + (period.orders ?? 0),
                  0
                ) ?? 0
              ).toString()}
            />
            <Box
              label="Revenue"
              value={formatCurrencyAndAmount(
                metrics?.periods[metrics?.periods.length - 1]
                  .cumulativeRevenue ?? 0
              )}
            />
          </View>
          <View style={{ flexDirection: "column", gap: 8 }}>
            {flatLatestProductOrders?.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </View>
        </TabsContent>
        <TabsContent value="edit" style={{ flexDirection: "column", gap: 32 }}>
          <View style={{ flexDirection: "column", gap: 16 }}>
            <FormInput control={control} name="name" label="Name" />
            <FormInput
              multiline
              control={control}
              name="description"
              style={{ height: 120 }}
              label="Description"
            />
          </View>
          <Button>Save</Button>
        </TabsContent>
      </Tabs>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    flexDirection: "column",
  },
});
