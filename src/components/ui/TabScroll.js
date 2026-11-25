import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView } from "react-native";
import { layout, bottomNavPadding } from "../../styles/style";
import { spacing } from "../../styles/theme-dark";

export default function TabScroll({ children, useNavPadding = true, contentStyle, ...rest }) {
  const headerHeight = useHeaderHeight();

  const navPadding = useNavPadding ? { paddingTop: headerHeight, paddingBottom: bottomNavPadding } : { paddingTop: spacing.md, paddingBottom: bottomNavPadding };
  return (
    <ScrollView
      style={[ layout.screen ]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        {flexGrow: 1},
        navPadding,
        contentStyle,
      ]}
      scrollIndicatorInsets={{ top: headerHeight }}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}