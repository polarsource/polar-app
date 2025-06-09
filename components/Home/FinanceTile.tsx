import { View, StyleSheet } from "react-native";
import { Tile } from "./Tile";
import { useContext } from "react";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { ThemedText } from "../Shared/ThemedText";
import { MiniButton } from "../Shared/MiniButton";
import {
  useOrganizationAccount,
  useTransactionsSummary,
} from "@/hooks/polar/finance";
import { formatCurrencyAndAmount } from "@/utils/money";

export const FinanceTile = () => {
  const { organization } = useContext(OrganizationContext);
  const { data: account } = useOrganizationAccount(organization.id);
  const { data: summary } = useTransactionsSummary(account?.id);

  return (
    <Tile href="/finance">
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "column", gap: 4 }}>
          <ThemedText style={[styles.subtitle]} secondary>
            Finance
          </ThemedText>
          <ThemedText style={[styles.title]}>
            {formatCurrencyAndAmount(summary?.balance.amount ?? 0, "USD")}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "column", gap: 4 }}>
          <MiniButton style={{ alignSelf: "flex-start" }}>Withdraw</MiniButton>
        </View>
      </View>
    </Tile>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
  },
  revenueValue: {
    fontSize: 26,
  },
});
