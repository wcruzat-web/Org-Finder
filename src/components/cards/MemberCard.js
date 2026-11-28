import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { AppButton, AppText, Avatar, Pill } from "../ui";
import { card, memberCard, layout } from "../../styles/style";

const STATUS_PILL = {
  pending: { tone: "warning", label: "Pending" },
  accepted: { tone: "success", label: "Accepted" },
  rejected: { tone: "error", label: "Rejected" },
};

const LONG_RESPONSE = 140;

/**
 *  - variant:  "member" (default) | "applicant"
 *  - name, course, image: shown in both variants (no image -> initials)
 *  - isOfficer:  (member) officer pill instead of member pill
 *  - response:   (applicant) the message the student wrote in the application
 *  - appliedAt:  (applicant) optional, e.g. "2d ago"
 *  - status:     (applicant) "pending" (default) | "accepted" | "rejected".
 *                Buttons only show while pending.
 *  - onPress:    optional, makes the whole card tappable (e.g. open the profile)
 *  - onConfirm / onReject: (applicant) button handlers
 */
export default function MemberCard({
  variant = "member",
  name,
  course,
  image,
  isOfficer = false,
  isSelf = false,
  response,
  appliedAt,
  status = "pending",
  onPress,
  onConfirm,
  onReject,
  onLeave,
  style,
}) {
  const [expanded, setExpanded] = useState(false);
  const isApplicant = variant === "applicant";

  const pill = isApplicant
    ? (STATUS_PILL[status] ?? STATUS_PILL.pending)
    : isOfficer
      ? { tone: "info", label: "Officer" }
      : { tone: "muted", label: "Member" };

  const Root = onPress ? Pressable : View;
  const rootProps = onPress
    ? { onPress, accessibilityRole: "button", accessibilityLabel: name }
    : {};

  const longResponse = (response?.length ?? 0) > LONG_RESPONSE;

  return (
    <Root {...rootProps} style={[card.base, card.default, style]}>
      <View style={memberCard.header}>
        <Avatar name={name} image={image} showPlaceholder={false} />

        <View style={card.headerText}>
          <AppText variant="body" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {course}
          </AppText>
          {isApplicant && appliedAt ? (
            <AppText variant="tag" tone="disabled">
              Applied {appliedAt}
            </AppText>
          ) : null}
        </View>

        <Pill label={pill.label} tone={pill.tone} />
      </View>

      {isSelf ? (
        <View style={[layout.buttonContainer, {width: "40%", alignSelf: "flex-end"}]}>
          <AppButton
            title="Leave Organization"
            variant="leave"
            size="sm"
            fullWidth={false}
            style={memberCard.action}
            onPress={onLeave}
          />
        </View>
      ) : null}

      {isApplicant ? (
        <>
          <View style={memberCard.response}>
            <AppText variant="tag" tone="disabled">
              Application response
            </AppText>
            <AppText
              variant="caption"
              tone="primary"
              numberOfLines={expanded ? undefined : 3}
            >
              {response || "No response provided."}
            </AppText>
            {longResponse ? (
              <Pressable
                onPress={() => setExpanded((v) => !v)}
                hitSlop={8}
                accessibilityRole="button"
              >
                <AppText variant="tag" tone="brand">
                  {expanded ? "Show less" : "Read more"}
                </AppText>
              </Pressable>
            ) : null}
          </View>

          {status === "pending" ? (
            <View style={memberCard.actions}>
              <AppButton
                title="Reject"
                variant="secondary"
                size="sm"
                fullWidth={false}
                style={memberCard.action}
                accessibilityLabel={`Reject ${name}`}
                onPress={onReject}
              />
              <AppButton
                title="Confirm"
                size="sm"
                fullWidth={false}
                style={memberCard.action}
                accessibilityLabel={`Confirm ${name}`}
                onPress={onConfirm}
              />
            </View>
          ) : null}
        </>
      ) : null}
    </Root>
  );
}
