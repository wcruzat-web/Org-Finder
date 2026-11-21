import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView } from "react-native";
import { layout } from "../../styles/style";
import { spacing } from "../../styles/theme-dark";

export default function TabScroll({ children, contentStyle, ...rest }) {
  const headerHeight = useHeaderHeight();
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        layout.content,
        { paddingTop: headerHeight, paddingBottom: spacing["2xl"] * 1.75 },
        contentStyle,
      ]}
      scrollIndicatorInsets={{ top: headerHeight }}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}