
import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";

import AppText from "./AppText";
import DefaultAvatar from "../../../assets/default-avatar.jpg";
import { avatar } from "../../styles/style";
import { colors } from "../../styles/theme-dark";

export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export default function Avatar({
  name,
  initials,
  image,
  size = "md",
  style,
  showPlaceholder = true,
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  // Determine which image to display.
  const imageSource = image && !imageError
    ? typeof image === "string" ? { uri: image } : image
    : showPlaceholder ? DefaultAvatar : null;

  const hasBorder = size === "profile" ? { borderWidth: 1, borderColor: colors.onPrimary } : null;

  return (
    <View style={[
      avatar.base,
      avatar[size] ?? avatar.md,
      hasBorder,
      style
    ]}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={{width: "100%", height: "100%"}}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <AppText variant={size === "md" ? "initials" : "initialsLg"}>
          {initials ?? getInitials(name)}
        </AppText>
      )}
    </View>
  );
}
