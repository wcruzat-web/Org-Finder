import { useRef, useState, useEffect } from "react";
import { View, Image, Keyboard, TouchableOpacity } from "react-native";
import { TabScroll, AppText, Avatar, AppButton, Pill } from "../components/ui";
import { layout, card } from "../styles/style";

import DefaultBanner from "../../assets/banner-placeholder.png";
import { AnnouncementCard, ApplicationSheet } from "../components/cards";
import supabase from "../../library/supabase.js";
import { useNavigation } from "@react-navigation/native";

export default function OrgDetails({ route }) {
  const navigation = useNavigation();
  const { org } = route.params;

  const sheetRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  const getImageSource = (image) =>
    typeof image === "string" ? { uri: image } : image;

  const checkMembership = async () => {
    try {
      setMembershipLoading(true);
      setIsMember(false);
      setAnnouncements([]);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No user found.");

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (accountError) throw accountError;

      const today = new Date().toISOString().slice(0, 10);

      const { data: semester, error: semesterError } = await supabase
        .from("semesters")
        .select("id")
        .lte("starts_on", today)
        .gte("ends_on", today)
        .order("starts_on", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (semesterError) throw semesterError;
      if (!semester) return;

      const { data: membership, error: membershipError } = await supabase
        .from("organization_members")
        .select("id")
        .eq("organization_id", org.id)
        .eq("student_id", account.id)
        .eq("semester_id", semester.id)
        .is("left_at", null)
        .limit(1)
        .maybeSingle();

      if (membershipError) throw membershipError;
      if (!membership) return;

      setIsMember(true);

      const { data: announcementData, error: announcementError } =
        await supabase
          .from("announcements")
          .select("id, title, body, created_at")
          .eq("organization_id", org.id)
          .is("removed_at", null)
          .order("created_at", { ascending: false });

      if (announcementError) throw announcementError;

      setAnnouncements(announcementData || []);
    } catch (error) {
      console.error("error loading organization details:", error);
      setIsMember(false);
      setAnnouncements([]);
    } finally {
      setMembershipLoading(false);
    }
  };

  const handleSubmitApplication = async (message) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to apply.");

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (accountError) throw accountError;

      const { error: applicationError } = await supabase
        .from("applications")
        .insert({
          organization_id: org.id,
          student_id: account.id,
          message: message,
        });

      if (applicationError) {
        if (applicationError.code === "23505") {
          throw new Error(
            "You already have a pending application for this organization.",
          );
        }

        throw applicationError;
      }

      return true;
    } catch (error) {
      console.error("error submitting application:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkMembership();
  }, [org.id]);

  const formatTime = (date) =>
    new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <View style={{ flex: 1 }}>
      <TabScroll contentStyle={layout.screen} useNavPadding={false}>
        <View style={layout.banner}>
          <Image
            source={org.banner ? getImageSource(org.banner) : DefaultBanner}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          <View style={layout.profileSection}>
            <Avatar name={org.name} image={org.profile} size="profile" />
          </View>
        </View>

        <View style={[layout.content, layout.stack]}>
          <View style={layout.columnCenter}>
            <AppText variant="headline" align="center">
              {org.name}
            </AppText>
            <Pill label={org.category} tone="muted" />
          </View>

          <View style={card.footer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ViewMembers", { org })}
            >
              <AppText variant="caption" tone="primary">
                {org.memberCount} Members
              </AppText>
            </TouchableOpacity>

            {!membershipLoading && (
              <View style={layout.columnCenter}>
                {isMember ? (
                  <AppButton
                    title="Joined"
                    variant="secondary"
                    size="sm"
                    fullWidth={false}
                    disabled
                  />
                ) : (
                  <>
                    <AppButton
                      title="Apply for Membership"
                      size="sm"
                      fullWidth={false}
                      onPress={() => {
                        console.log("apply button pressed");
                        Keyboard.dismiss();
                        sheetRef.current?.open();
                      }}
                    />

                    <AppText variant="tag" tone="primary">
                      {org.slotCount} Slots Available
                    </AppText>
                  </>
                )}
              </View>
            )}
          </View>

          <View style={layout.stackInside}>
            <AppText variant="label">About</AppText>
            <AppText variant="caption" style={card.description}>
              {org.description}
            </AppText>
          </View>

          {!membershipLoading && isMember && (
            <View style={layout.stackInside}>
              <AppText variant="label">Announcements</AppText>

              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <AnnouncementCard
                    key={item.id}
                    title={item.title}
                    time={formatTime(item.created_at)}
                    message={item.body}
                  />
                ))
              ) : (
                <AppText variant="caption" tone="disabled">
                  No announcements available.
                </AppText>
              )}
            </View>
          )}
        </View>
      </TabScroll>

      {!membershipLoading && !isMember && (
        <ApplicationSheet ref={sheetRef} onSubmit={handleSubmitApplication} />
      )}
    </View>
  );
}
