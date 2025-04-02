import { View, Text } from "react-native";
import { Avatar } from "../Common/Avatar";
import { Tile } from "./Tile";
import { useContext } from "react";
import { useTheme } from "@/hooks/theme";
import { OrganizationContext } from "@/providers/OrganizationProvider";

export const OrganizationTile = () => {
  const { organization } = useContext(OrganizationContext);
  const { colors } = useTheme();
  return (
    <Tile href="/orders">
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Avatar name={organization.name} backgroundColor={colors.primary} />
        <View style={{ flexDirection: "column", gap: 4 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "600",
              marginTop: 4,
            }}
          >
            {organization.name}
          </Text>
          <Text style={{ color: "#999", fontSize: 14 }}>
            {organization.slug}
          </Text>
        </View>
      </View>
    </Tile>
  );
};
