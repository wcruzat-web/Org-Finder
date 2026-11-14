export const colors = {
    // brand
    primary: "#BC9A7A",
    primaryPressed: "#A3825F",
    onPrimary: "#1F2133",
    accent: "#8B9CA3",
    onAccent: "#1F2133",

    // neutral
    background: "#1F2133",
    surface: "#2A2E42",
    elevated: "#424B5F",
    border: "#4A5469",
    textPrimary: "#ECE7E1",
    textSecondary: "#A7B2B8",
    textDisabled: "#6B7689",

    // status
    success: "#6FCF97",
    successBg: "#1B3329",
    warning: "#E5B567",
    warningBg: "#3A2F1A",
    error: "#F28B82",
    errorBg: "#3D2226",
    info: "#7FB2E5",
    infoBg: "#1E3048",
};

const BASE = 4;
export const spacing = {
    xs: BASE,
    sm: BASE * 2,
    md: BASE * 4,
    lg: BASE * 6,
    xl: BASE * 8,
    '2xl': BASE * 12,
};

export const fontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
};

export default { colors, spacing, fontSizes };