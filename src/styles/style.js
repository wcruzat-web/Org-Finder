import { StyleSheet } from "react-native";
import themeDark from "./theme-dark";

const { colors, spacing, fontSizes, fonts } = themeDark;
const FONT = {
  brand: fonts.Overlock_Bold,
  display: fonts.Cause_Bold,
  headline: fonts.Cause_Bold,
  title: fonts.Fredoka_Bold,
  titleSmall: fonts.Fredoka_Bold,
  heading: fonts.Fredoka_Regular,
  body: fonts.Fredoka_Regular,
  subtitle: fonts.Fredoka_Regular,
  caption: fonts.Fredoka_Light,
  label: fonts.Fredoka_Regular,
  link: fonts.Fredoka_Regular,
  buttonLabel: fonts.Cause_Black,
  bodySmall: fonts.Fredoka_Regular,
  tag: fonts.Fredoka_Regular,
  initials: fonts.Overlock_Bold,
  buttonLabelSmall: fonts.Cause_Bold,
};

//get the lineHeight, used for text wherein line height is 1.25 of font size, adjust value if needed
const lh = (size) => Math.round(size * 1.25);
const textStyle = (font, color, size) => ({
  fontFamily: font,
  color: color,
  fontSize: size,
  lineHeight: lh(size),
});

// #AppText Styles

export const text = StyleSheet.create({
  brand: { ...textStyle(FONT.brand, colors.primary, fontSizes["4xl"]) },
  display: { ...textStyle(FONT.display, colors.textPrimary, fontSizes["3xl"]) },
  headline: {
    ...textStyle(FONT.headline, colors.textPrimary, fontSizes["3xl"]),
  },
  title: { ...textStyle(FONT.title, colors.textPrimary, fontSizes["2xl"]) },
  titleSmall: {
    ...textStyle(FONT.titleSmall, colors.textPrimary, fontSizes.xl),
  },
  heading: { ...textStyle(FONT.heading, colors.textPrimary, fontSizes.lg) },
  body: { ...textStyle(FONT.body, colors.textPrimary, fontSizes.lg) },
  subtitle: { ...textStyle(FONT.subtitle, colors.textSecondary, fontSizes.lg) },
  caption: { ...textStyle(FONT.caption, colors.textSecondary, fontSizes.md) },
  label: {
    ...textStyle(FONT.label, colors.textSecondary, fontSizes.md),
    lineHeight: fontSizes.md,
  },
  link: {
    ...textStyle(FONT.link, colors.primary, fontSizes.md),
    textDecorationLine: "underline",
  },
  bodySmall: { ...textStyle(FONT.bodySmall, colors.textPrimary, fontSizes.md) },
  tag: { ...textStyle(FONT.tag, colors.textSecondary, fontSizes.xs) },
  initials: { ...textStyle(FONT.initials, colors.textPrimary, fontSizes.lg) },
  initialsLg: { ...textStyle(FONT.initials, colors.textPrimary, fontSizes.xl) },
  buttonLabel: {
    ...textStyle(FONT.buttonLabel, colors.onPrimary, fontSizes.lg),
  },
  buttonLabelSmall: {
    ...textStyle(FONT.buttonLabelSmall, colors.onPrimary, fontSizes.sm),
  },
});

export const textTone = StyleSheet.create({
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  disabled: { color: colors.textDisabled },
  brand: { color: colors.primary },
  onBrand: { color: colors.onPrimary },
  error: { color: colors.error },
  onError: { color: colors.errorBg },
  success: { color: colors.success },
  onSuccess: { color: colors.successBg },
  warning: { color: colors.warning },
  onWarning: { color: colors.warningBg },
  info: { color: colors.info },
  onInfo: { color: colors.infoBg },
});

export const textAlign = StyleSheet.create({
  left: { textAlign: "left" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
});

// #AppButton Styles

export const button = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  sm: { height: 32, paddingHorizontal: spacing.md },
  fullWidth: { alignSelf: "stretch" },
  primary: { backgroundColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryPressed },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  secondaryPressed: { backgroundColor: colors.surface },
  ghost: { backgroundColor: "transparent" },
  ghostPressed: { opacity: 0.6 },
  disabled: { opacity: 0.75 },
});

export const buttonLabelTone = {
  primary: "onBrand",
  secondary: "primary",
  ghost: "brand",
};

export const buttonSpinnerColor = {
  primary: colors.onPrimary,
  secondary: colors.textPrimary,
  ghost: colors.primary,
};

// #AppInput Styles

export const input = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  field: {
    height: 50,
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontFamily: FONT.label,
    fontSize: fontSizes.md,
  },
  fieldFocused: { borderColor: colors.primary },
  fieldError: { borderColor: colors.error },
  fieldDisabled: { opacity: 0.5 },
});

export const inputPlaceholderColor = colors.textSecondary;
export const inputSelectionColor = colors.primary;

// #Layout

export const layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  gutter: { paddingHorizontal: spacing.lg },
  stack: { gap: spacing.md },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  columnCenter: {
    alignItems: "center",
    justifyContent: "center"
  },
  offsetNavbar: { paddingTop: spacing["2xl"] * 1.5 },
  // Scrollable page body
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  // Login / Signin form pieces
  formHeader: {
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  formAside: { alignSelf: "flex-end", marginTop: spacing.sm },
  formAction: { marginTop: spacing.lg },
  formFooter: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: spacing.lg,
  },
});

// components/Header.js
export const header = StyleSheet.create({
  container: {
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  title: { flex: 1 },
  titleCentered: { textAlign: "center" },
  iconButton: {
    width: 24,
    height: 24,
  },
});

// components/BottomNav.js.
export const bottomNavMetrics = {
  itemWidth: 75,
  itemHeight: 48,
  border: 2,
  radius: 999,
};

export const bottomNavColors = {
  inactive: colors.textSecondary,
  active: colors.surface,
};

export const bottomNav = StyleSheet.create({
  outer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  pill: {
    backgroundColor: colors.surface,
    borderWidth: bottomNavMetrics.border,
    borderColor: colors.border,
    borderRadius: bottomNavMetrics.radius,
    padding: spacing.sm,
  },
  track: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: bottomNavMetrics.itemHeight,
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: bottomNavMetrics.itemWidth,
    height: bottomNavMetrics.itemHeight,
    borderRadius: bottomNavMetrics.radius,
    backgroundColor: colors.primary,
  },
  item: {
    width: bottomNavMetrics.itemWidth,
    height: bottomNavMetrics.itemHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: { width: 24, height: 24 },
  label: {
    fontFamily: FONT.label,
    fontSize: fontSizes.sm,
    lineHeight: 12,
    textAlign: "center",
  },
});

//components/ParallaxHeaderScrollView.js
export const parallaxView = StyleSheet.create({
  root: { flex: 1},
  fill: { width: "100%", height: "100%" },
  topLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    transformOrigin: "top",
  },
  bottomLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  body: { marginTop: -1 },
});

// Avatar
export const avatar = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  md: { borderRadius: spacing.md * 0.90, width: 40, height: 40 },
  lg: { width: 44, height: 44 },
});

// Pill
export const pill = StyleSheet.create({
  base: {
    height: 20,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  success: { backgroundColor: colors.success },
  warning: { backgroundColor: colors.warning },
  error: { backgroundColor: colors.error },
  info: { backgroundColor: colors.info },
  muted: { backgroundColor: colors.supportSoft },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: colors.textSecondary,
  },
});

export const pillLabel = {
  success: { variant: "tag", tone: "onSuccess" },
  muted: { variant: "tag", tone: "secondary" },
  warning: { variant: "tag", tone: "onWarning" },
  error: { variant: "tag", tone: "onError" },
  info: { variant: "tag", tone: "onInfo" },
};

// Cards
export const cardColors = {
  icon: colors.textSecondary,
  accent: colors.primary,
  halftone: colors.supportSoft,
};

export const card = StyleSheet.create({
  base: {
    borderRadius: spacing.lg,
    overflow: "hidden",
    padding: spacing.md,
    gap: spacing.sm,
  },
  default: { backgroundColor: colors.elevated },
  featured: {
    width: 320,
    borderRadius: spacing.xl,
    backgroundColor: colors.support,
    padding: spacing.md,
  },
  header: { flexDirection: "row", gap: spacing.sm },
  headerText: { flex: 1 },
  tags: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  description: { textAlign: "justify" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 20,
  },
  featuredFooter: { marginTop: spacing.sm },
  stat: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  more: { flexDirection: "row", alignItems: "center" },
  chevron: { marginRight: -spacing.sm },
  halftone: { position: "absolute", top: 0, right: 0 },
});

// Notification Cards
export const notification = StyleSheet.create({
  base: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: spacing.lg,
  },
  unread: { backgroundColor: colors.support },
  read: { backgroundColor: colors.supportSoft },
  body: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  title: { flex: 1 },
  message: { marginTop: spacing.xs },
});

export default {
  text,
  textTone,
  textAlign,
  button,
  input,
  layout,
  header,
  bottomNav,
  parallaxView,
  avatar,
  pill,
  card,
  notification,
};
