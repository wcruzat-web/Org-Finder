import { useRef, useState } from "react";
import { View, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { AnnouncementSheet } from "../components/cards";
import theme from "../styles/theme-dark";
import { useNavigation } from "@react-navigation/native";
import { HomeIcon, MemberIcon, ProfileIcon } from "../../assets/icons/NavIcons";
import supabase from "../../library/supabase";

import HomeScreen from "../screens/OrgView/HomeScreen";
import MemberList from "../screens/OrgView/MemberList";
import OrgProfile from "../screens/OrgView/OrgProfile";

const { colors } = theme;
const Tab = createBottomTabNavigator();

const TABS = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "members", label: "Members", Icon: MemberIcon },
  { key: "orgprofile", label: "Profile", Icon: ProfileIcon },
];

function renderNavBar({ state, navigation }) {
  return (
    <BottomNav
      tabs={TABS}
      activeKey={state.routes[state.index].name.toLowerCase()}
      onChange={(key) => {
        const route = state.routes.find((r) => r.name.toLowerCase() === key);

        if (route) navigation.navigate(route.name);
      }}
    />
  );
}

export default function OrgView({ route }) {
  const navigation = useNavigation();
  const announceRef = useRef(null);
  const [announcementRefreshKey, setAnnouncementRefreshKey] = useState(0);

  const organization = route.params?.organization;

  // save a new announcement for the selected organization
  const handleAnnouncementSubmit = async (post) => {
    try {
      if (!organization?.id) {
        Alert.alert("Error", "No organization selected.");
        return false;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert("Error", "Unable to identify the logged-in user.");
        return false;
      }

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (accountError || !account) {
        console.error("error fetching author account:", accountError);
        Alert.alert("Error", "Unable to identify the announcement author.");
        return false;
      }

      const { error: insertError } = await supabase
        .from("announcements")
        .insert({
          organization_id: organization.id,
          author_id: account.id,
          title: post.title,
          body: post.body,
        });

      if (insertError) {
        console.error("error posting announcement:", insertError);
        Alert.alert("Error", "Unable to post announcement.");
        return false;
      }

      setAnnouncementRefreshKey((current) => current + 1);
      Alert.alert("Success", "Announcement posted successfully.");

      return true;
    } catch (error) {
      console.error("unexpected announcement error:", error);
      Alert.alert("Error", "Something went wrong while posting.");
      return false;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={renderNavBar}
        screenOptions={{
          headerTransparent: true,
          header: ({ options }) => (
            <Header
              title={options.title}
              onIconPress={() => navigation.navigate("OrgNotifs")}
            />
          ),
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tab.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              organization={organization}
              announceRef={announceRef}
              announcementRefreshKey={announcementRefreshKey}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Members" options={{ title: "Manage Members" }}>
          {(props) => <MemberList {...props} organization={organization} />}
        </Tab.Screen>

        <Tab.Screen
          name="OrgProfile"
          options={{ title: "Organization Profile" }}
        >
          {(props) => <OrgProfile {...props} organization={organization} />}
        </Tab.Screen>
      </Tab.Navigator>

      <AnnouncementSheet
        ref={announceRef}
        onSubmit={handleAnnouncementSubmit}
      />
    </View>
  );
}
