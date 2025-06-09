import { router, Stack } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useContext } from "react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/hooks/theme";
import { useOrganizations } from "@/hooks/polar/organizations";
import { Avatar } from "@/components/Shared/Avatar";
import { Button } from "@/components/Shared/Button";
import { useLogout } from "@/hooks/auth";
import { ThemedText } from "@/components/Shared/ThemedText";

export default function Index() {
  const { setOrganization, organization: selectedOrganization } =
    useContext(OrganizationContext);

  const { colors } = useTheme();
  const { data: organizationData, refetch, isRefetching } = useOrganizations();

  const logout = useLogout();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <Stack.Screen options={{ title: "Settings" }} />
      <View style={SettingsStyle.container}>
        <View style={{ flex: 1, gap: 16 }}>
          <ThemedText style={[SettingsStyle.title]}>Organizations</ThemedText>
          <View style={SettingsStyle.organizationsContainer}>
            {organizationData?.result.items.map((organization) => (
              <TouchableOpacity
                key={organization.id}
                style={[
                  SettingsStyle.organization,
                  {
                    backgroundColor: colors.card,
                  },
                ]}
                onPress={() => {
                  setOrganization(organization);
                  router.back();
                }}
                activeOpacity={0.6}
              >
                <View style={SettingsStyle.organizationContent}>
                  <Avatar
                    size={32}
                    image={organization.avatarUrl}
                    name={organization.name}
                  />
                  <ThemedText style={[SettingsStyle.organizationName]}>
                    {organization.name}
                  </ThemedText>
                </View>
                <MaterialIcons
                  name="check"
                  size={20}
                  color={
                    selectedOrganization?.id === organization.id
                      ? colors.secondary
                      : "transparent"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button onPress={logout}>Logout</Button>
      </View>
    </ScrollView>
  );
}

const SettingsStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  organizationsContainer: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  title: {
    fontSize: 20,
    flex: 1,
  },
  organization: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
  },
  organizationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  organizationName: {
    fontSize: 16,
  },
  logoutButtonText: {
    fontSize: 16,
  },
});
