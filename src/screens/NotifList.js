import { View, ScrollView, TouchableOpacity } from "react-native";
import { NotificationCard } from "../components/cards";
import { layout } from "../styles/style";
import { AppText } from "../components/ui";

export default function NotifList() {
  const time = ["now", "kanina", "kahapon"];

  return (
    <ScrollView style={layout.offsetNavbar}>
      <View style={layout.content}>
        <TouchableOpacity>
          <AppText variant="link" align="right">Mark all as read</AppText>
        </TouchableOpacity>
        {Array.from({ length: 10 }).map((_, i) => (
          <NotificationCard
          key={i}
          name="Organization Name"
          message="For I, For I, For I am the storm..."
          time={time[i] ? time[i] : i + " hrs ago"}
          read={!time[i] && true}
          />
        ))}
      </View>
    </ScrollView>
  );
}
