import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { ChevronRight, Users } from "lucide-react-native";

import { AppButton, AppText, Avatar, Pill } from "../ui";
import HalftoneCorner from "./HalftoneCorner";
import { card, cardColors } from "../../styles/style";



export default function OrgCard({
  variant = "default",
  name,
  profile,
  tags = [],
  description,
  status,
  memberCount,
  tag,
  slots,
  onPress,
  style,
}) {
  const featured = variant === "featured";
  const Root = featured ? View: Pressable;
  const rootProps = featured
    ? {} : { onPress, accessibilityRole: "button", accessibilityLabel: name };

  return (
    <Root
      {...rootProps}
      style={[card.base, featured ? card.featured : card.default, style]}
    >
      {featured ? <HalftoneCorner /> : null}

      <View style={card.header}>
        {profile ? <Avatar name={name} image={profile} size={featured ? "md" : "lg"}  /> : <Avatar name={name} showPlaceholder={false} size={featured ? "md" : "lg"}  />}

        <View style={card.headerText}>
          <AppText variant={featured ? "bodySmall" : "body"} numberOfLines={1}>
            {name}
          </AppText>
          {tags.length > 0 ? (
            <View style={card.tags}>
              {tags.map((label, i) => (
                <AppText key={`${label}-${i}`} variant="tag">
                  {label}
                </AppText>
              ))}
            </View>
          ) : null}
        </View>

        {featured && tag ? <Pill label={tag} tone="muted" dot /> : null}
        {!featured &&
          status &&
          (status === "open" ? (
            <Pill label="Open" tone="success" />
          ) : status === "closing" ? (
            <Pill label="Closing Soon" tone="warning" />
          ) : status === "pending" ? (
            <Pill label="Pending" tone="info" />
          ) : status === "joined" ? (
            <Pill label="Joined" tone="muted" />
          ) : console.log("Invalid status \"" + status + "\" for " + name))}
      </View>

      <AppText
        variant="caption"
        numberOfLines={featured ? 3 : 2}
        style={card.description}
      >
        {description}
      </AppText>

      {featured ? (
        <View style={[card.footer, card.featuredFooter]}>
          <View style={card.stat}>
            <Users size={16} color={cardColors.icon} />
            <AppText variant="caption" tone="primary">
              {slots} Slots Available
            </AppText>
          </View>
          <AppButton
            title="Learn More"
            size="sm"
            fullWidth={false}
            onPress={onPress}
          />
        </View>
      ) : (
        <View style={card.footer}>
          <View style={card.stat}>
            <Users size={16} color={cardColors.icon} />
            <AppText variant="caption" tone="primary">
              {memberCount} Members
            </AppText>
          </View>
          <View
            hitSlop={8}
            style={card.more}
          >
            <AppText variant="link" tone="brand">
              More Info
            </AppText>
            <ChevronRight
              size={20}
              color={cardColors.accent}
              style={card.chevron}
            />
          </View>
        </View>
      )}
    </Root>
  );
}

/**
 * variant "default" (list card):
 *   name, tags, description, status ("Open" pill), memberCount, More Info link
 * variant "featured" (300 wide, halftone corner):
 *   name, tags, description, tag (pill with a dot), slots, Learn More button
 */
