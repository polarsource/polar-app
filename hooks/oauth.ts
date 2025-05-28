import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import { useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { useSession } from "@/providers/SessionProvider";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export const useOAuthConfig = () => {
  const production = {
    CLIENT_ID: "polar_ci_yZLBGwoWZVsOdfN5CODRwVSTlJfwJhXqwg65e2CuNMZ",
    discovery: {
      authorizationEndpoint: "https://polar.sh/oauth2/authorize",
      tokenEndpoint: "https://api.polar.sh/v1/oauth2/token",
      registrationEndpoint: "https://api.polar.sh/v1/oauth2/register",
      revocationEndpoint: "https://api.polar.sh/v1/oauth2/revoke",
    },
  };

  const development = {
    CLIENT_ID: "polar_ci_RW5LDNLrEjeOzCovwUf7pp9dwe3PKUCut3CwO135uvX",
    discovery: {
      authorizationEndpoint: `http://127.0.0.1:3000/oauth2/authorize`,
      tokenEndpoint: `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/oauth2/token`,
      registrationEndpoint: `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/oauth2/register`,
      revocationEndpoint: `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/oauth2/revoke`,
    },
  };

  const scopes = [
    "openid",
    "profile",
    "email",
    "user:read",
    "organizations:read",
    "organizations:write",
    "orders:read",
    "products:read",
    "benefits:read",
    "discounts:read",
    "customers:read",
    "metrics:read",
    "events:read",
    "notification_recipients:read",
    "notification_recipients:write",
  ];

  return {
    scopes,
    ...production,
  };
};

export const useOAuth = () => {
  const { navigate } = useRouter();
  const { setSession } = useSession();

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const { CLIENT_ID, scopes, discovery } = useOAuthConfig();
  const [authRequest, , promptAsync] = useAuthRequest(
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

  const authenticate = useCallback(async () => {
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
            code_verifier: authRequest?.codeVerifier ?? "",
          },
        },
        discovery
      );
      setSession(token.accessToken);
      navigate("/(authenticated)/home");
    }
  }, [CLIENT_ID, discovery, navigate, setSession]);

  return { authenticate, authRequest };
};
