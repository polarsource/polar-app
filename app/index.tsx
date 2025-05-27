import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/hooks/theme";
import LogoIcon from "@/components/Common/PolarLogo";
import { useOAuthConfig } from "@/hooks/oauth";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { navigate } = useRouter();
  const { session, setSession } = useSession();
  const { colors } = useTheme();
  const { CLIENT_ID, scopes, discovery } = useOAuthConfig();
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes,
      redirectUri: makeRedirectUri({
        native: "polar://oauth/callback",
      }),
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  if (!request) {
    return <View style={LoginStyle.container} />;
  }

  if (session) {
    return <Redirect href="/(authenticated)/home" />;
  }

  return (
    <SafeAreaView
      style={[LoginStyle.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" />
      <LogoIcon size={60} />
      <Text style={[LoginStyle.title, { color: colors.text }]}>
        The monetization platform for your Digital Products
      </Text>
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!request}
        style={[
          LoginStyle.button,
          { backgroundColor: "#fff", borderRadius: 100 },
        ]}
        onPress={async () => {
          const res = await promptAsync();
          if (res.type === "success") {
            const token = await exchangeCodeAsync(
              {
                clientId: CLIENT_ID,
                code: res.params.code,
                redirectUri: makeRedirectUri({
                  native: "polar://oauth/callback",
                }),
                extraParams: {
                  code_verifier: request?.codeVerifier ?? "",
                },
              },
              discovery
            );
            setSession(token.accessToken);
            navigate("/(authenticated)/home");
          }
        }}
      >
        <Text style={[LoginStyle.buttonText, { color: "#000" }]}>
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 54,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 42,
    marginHorizontal: 24,
  },
  button: {
    width: "auto",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
});
