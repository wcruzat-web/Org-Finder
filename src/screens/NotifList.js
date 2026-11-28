import { useCallback, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NotificationCard } from "../components/cards";
import { layout } from "../styles/style";
import { AppText, TabScroll } from "../components/ui";
import { spacing } from "../styles/theme-dark";
import supabase from "../../library/supabase";

// format notification timestamp
function formatTime(date) {
  if (!date) return "";

  const elapsed = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(elapsed / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  return new Date(date).toLocaleDateString();
}

export default function NotifList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // fetch notifications for the logged-in student
  const fetchNotifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          type,
          application_id,
          announcement_id,
          sent_at,
          read_at,
          application:applications!notifications_application_id_fkey (
            status,
            organization:organizations!applications_organization_id_fkey (
              name
            )
          ),
          announcement:announcements!notifications_announcement_id_fkey (
            title,
            body,
            organization:organizations!announcements_organization_id_fkey (
              name
            )
          )
        `)
        .order("sent_at", { ascending: false });

      if (error) throw error;

      setNotifications(data ?? []);
    } catch (error) {
      console.error("error fetching student notifications:", error);
      Alert.alert("Error", "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // mark all unread notifications as read
  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((item) => !item.read_at)
      .map((item) => item.id);

    if (unreadIds.length === 0) return;

    setUpdating(true);

    try {
      const readAt = new Date().toISOString();

      const { error } = await supabase
        .from("notifications")
        .update({ read_at: readAt })
        .in("id", unreadIds);

      if (error) throw error;

      setNotifications((current) =>
        current.map((item) =>
          unreadIds.includes(item.id)
            ? { ...item, read_at: readAt }
            : item
        )
      );
    } catch (error) {
      console.error("error marking notifications as read:", error);
      Alert.alert("Error", "Unable to mark notifications as read.");
    } finally {
      setUpdating(false);
    }
  };

  // prepare notification content
  const getNotificationContent = (item) => {
    if (item.type === "application_update") {
      const status = item.application?.status;
      const organizationName =
        item.application?.organization?.name ?? "An organization";

      if (status === "accepted") {
        return {
          name: organizationName,
          message: `Your application to ${organizationName} has been accepted.`,
        };
      }

      if (status === "rejected") {
        return {
          name: organizationName,
          message: `Your application to ${organizationName} has been rejected.`,
        };
      }

      return {
        name: organizationName,
        message: `Your application to ${organizationName} has been updated.`,
      };
    }

    if (item.type === "announcement") {
      const announcement = item.announcement;
      const organizationName =
        announcement?.organization?.name ?? "Organization";

      return {
        name: organizationName,
        message: announcement?.title ?? "Posted a new announcement.",
      };
    }

    return {
      name: "Notification",
      message: "You have a new notification.",
    };
  };

  return (
    <TabScroll useNavPadding={false}>
      <View style={[layout.content, { paddingTop: spacing["2xl"] }]}>
        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          disabled={updating}
        >
          <AppText variant="link" align="right">
            {updating ? "Updating..." : "Mark all as read"}
          </AppText>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator />
        ) : notifications.length > 0 ? (
          notifications.map((item) => {
            const content = getNotificationContent(item);

            return (
              <NotificationCard
                key={item.id}
                name={content.name}
                message={content.message}
                time={formatTime(item.sent_at)}
                read={!!item.read_at}
              />
            );
          })
        ) : (
          <AppText variant="caption" tone="disabled">
            No notifications yet.
          </AppText>
        )}
      </View>
    </TabScroll>
  );
}