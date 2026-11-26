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
  topNav: fonts.Cause_Bold,
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
  topNav: { ...textStyle(FONT.topNav, colors.textPrimary, fontSizes["2xl"]) },
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

// #AppInput search variant (Figma: Input Field / Search Bar + Filter Button, 36 high)

export const inputSearch = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  bar: {
    flex: 1,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.elevated,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.border,
  },
  barFocused: { borderColor: colors.primary },
  field: {
    flex: 1,
    padding: 0,
    color: colors.textPrimary,
    fontFamily: FONT.label,
    fontSize: fontSizes.lg,
    lineHeight: 20,
  },
  filter: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  filterPressed: { backgroundColor: colors.elevated },
});

export const inputSearchPlaceholderColor = colors.textDisabled;

// #Layout

export const layout = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, overflow: "hidden" },
  gutter: { paddingHorizontal: spacing.lg },
  stack: { gap: spacing.md },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  columnCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.textDisabled,
    width: "95%",
    alignSelf: "center",
  },
  stackInside: { gap: spacing.sm },
  // Scrollable page body
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  banner: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderBottomWidth: 1,
    borderBlockColor: colors.onPrimary,
    marginBottom: 32,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    marginTop: -96,
    gap: spacing.sm,
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
  wordmark: {
    top: 296,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  slot: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});

// components/Header.js
export const headerMetrics = {
  fadeHeight: spacing.md,
};

export const headerColor = colors.background;

export const header = StyleSheet.create({
  container: {
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: { ...text.topNav, flex: 1 },
  titleCentered: { fontSize: fontSizes.xl, textAlign: "center" },
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

export const bottomNavPadding = bottomNavMetrics.itemHeight * 1.75;

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
export const parallaxBodyColor = colors.background;

export const parallaxView = StyleSheet.create({
  root: { flex: 1 },
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
  greetings: { position: "absolute", bottom: 0, paddingBottom: spacing["2xl"] * 1.5 },
});

// Avatar
export const avatar = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sm: { borderRadius: 999, width: 36, height: 36 },
  md: { borderRadius: spacing.md * 0.9, width: 40, height: 40 },
  lg: { width: 44, height: 44 },
  profile: { borderRadius: spacing.xl, width: 128, height: 128 },
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
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: colors.background,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.md,
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  switchPressed: {
    backgroundColor: colors.surface,
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  }
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

//SegmentedTabs
export const segmentedMetrics = { itemHeight: 28 };

export const segmented = StyleSheet.create({
  track: {
    backgroundColor: colors.surface,
    borderRadius: spacing.sm * 1.5,
    padding: spacing.xs,
  },
  // Measured for its width: the highlight slides across this area.
  inner: {
    flexDirection: "row",
    height: segmentedMetrics.itemHeight,
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: segmentedMetrics.itemHeight,
    borderRadius: spacing.sm,
    backgroundColor: colors.support,
  },
  tab: {
    flex: 1,
    height: segmentedMetrics.itemHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPressed: { opacity: 0.7 },
});

// CardStack
export const cardStackMotion = {
    // Fitted to the Figma stack: the cards behind are smaller, pushed to the
    // right so only their right edge shows, and tilted a little.
    rotate: ["-1deg", "3.75deg", "8.25deg", "8.25deg"],
    x: [0, 54, 89, 89],
    y: [0, 3, 10, 10],
    scale: [1, 0.75, 0.58, 0.58],
    overlay: [0, 0.35, 0.75, 0.75], // how much darker a card behind looks
    opacity: [1, 1, 1, 0],
    spring: { friction: 15, tension: 70, overshootClamping: false },
    swipeDistance: 80, // drag this far to send the card away
    flingVelocity: 0.6, // or flick faster than this
    dismissMs: 180, // how long the card takes to leave
    dragRange: 200, // drag distance that tilts the card the full amount
    dragRotation: 10, // degrees of tilt at that distance
    extraHeight: 16, // room under the front card for the cards behind it
    peek: 12, // Room kept free on the right for the cards behind
};

export const cardStack = StyleSheet.create({
    stage: { alignSelf: "stretch" },
    // Cards sit on top of each other; each hugs its own width.
    card: { position: "absolute", top: 0, left: 0, right: cardStackMotion.peek, alignItems: "center", },
    // Darkens the cards behind the front one.
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        borderRadius: spacing.xl,
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    dot: { borderRadius: 999 },
    dotActive: { width: spacing.sm *1.25, height: spacing.sm * 1.25, backgroundColor: colors.textSecondary },
    dotInactive: { width: spacing.sm, height: spacing.sm, backgroundColor: colors.textDisabled },
});

export default {
  text,
  textTone,
  textAlign,
  button,
  input,
  inputSearch,
  layout,
  header,
  bottomNav,
  parallaxView,
  avatar,
  pill,
  card,
  notification,
  segmented,
  cardStack,
};
