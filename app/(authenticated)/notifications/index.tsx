import { useTheme } from "@/hooks/theme";
import { ScrollView, RefreshControl, Text, View } from "react-native";
import { Stack } from "expo-router";
import {
  Notification as PolarNotification,
  useListNotifications,
  useNotificationsMarkRead,
} from "@/hooks/polar/notifications";
import { Notification } from "@/components/Notifications/Notification";
import { useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import React from "react";

const groupNotificationsByDate = (notifications: PolarNotification[]) => {
  if (!notifications?.length) return [];

  const result: (PolarNotification | string)[] = [];
  let currentDate: string | null = null;

  notifications.forEach((notification) => {
    const notificationDate = new Date(notification.created_at);
    const wasLastYear =
      notificationDate.getFullYear() < new Date().getFullYear();
    const dateString = notificationDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: wasLastYear ? "numeric" : undefined,
    });

    if (dateString !== currentDate) {
      currentDate = dateString;
      result.push(dateString);
    }

    result.push(notification);
  });

  return result;
};

export default function Notifications() {
  const { colors } = useTheme();
  const {
    data: notifications,
    refetch: refetchNotifications,
    isRefetching,
  } = useListNotifications();
  const markNotificationAsRead = useNotificationsMarkRead();

  useEffect(() => {
    if (notifications?.notifications.length) {
      markNotificationAsRead.mutateAsync({
        notificationId: notifications.notifications[0].id,
      });
    }
  }, [notifications]);

  return (
    <React.Fragment>
      <Stack.Screen options={{ title: "Notifications" }} />
      <FlashList
        data={groupNotificationsByDate(notifications?.notifications ?? [])}
        renderItem={({ item }: { item: PolarNotification | string }) => {
          if (typeof item === "string") {
            return (
              <Text
                style={{
                  color: colors.text,
                  paddingTop: 12,
                  paddingBottom: 24,
                  fontSize: 16,
                }}
              >
                {item}
              </Text>
            );
          }

          return (
            <Notification
              key={item.id}
              type={item.type}
              payload={item.payload}
              createdAt={item.created_at}
              style={{ marginBottom: 16 }}
            />
          );
        }}
        contentContainerStyle={{
          padding: 16,
          backgroundColor: colors.background,
        }}
        style={{ flex: 1 }}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        estimatedItemSize={50}
        keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
        refreshControl={
          <RefreshControl
            onRefresh={refetchNotifications}
            refreshing={isRefetching}
          />
        }
      />
    </React.Fragment>
  );
}
