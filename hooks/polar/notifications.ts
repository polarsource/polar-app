import { usePolarClient } from "@/providers/PolarClientProvider";
import { useSession } from "@/providers/SessionProvider";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { Platform } from "react-native";

export interface NotificationRecipient {
  id: string;
  expo_push_token: string;
  platform: "ios" | "android";
  created_at: string;
  updated_at: string;
}

export const useCreateNotificationRecipient = (): UseMutationResult<
  NotificationRecipient,
  Error,
  string
> => {
  const { session } = useSession();

  return useMutation({
    mutationFn: async (expoPushToken: string) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/notifications/recipients`,
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

export const useListNotificationRecipients = (): UseQueryResult<
  NotificationRecipient[],
  Error
> => {
  const { session } = useSession();

  return useQuery({
    queryKey: ["notification_recipients"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/notifications/recipients`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        }
      );

      return response.json();
    },
  });
};

export const useGetNotificationRecipient = (
  expoPushToken: string
): UseQueryResult<NotificationRecipient, Error> => {
  const { session } = useSession();

  return useQuery({
    queryKey: ["notification_recipient", expoPushToken],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/notifications/recipients?expo_push_token=${expoPushToken}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        }
      );

      return response.json().then((data) => data.items[0]);
    },
  });
};

export const useDeleteNotificationRecipient = (): UseMutationResult<
  NotificationRecipient,
  Error,
  string
> => {
  const { session } = useSession();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_POLAR_SERVER_URL}/v1/notifications/recipients/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification recipient");
      }

      return response.json();
    },
  });
};
