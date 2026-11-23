import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";
import MainTabs from "./MainTabs";
import OrgDetails from "../screens/OrgDetails";
import NotifList from "../screens/NotifList";

import theme from "../styles/theme-dark";

const { colors } = theme;

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={({ navigation, route }) => ({
        headerTransparent: true,
        header: ({ options }) => (
          <Header
            title={options.title}
            variant="withReturnButton"
            onBack={navigation.goBack}
          />
        ),
        sceneStyle: { backgroundColor: colors.background },
      })}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OrgDetail"
        component={OrgDetails}
        options={({ route }) => ({
          title: route.params?.org?.name ?? "Organization",
        })}
      />

      <Stack.Screen 
        name="Notifications"
        component={NotifList}
        options={{title: "Notifications"}}
      />
    </Stack.Navigator>
  );
}
