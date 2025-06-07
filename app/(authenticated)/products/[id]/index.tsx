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
      contentContainerStyle={{ flexDirection: "column", gap: 16 }}
      refreshControl={
        <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
      }
      contentInset={{ bottom: 48 }}
    >
      <Stack.Screen
        options={{
          title: "Product",
        }}
      />
      <View style={{ flexDirection: "column", gap: 16 }}>
        <FormInput control={control} name="name" label="Name" />
        <FormInput
          multiline
          control={control}
          name="description"
          style={{ height: 120 }}
          label="Description"
        />
        <FormInput control={control} name="prices" label="Prices" />
      </View>
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
