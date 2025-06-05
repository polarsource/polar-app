import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { SDKError } from "@polar-sh/sdk/models/errors/sdkerror.js";
import PolarLogo from "@/components/Common/PolarLogo";
import { useLogout } from "@/hooks/auth";
import { useTheme } from "@/hooks/theme";
import { useOAuth } from "@/hooks/oauth";
import { useRouter } from "expo-router";

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) => {
  const { colors } = useTheme();
  const logout = useLogout();
  const { authenticate } = useOAuth();
  const permissionError = error instanceof SDKError && error.statusCode === 403;

  const title = useMemo(() => {
    switch (true) {
      case permissionError:
        return "Insufficient Permissions";
      default:
        return "Something Went Wrong";
    }
  }, [permissionError]);

  const message = useMemo(() => {
    switch (true) {
      case permissionError:
        return "You have insufficient permissions to access the resource. Authenticate to gain the necessary permissions.";
      default:
        return "Logout & re-authenticate to try again";
    }
  }, [permissionError]);

  const [actionText, action] = useMemo(() => {
    switch (true) {
      case permissionError:
        return ["Authenticate", authenticate];
      default:
        return ["Logout", logout];
    }
  }, [permissionError, logout, authenticate]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        gap: 32,
        paddingHorizontal: 24,
      }}
    >
      <PolarLogo size={80} />
      <View style={{ gap: 12 }}>
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            color: colors.text,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: colors.subtext,
          }}
        >
          {message}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        style={[
          {
            backgroundColor: "#fff",
            borderRadius: 100,
            width: "auto",
            paddingVertical: 12,
            paddingHorizontal: 24,
          },
        ]}
        onPress={async () => {
          await action();
          resetErrorBoundary();
        }}
      >
        <Text style={{ color: "#000", fontSize: 16, fontWeight: "500" }}>
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
