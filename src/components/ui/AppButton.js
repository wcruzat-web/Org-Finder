import React from "react";
import { ActivityIndicator, Pressable } from "react-native";

import AppText from "./AppText";
import PlusIcon from "../../../assets/icons/PlusIcon";
import {
  button,
  buttonLabelTone,
  buttonSpinnerColor,
} from "../../styles/style";

export default function AppButton({
  title,
  children,
  onPress,
  variant = "primary",
  icon,
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  accessibilityLabel,
  ...rest
}) {
  const blocked = disabled || loading;
  const leftIcon =
    icon !== undefined ? icon : variant === "composer" ? <PlusIcon /> : null;
  const labelVariant =
    variant === "composer"
      ? "body"
      : size === "sm"
        ? "buttonLabelSmall"
        : "buttonLabel";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof title === "string" ? title : undefined)
      }
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      {...rest}
      style={({ pressed }) => [
        button.base,
        button[variant] ?? button.primary,
        size === "sm" && variant !== "composer" ? button.sm : null,
        pressed ? button[`${variant}Pressed`] : null,
        fullWidth ? button.fullWidth : null,
        disabled ? button.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={buttonSpinnerColor[variant] ?? buttonSpinnerColor.primary}
        />
      ) : (
        <>
          {leftIcon}
          <AppText
            variant={labelVariant}
            tone={buttonLabelTone[variant] ?? buttonLabelTone.primary}
          >
            {children ?? title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

/**
 *  - title (or children): the label
 *  - variant:   primary (default) | secondary | ghost
 *  - loading:   shows a spinner and ignores presses
 *  - disabled:  dims the button and ignores presses
 *  - fullWidth: stretch to the parent's width (default true)
 *  - style:     one-off override, applied last
 */