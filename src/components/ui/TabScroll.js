import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView } from "react-native";
import { layout } from "../../styles/style";
import { spacing } from "../../styles/theme-dark";

export default function TabScroll({ children, useNavPadding = true, contentStyle, ...rest }) {
  const headerHeight = useHeaderHeight();

  const navPadding = useNavPadding ? {paddingTop: headerHeight, paddingBottom: spacing["2xl"] * 1.75} : null;
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        layout.content,
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