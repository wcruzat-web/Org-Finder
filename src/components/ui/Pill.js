import React from "react";
import { View } from "react-native";

import AppText from "./AppText";
import { pill, pillLabel } from "../../styles/style";

export default function Pill({ label, tone = "muted", dot = false, style }) {
  const text = pillLabel[tone] ?? pillLabel.success;

  return (
    <View style={[pill.base, pill[tone] ?? pill.success, style]}>
      {dot ? <View style={pill.dot} /> : null}
      <AppText {...text}>{label}</AppText>
    </View>
  );
}
