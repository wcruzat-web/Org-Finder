import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen.js";
import theme from "../styles/theme-dark";
import OrgList from "../screens/OrgList.js";
import NotifList from "../screens/NotifList.js"

const { colors } = theme;
const Tab = createBottomTabNavigator();

function renderNavBar({ state, navigation }) {
  return (
    <BottomNav
      activeKey={state.routes[state.index].name.toLowerCase()}
      onChange={(key) => {
        const route = state.routes.find((r) => r.name.toLowerCase() === key);
        if (route) navigation.navigate(route.name);
      }}
    />
  );
}

export default function MainTabs({ onLogout }) {

  return (
    <Tab.Navigator
      initialRouteName="Discover"
      tabBar={renderNavBar}
      screenOptions={{
        headerTransparent: true,
        header: ({ options }) => (
          <Header title={options.title} />
        ),
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{ title: "Discover" }}
      />
      <Tab.Screen
      name="OrgLists"
      component={OrgList}
      options={{ title: "Organizations"}}
      />
      <Tab.Screen
      name="Notification"
      component={NotifList}
      options={{ title: "Notification"}}
      />
      <Tab.Screen
        name="Profile"
        options={{ title: "Profile" }}
      >
        {(props) => <ProfileScreen {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
