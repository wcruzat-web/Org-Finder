import React from "react";
import { View } from "react-native";

import AppText from "./AppText";
import { avatar } from "../../styles/style";

// Uses the first letter of the first two words.
export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export default function Avatar({ name, initials, size = "md", style }) {
  return (
    <View style={[avatar.base, avatar[size] ?? avatar.md, style]}>
      <AppText variant={size === "md" ? "initials" : "initialsLg"}>{initials ?? getInitials(name)}</AppText>
    </View>
  );
}
