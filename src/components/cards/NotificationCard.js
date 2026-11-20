import React from "react";
import { Pressable, View } from "react-native";

import { AppText, Avatar } from "../ui";
import { notification } from "../../styles/style";

export default function NotificationCard({
  name,
  initials,
  message,
  time,
  read = false,
  onPress,
  style,
}) {
  const Root = onPress ? Pressable : View;
  const rootProps = onPress
    ? { onPress, accessibilityRole: "button", accessibilityLabel: name }
    : {};

  return (
    <Root
      {...rootProps}
      style={[
        notification.base,
        read ? notification.read : notification.unread,
        style,
      ]}
    >
      <Avatar name={name} initials={initials} size="md" />

      <View style={notification.body}>
        <View style={notification.titleRow}>
          <AppText
            variant="bodySmall"
            tone={read ? "secondary" : undefined}
            numberOfLines={1}
            style={notification.title}
          >
            {name}
          </AppText>
          <AppText variant="tag" tone={read ? "secondary" : "primary"}>
            {time}
          </AppText>
        </View>

        <AppText
          variant="caption"
          tone={read ? "disabled" : undefined}
          numberOfLines={2}
          style={notification.message}
        >
          {message}
        </AppText>
      </View>
    </Root>
  );
}
