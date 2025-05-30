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
import { useSession } from "@/providers/SessionProvider";
import { Avatar } from "@/components/Common/Avatar";
import { Button } from "@/components/Common/Button";
import { useLogout } from "@/hooks/auth";

export default function Index() {
  const { setOrganization, organization: selectedOrganization } =
    useContext(OrganizationContext);

  const { colors } = useTheme();
  const { setSession } = useSession();
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
        <Text style={[SettingsStyle.title, { color: colors.text }]}>
          Organizations
        </Text>
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
                <Avatar size={32} image={organization.avatarUrl} />
                <Text
                  style={[
                    SettingsStyle.organizationName,
                    { color: colors.text },
                  ]}
                >
                  {organization.name}
                </Text>
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
        <Button onPress={logout}>Logout</Button>
      </View>
    </ScrollView>
  );
}

const SettingsStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
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
    borderRadius: 8,
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
