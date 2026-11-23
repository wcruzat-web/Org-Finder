import { View, ScrollView, TouchableOpacity } from "react-native";
import { NotificationCard } from "../components/cards";
import { layout } from "../styles/style";
import { AppText, TabScroll } from "../components/ui";

export default function NotifList() {
  const time = ["now", "kanina", "kahapon"];

  return (
    <TabScroll>
        <TouchableOpacity>
          <AppText variant="link" align="right">Mark all as read</AppText>
        </TouchableOpacity>
        {Array.from({ length: 12 }).map((_, i) => (
          <NotificationCard
          key={i}
          name="Organization Name"
          message="For I, For I, For I am the storm..."
          time={time[i] ? time[i] : i + " hrs ago"}
          read={!time[i] && true}
          />
        ))}
    </TabScroll>
  );
}
