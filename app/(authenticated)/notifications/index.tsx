import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { useListNotifications } from "@/hooks/polar/notifications";
import { Notification } from "@/components/Notifications/Notification";
export default function Notifications() {
  const { data: notifications } = useListNotifications();

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, gap: 16, flex: 1 }}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: "Notifications" }} />

      {notifications?.notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          payload={notification.payload}
        />
      ))}
    </ScrollView>
  );
}
