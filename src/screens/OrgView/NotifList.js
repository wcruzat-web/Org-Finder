import { View, TouchableOpacity } from "react-native";
import { NotificationCard } from "../../components/cards";
import { layout } from "../../styles/style";
import { AppText, TabScroll } from "../../components/ui";
import { spacing } from "../../styles/theme-dark";

export default function NotifList() {
  const time = ["now", "kanina", "kahapon"];

  return (
    <TabScroll useNavPadding={false}>
      <View style={[layout.content, {paddingTop: spacing["2xl"]}]}>
        <TouchableOpacity>
          <AppText variant="link" align="right">
            Mark all as read
          </AppText>
        </TouchableOpacity>
        {Array.from({ length: 12 }).map((_, i) => (
          <NotificationCard
            key={i}
            name="Membership Application"
            message="Yu Jimin sent an application form to your organization."
            time={time[i] ? time[i] : i + " hrs ago"}
            read={!time[i] && true}
          />
        ))}
      </View>
    </TabScroll>
  );
}