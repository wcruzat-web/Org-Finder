import React from "react";
import { Text } from "react-native";

import { text, textAlign, textTone } from "../../styles/style";

export default function AppText({
  variant = "body",
  tone,
  align,
  style,
  ...rest
}) {
  return (
    <Text
      {...rest}
      style={[
        text[variant] ?? text.body,
        tone ? textTone[tone] : null,
        align ? textAlign[align] : null,
        style,
      ]}
    />
  );
}

/**
 *  - variant: brand | display | headline | title | titleSmall | heading | body |
 *             subtitle | caption | label | link | buttonLabel   (default "body")
 *  - tone:    primary | secondary | disabled | brand | onBrand | error | success
 *             (overrides the variant's colour)
 *  - align:   left | center | right
 *  - style:   one-off override, applied last
 */