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
  ];

  return {
    scopes,
    ...(process.env.NODE_ENV === "development" ? development : production),
  };
};
