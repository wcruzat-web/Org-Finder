import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { ChevronRight, Users } from "lucide-react-native";

import { AppButton, AppText, Avatar, Pill } from "../ui";
import HalftoneCorner from "./HalftoneCorner";
import { card, cardColors } from "../../styles/style";



export default function OrgCard({
  variant = "default",
  name,
  initials,
  tags = [],
  description,
  status,
  memberCount,
  tag,
  slots,
  onPress,
  onMorePress,
  style,
}) {
  const featured = variant === "featured";
  const Root = onPress ? Pressable : View;
  const rootProps = onPress
    ? { onPress, accessibilityRole: "button", accessibilityLabel: name }
    : {};
  const handleMore = onMorePress ?? onPress;

  return (
    <Root
      {...rootProps}
      style={[card.base, featured ? card.featured : card.default, style]}
    >
      {featured ? <HalftoneCorner /> : null}

      <View style={card.header}>
        <Avatar name={name} initials={initials} size={featured ? "md" : "lg"} />

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
            onPress={handleMore}
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
          <TouchableOpacity
            onPress={handleMore}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`More info about ${name}`}
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
          </TouchableOpacity>
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
