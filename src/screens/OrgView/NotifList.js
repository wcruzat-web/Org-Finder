
import { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { NotificationCard } from "../../components/cards";
import { layout } from "../../styles/style";
import { AppText, TabScroll } from "../../components/ui";
import { spacing } from "../../styles/theme-dark";
import supabase from "../../../library/supabase";

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

  // fetch notifications for the logged-in organization
  const fetchNotifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          type,
          application_id,
          announcement_title,
          removal_reason,
          sent_at,
          read_at,
          application:applications!notifications_application_id_fkey (
            id,
            student:accounts!applications_student_id_fkey (
              full_name
            )
          )
        `)
        .in("type", ["application_update", "announcement_removed"])
        .order("sent_at", { ascending: false });

      if (error) throw error;

      setNotifications(data ?? []);
    } catch (error) {
      console.error("error fetching organization notifications:", error);
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
            if (item.type === "announcement_removed") {
              return (
                <NotificationCard
                  key={item.id}
                  name="Announcement Removed"
                  message={`Your announcement "${item.announcement_title}" was removed by an administrator. Reason: ${item.removal_reason}`}
                  time={formatTime(item.sent_at)}
                  read={!!item.read_at}
                />
              );
            }

            const applicantName =
              item.application?.student?.full_name ?? "A student";

            return (
              <NotificationCard
                key={item.id}
                name="Membership Application"
                message={`${applicantName} sent an application form to your organization.`}
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
