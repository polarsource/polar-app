import { useProduct, useProductUpdate } from "@/hooks/polar/products";
import { useTheme } from "@/hooks/theme";
import { StyleSheet, ScrollView, RefreshControl, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useMemo, useState } from "react";
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
import { EmptyState } from "@/components/Shared/EmptyState";
import { SDKError } from "@polar-sh/sdk/models/errors/sdkerror.js";
import { Banner } from "@/components/Shared/Banner";

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

  const now = useMemo(() => new Date(), []);

  const { data: metrics } = useMetrics(
    organization.id,
    organization.createdAt,
    now,
    {
      productId: id as string,
      interval: "month",
    }
  );

  const { data: latestProductOrders } = useOrders(organization.id, {
    productId: id as string,
    limit: 3,
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

  const { control, handleSubmit, formState, reset } = form;

  const updateProduct = useProductUpdate(organization.id, id as string);

  const { error: mutationError } = updateProduct;

  if (mutationError) {
    throw mutationError;
  }

  const saveProduct = useCallback(
    async (data: ProductUpdateForm) => {
      const result = await updateProduct.mutateAsync({
        ...data,
        metadata: Object.fromEntries(
          data.metadata.map(({ key, value }) => [key, value])
        ),
      });

      reset({
        ...result,
        medias: result.medias.map((media) => media.id),
        full_medias: result.medias,
        metadata: Object.entries(result.metadata).map(([key, value]) => ({
          key,
          value,
        })),
      });
    },
    [updateProduct]
  );

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
        {product.isArchived ? (
          <Banner
            title="This product is archived"
            description="Archived products cannot be edited, nor can they be unarchived."
          />
        ) : (
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
        )}
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

          <View style={{ flexDirection: "column", gap: 16 }}>
            <ThemedText style={{ fontSize: 20 }}>Latest orders</ThemedText>
            <View style={{ flexDirection: "column", gap: 8 }}>
              {(flatLatestProductOrders?.length ?? 0) > 0 ? (
                flatLatestProductOrders?.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))
              ) : (
                <EmptyState
                  title="No orders found"
                  description="No orders found for this product"
                />
              )}
            </View>
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
              secondaryLabel="Markdown"
            />
          </View>
          <Button
            onPress={handleSubmit(saveProduct)}
            loading={updateProduct.isPending}
            disabled={!formState.isDirty}
          >
            Save
          </Button>
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
