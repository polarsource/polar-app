import { useTheme } from "@/hooks/theme";
import { isLegacyRecurringPrice } from "@/utils/price";
import { CheckoutProduct } from "@polar-sh/sdk/models/components/checkoutproduct.js";
import { Product } from "@polar-sh/sdk/models/components/product.js";
import AmountLabel from "./AmountLabel";
import { Text } from "react-native";

interface ProductPriceLabelProps {
  product: Product | CheckoutProduct;
}

export const ProductPriceLabel = ({ product }: ProductPriceLabelProps) => {
  const { colors } = useTheme();

  const staticPrice = product.prices.find(({ amountType }) =>
    ["fixed", "custom", "free"].includes(amountType)
  );

  if (!staticPrice) {
    return null;
  }

  if (staticPrice.amountType === "fixed") {
    return (
      <AmountLabel
        amount={staticPrice.priceAmount}
        currency={staticPrice.priceCurrency}
        interval={
          isLegacyRecurringPrice(staticPrice)
            ? staticPrice.recurringInterval
            : product.recurringInterval || undefined
        }
      />
    );
  } else if (staticPrice.amountType === "custom") {
    return <Text style={{ color: colors.text }}>Pay what you want</Text>;
  } else {
    return <Text style={{ color: colors.text }}>Free</Text>;
  }
};
