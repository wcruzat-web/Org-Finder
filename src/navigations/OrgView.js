
import { useRef } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { AnnouncementSheet } from "../components/cards";
import theme from "../styles/theme-dark";
import { useNavigation } from "@react-navigation/native";
import { HomeIcon, MemberIcon, ProfileIcon } from "../../assets/icons/NavIcons";

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

export default function OrgView() {
  const navigation = useNavigation();
  const announceRef = useRef(null);

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
              announceRef={announceRef}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Members"
          component={MemberList}
          options={{ title: "Manage Members" }}
        />

        <Tab.Screen
          name="OrgProfile"
          component={OrgProfile}
          options={{ title: "Organization Profile" }}
        />
      </Tab.Navigator>

      <AnnouncementSheet
        ref={announceRef}
        onSubmit={(post) => {
          console.log(post);
        }}
      />
    </View>
  );
}
