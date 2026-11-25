import { Pressable, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { AppText, Avatar } from "../ui";
import { card, cardColors, layout } from "../../styles/style";

export default function SwitchCard({ name, profile, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${name}`}
      style={({ pressed }) => [
        card.switch,
        pressed && card.switchPressed,
        style,
      ]}
    >
      <View style={card.switchInfo}>
        <Avatar name={name} image={profile} size="sm" />
        <AppText variant="body" numberOfLines={1}>
          {name}
        </AppText>
      </View>

      <ChevronRight size={24} color={cardColors.accent} />
    </Pressable>
  );
}