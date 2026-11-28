import { useState, useEffect, useCallback } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import {
  TabScroll,
  AppText,
  Avatar,
  AppButton,
  Pill,
} from "../../components/ui";
import { AnnouncementCard } from "../../components/cards";
import { layout, card } from "../../styles/style";
import DefaultBanner from "../../../assets/banner-placeholder.png";

import supabase from "../../../library/supabase";

export default function HomeScreen({
  announceRef,
  organization,
  announcementRefreshKey,
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [announcementError, setAnnouncementError] = useState(null);
  const [memberCount, setMemberCount] = useState(0);

  const fetchMemberCount = async () => {
    if (!organization?.id) {
      setMemberCount(0);
      return;
    }

    const { count, error } = await supabase
      .from("organization_members")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organization.id)
      .is("left_at", null);

    if (error) {
      console.error("error fetching member count:", error);
      return;
    }

    setMemberCount(count ?? 0);
  };

  useEffect(() => {
    fetchMemberCount();
  }, [organization?.id]);

  // format announcement dates into readable relative time
  const formatAnnouncementTime = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const difference = Math.floor((now - createdAt) / 1000);

    if (difference < 60) return "just now";

    const minutes = Math.floor(difference / 60);
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;

    return createdAt.toLocaleDateString();
  };

  // fetch announcements belonging to the selected organization

  const fetchAnnouncements = useCallback(
    async (showLoading = false) => {
      if (!organization?.id) {
        setAnnouncements([]);
        return;
      }

      if (showLoading) {
        setLoadingAnnouncements(true);
      }

      const { data, error } = await supabase
        .from("announcements")
        .select("id, organization_id, title, body, audience, created_at")
        .eq("organization_id", organization.id)
        .is("removed_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("error fetching announcements:", error);

        if (showLoading) {
          setAnnouncementError("unable to load announcements.");
        }
      } else {
        setAnnouncementError(null);

        setAnnouncements((current) => {
          const next = data ?? [];

          // avoid unnecessary renders when announcement data has not changed
          if (
            current.length === next.length &&
            current.every(
              (item, index) =>
                item.id === next[index].id &&
                item.title === next[index].title &&
                item.body === next[index].body &&
                item.created_at === next[index].created_at,
            )
          ) {
            return current;
          }

          return next;
        });
      }

      if (showLoading) {
        setLoadingAnnouncements(false);
      }
    },
    [organization?.id],
  );

  // initial fetch and silent background polling
  useEffect(() => {
    fetchAnnouncements(true);

    const interval = setInterval(() => {
      fetchAnnouncements(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAnnouncements, announcementRefreshKey]);

  // listen for announcement changes in realtime
  useEffect(() => {
    if (!organization?.id) return;

    const channel = supabase
      .channel(`organization-announcements-${organization.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        () => {
          fetchAnnouncements();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization?.id, fetchAnnouncements]);

  return (
    <View style={{ flex: 1 }}>
      <TabScroll contentStyle={layout.screen} useNavPadding={false}>
        {/* banner kontiner */}
        <View style={layout.banner}>
          {/* ba is nner picshur */}
          <Image
            source={DefaultBanner}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* frufayl */}
          <View style={layout.profileSection}>
            <Avatar
              name={organization?.name || null}
              image={null}
              size="profile"
            />
          </View>
        </View>

        <View style={[layout.content, layout.stack]}>
          {/* name and filter tag continer */}
          <View style={layout.columnCenter}>
            <AppText variant="headline" align="center">
              {organization?.name || "Organization Name"}
            </AppText>

            <Pill
              label={organization?.category || "Category unavailable"}
              tone="muted"
            />
          </View>

          {/* member count + button */}
          <View style={card.footer}>
            <AppText variant="caption" tone="primary">
              {memberCount} Members
            </AppText>
          </View>

          {/* description */}
          <View style={layout.stackInside}>
            <AppText variant="label">About</AppText>
            <AppText variant="caption" style={card.description}>
              {organization?.description || "No description available."}
            </AppText>
          </View>

          <View style={layout.stackInside}>
            <AppText variant="label">Announcements</AppText>

            {/* forda announcements */}
            <AppButton
              variant="composer"
              title="Add announcement"
              onPress={() => announceRef.current?.open()}
            />

            {/* show loading state while announcements are being fetched */}
            {loadingAnnouncements && <ActivityIndicator />}

            {/* show an error if announcements cannot be loaded */}
            {!loadingAnnouncements && announcementError && (
              <AppText variant="caption">{announcementError}</AppText>
            )}

            {/* display announcements from the selected organization */}
            {!loadingAnnouncements &&
              !announcementError &&
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  title={announcement.title}
                  time={formatAnnouncementTime(announcement.created_at)}
                  message={announcement.body}
                />
              ))}

            {/* show a message when the organization has no announcements */}
            {!loadingAnnouncements &&
              !announcementError &&
              announcements.length === 0 && (
                <AppText variant="caption">no announcements yet.</AppText>
              )}
          </View>
        </View>
      </TabScroll>
    </View>
  );
}
