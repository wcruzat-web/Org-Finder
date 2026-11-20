import React, { forwardRef, useState } from "react";
import { TextInput, View } from "react-native";

import AppText from "./AppText";
import {
  input,
  inputPlaceholderColor,
  inputSelectionColor,
} from "../../styles/style";

const AppInput = forwardRef(function AppInput(
  {
    label,
    error,
    style,
    inputStyle,
    editable = true,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[input.wrapper, style]}>
      {label ? <AppText variant="label">{label}</AppText> : null}

      <TextInput
        ref={ref}
        placeholderTextColor={inputPlaceholderColor}
        selectionColor={inputSelectionColor}
        editable={editable}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          input.field,
          focused ? input.fieldFocused : null,
          error ? input.fieldError : null,
          editable ? null : input.fieldDisabled,
          inputStyle,
        ]}
      />

      {error ? (
        <AppText variant="caption" tone="error">
          {error}
        </AppText>
      ) : null}
    </View>
  );
});

export default AppInput;

/**
 *  - label:      optional small label above the field
 *  - error:      optional message under the field; also turns the border red
 *  - style:      override for the wrapper (spacing around the field)
 *  - inputStyle: override for the field itself
 */