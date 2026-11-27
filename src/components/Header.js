import { Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { header, headerColor, headerMetrics } from "../styles/style";
import BackIcon from "../../assets/icons/Back";
import NotifIcon from "../../assets/icons/Notif";

const VARIANTS = {
  default: { showBack: false, centered: false },
  withReturnButton: {
    showBack: true,
    centered: true,
  },
};

function IconButton({ label, onPress, children }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={header.iconButton}
    >
      {children}
    </Pressable>
  );
}

export default function Header({
  title,
  variant = "default",
  onBack,
  onIconPress,
  hideIcon = false,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.default;

  return (
    <LinearGradient
      // Solid for the top quarter, then fades out. Same color at 0 alpha avoids a gray fringe.
      colors={[headerColor, `${headerColor}00`]}
      locations={[0.45, 1]}
      // The fade area is only decoration: let touches pass through to what's underneath
      pointerEvents="box-none"
      style={header.container}
    >
      {v.showBack ? (
        <IconButton label="Go back" onPress={onBack}>
          <BackIcon />
        </IconButton>
      ) : null}

      <Text
        numberOfLines={1}
        style={[header.title, v.centered && header.titleCentered]}
      >
        {title}
      </Text>

      {!hideIcon ? (
        <IconButton label="Notif" onPress={onIconPress}>
          <NotifIcon />
        </IconButton>
      ) : null}
    </LinearGradient>
  );
}
