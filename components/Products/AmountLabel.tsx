import { useTheme } from "@/hooks/theme";
import { formatCurrencyAndAmount } from "@/utils/money";
import { SubscriptionRecurringInterval } from "@polar-sh/sdk/models/components/subscriptionrecurringinterval.js";
import { useMemo } from "react";
import { View, Text } from "react-native";

interface AmountLabelProps {
  amount: number;
  currency: string;
  interval?: SubscriptionRecurringInterval;
  minimumFractionDigits?: number;
}

const AmountLabel = ({
  amount,
  currency,
  interval,
  minimumFractionDigits = 0,
}: AmountLabelProps) => {
  const { colors } = useTheme();

  const intervalDisplay = useMemo(() => {
    if (!interval) {
      return "";
    }
    switch (interval) {
      case "month":
        return " / mo";
      case "year":
        return " / yr";
      default:
        return "";
    }
  }, [interval]);

  return (
    <View style={{ flexDirection: "row", alignItems: "baseline" }}>
      <Text style={{ fontSize: 14, color: colors.text }}>
        {formatCurrencyAndAmount(amount, currency, minimumFractionDigits)}
      </Text>
      <Text style={{ fontSize: 8, color: colors.text }}>{intervalDisplay}</Text>
    </View>
  );
};

export default AmountLabel;
