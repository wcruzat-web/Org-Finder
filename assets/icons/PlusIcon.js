import React from "react";
import Svg, { Path } from "react-native-svg";
import theme from "../../src/styles/theme-dark";

export default function PlusIcon({ size = 24, color = theme.colors.textSecondary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.25 3A3.25 3.25 0 0 0 3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3H6.25ZM12 7.5a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 0 1.5h-3v3a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3v-3A.75.75 0 0 1 12 7.5Z"
        fill={color}
      />
    </Svg>
  );
}