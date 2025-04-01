import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.EXPO_PUBLIC_POLAR_ACCESS_TOKEN,
});
