import { useState, useEffect } from "react";
import { Alert, View, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import supabase from "../../library/supabase";
import {
  AppText,
  AppButton,
  TabScroll,
  Avatar,
  Pill,
  AppInput,
} from "../components/ui";
import { layout, card } from "../styles/style";
import DefaultBanner from "../../assets/banner-placeholder.png";
import { logoutUser } from "../../library/services/authService";
import SwitchCard from "../components/cards/SwitchCard";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    full_name: "",
    course: "",
  });

  const [officerOrganizations, setOfficerOrganizations] = useState([]);
  const [organizationError, setOrganizationError] = useState(null);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);

  const fetchOfficerOrganizations = async () => {
    try {
      setLoadingOrganizations(true);
      setOrganizationError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found.");

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id, auth_user_id, full_name, course")
        .eq("auth_user_id", user.id)
        .single();

      if (accountError) throw accountError;

      setProfile({
        full_name: account.full_name || "",
        course: account.course || "",
      });

      console.log("[PROFILE] PROFILE:", {
        full_name: account.full_name,
        course: account.course,
      });

      const { data: semesterId, error: semesterError } = await supabase.rpc(
        "get_active_semester_id",
      );

      if (semesterError) throw semesterError;

      if (!semesterId) {
        setOfficerOrganizations([]);
        return;
      }

      const { data: memberships, error: membershipError } = await supabase
        .from("organization_members")
        .select(
          `
          id,
          student_id,
          organization_id,
          semester_id,
          role,
          left_at,
          organizations!organization_members_organization_id_fkey (
            id,
            name,
            category,
            description
          )
        `,
        )
        .eq("student_id", account.id)
        .eq("semester_id", semesterId)
        .eq("role", "officer")
        .is("left_at", null);

      console.log("[PROFILE] MEMBERSHIPS:", memberships);
      console.log("[PROFILE] MEMBERSHIP ERROR:", membershipError);

      if (membershipError) throw membershipError;

      setOfficerOrganizations(
        (memberships || [])
          .map((membership) => membership.organizations)
          .filter(Boolean),
      );

      console.log("[PROFILE] FETCH COMPLETED");
    } catch (error) {
      console.error("[PROFILE] FETCH ERROR:", error);

      setOrganizationError(
        error.message ||
          "An error occurred while fetching profile information.",
      );
    } finally {
      setLoadingOrganizations(false);
      console.log("[PROFILE] LOADING FINISHED");
    }
  };

  useEffect(() => {
    console.log("PROFILE SCREEN MOUNTED");
    fetchOfficerOrganizations();
  }, []);

  const navigation = useNavigation();

  const getImageSource = (image) =>
    typeof image === "string" ? { uri: image } : image;

  const handleLogout = async () => {
    try {
      await logoutUser();

      Alert.alert("Logged Out", "You have successfully logged out.");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
      return;
    }
  };

  const confirmLogout = async () => {
    Alert.alert("Menu", "Log out of OrgFinder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  };

  return (
    <TabScroll useNavPadding={false}>
      {/* Banner */}
      <View style={layout.banner}>
        <Image
          source={DefaultBanner}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <View style={layout.profileSection}>
          <Avatar size="profile" />
        </View>
      </View>

      <View style={[layout.content, layout.stack]}>
        {/* Name and course */}
        <View style={layout.columnCenter}>
          <AppText variant="headline" align="center">
            {profile.full_name || "Student Name"}
          </AppText>

          {profile.course ? (
            <Pill label={profile.course} tone="muted" dot />
          ) : (
            <AppText variant="tag">Course not available</AppText>
          )}
        </View>

        {/* Additional information */}
        <View style={layout.stack}>
          <View style={[card.base, card.default, layout.stackInside]}>
            <AppText variant="bodySmall">Edit Info</AppText>
          </View>

          <View style={[card.base, card.default, layout.stackInside]}>
            <View style={layout.stackInside}>
              <AppText variant="bodySmall">Switch Account</AppText>

              {loadingOrganizations ? (
                <ActivityIndicator />
              ) : organizationError ? (
                <AppText variant="bodySmall">{organizationError}</AppText>
              ) : officerOrganizations.length === 0 ? (
                <SwitchCard
                  name="Test Switch"
                  onPress={() => navigation.navigate("OrgView")}
                />
              ) : (
                officerOrganizations.map((org) => (
                  <SwitchCard
                    key={org.id}
                    name={org.name}
                    onPress={() => navigation.navigate("OrgView")}
                  />
                ))
              )}
            </View>
          </View>

          <AppButton title="Log Out" onPress={confirmLogout} />
        </View>
      </View>
    </TabScroll>
  );
}
