import { Stack } from "expo-router";
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

export default function Index() {
  const { setOrganization, organization: selectedOrganization } =
    useContext(OrganizationContext);
  const { colors } = useTheme();
  const { signOut } = useSession();

  const { data: organizationData, refetch, isRefetching } = useOrganizations();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <Stack.Screen options={{ title: "Settings" }} />
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
            onPress={() => setOrganization(organization)}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name="check"
              size={20}
              color={
                selectedOrganization?.id === organization.id
                  ? colors.secondary
                  : "transparent"
              }
            />
            <Text
              style={[SettingsStyle.organizationName, { color: colors.text }]}
            >
              {organization.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={SettingsStyle.logoutButton} onPress={signOut}>
        <Text style={[SettingsStyle.logoutButtonText, { color: colors.text }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const SettingsStyle = StyleSheet.create({
  organizationsContainer: {
    flexDirection: "column",
    padding: 16,
    gap: 4,
    flex: 1,
  },
  title: {
    fontSize: 20,
    flex: 1,
  },
  organization: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  organizationName: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 16,
  },
});
