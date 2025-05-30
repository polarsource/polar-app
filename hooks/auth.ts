import { useNotifications } from "@/providers/NotificationsProvider";
import { useGetNotificationRecipient } from "./polar/notifications";
import { useSession } from "@/providers/SessionProvider";
import { useDeleteNotificationRecipient } from "./polar/notifications";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export const useLogout = () => {
  const { setSession } = useSession();
  const { expoPushToken } = useNotifications();

  const deleteNotificationRecipient = useDeleteNotificationRecipient();
  const { data: notificationRecipient } =
    useGetNotificationRecipient(expoPushToken);

  const signOut = useCallback(async () => {
    if (notificationRecipient) {
      deleteNotificationRecipient.mutateAsync(notificationRecipient.id);
    }

    Notifications.unregisterForNotificationsAsync();

    setSession(null);
    AsyncStorage.removeItem("organizationId");
  }, [setSession, deleteNotificationRecipient, expoPushToken]);

  return signOut;
};
