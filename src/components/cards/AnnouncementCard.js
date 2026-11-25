import { Pressable, View, } from "react-native";

import { AppText } from "../ui";
import { card, cardColors } from "../../styles/style";
import AnnouncementIcon from "../../../assets/icons/Announcement";

export default function AnnouncementCard({
  title,
  time,
  message,
  onPress,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      style={[card.base, card.default, style]}
    >
      <View style={card.header}>
        <View style={card.avatar}>
          <AnnouncementIcon size={16} color={cardColors.accent} />
        </View>

        <View style={card.headerText}>
          <AppText variant="body" numberOfLines={1}>
            {title}
          </AppText>

          {time ? (
            <AppText variant="buttonLabelSmall" tone="disabled">
              {time}
            </AppText>
          ) : null}
        </View>

      </View>

      <AppText
        variant="caption"
        numberOfLines={3}
        style={card.description}
      >
        {message}
      </AppText>

    </Pressable>
  );
}