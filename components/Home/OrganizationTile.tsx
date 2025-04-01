import { View, Text } from "react-native";
import { Avatar } from "../Common/Avatar";
import { Tile } from "./Tile";
import { OrganizationContext } from "@/utils/providers";
import { useContext } from "react";

export const OrganizationTile = () => {
  const { organization } = useContext(OrganizationContext);

  return (
    <Tile href="/orders">
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Avatar name={organization.name} />
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
