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
    <Tile href="/settings">
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Avatar
          name={organization.name}
          image={organization.avatarUrl}
          backgroundColor={colors.primary}
        />
        <View style={{ flexDirection: "column", gap: 4 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "600",
              marginTop: 4,
            }}
          >
            {organization.name}
          </Text>
          <Text
            style={{ color: colors.subtext, fontSize: 16 }}
            numberOfLines={1}
          >
            {organization.slug}
          </Text>
        </View>
      </View>
    </Tile>
  );
};
