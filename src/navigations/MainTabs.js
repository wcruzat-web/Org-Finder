import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen.js";
import theme from "../styles/theme-dark";
import OrgList from "../screens/OrgList.js";
import { useNavigation } from "@react-navigation/native";
import MyOrgsList from "../screens/MyOrgsList.js";
import {
  HomeIcon,
  OrgListIcon,
  MyOrgIcon,
  ProfileIcon,
} from "../../assets/icons/NavIcons";

const { colors } = theme;
const Tab = createBottomTabNavigator();

const TABS = [
  { key: "discover", label: "Discover", Icon: HomeIcon },
  { key: "orglists", label: "Org Lists", Icon: OrgListIcon },
  { key: "myorgs", label: "My Orgs", Icon: MyOrgIcon },
  { key: "profile", label: "Profile", Icon: ProfileIcon },
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

export default function MainTabs() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName="Discover"
      tabBar={renderNavBar}
      screenOptions={{
        headerTransparent: true,
        header: ({ options }) => (
          <Header title={options.title} onIconPress={() => navigation.navigate("Notifications")} />
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
      options={{ title: "Organizations" }}
      />
      <Tab.Screen
      name="MyOrgs"
      component={MyOrgsList}
      options={{ title: "My Organizations" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}