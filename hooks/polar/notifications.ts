import { useSession } from "@/providers/SessionProvider";
import { useMutation } from "@tanstack/react-query";
import { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

export const useNotificationSubscription = () => {
  const { session } = useSession();

  return useMutation({
    mutationFn: async (expoPushToken: string) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/notifications/subscribe`,
        {
          method: "POST",
          body: JSON.stringify({
            expo_push_token: expoPushToken,
            platform: Platform.OS,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register notification");
      }

      return response.json();
    },
  });
};
