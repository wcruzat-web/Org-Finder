import React, { forwardRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import AppText from "./AppText";
import {
  input,
  inputPlaceholderColor,
  inputSelectionColor,
  inputSearch,
  inputSearchPlaceholderColor,
} from "../../styles/style";
import { SearchIcon, FilterIcon } from "../../../assets/icons/SearchIcons";

const AppInput = forwardRef(function AppInput(
  {
    variant = "default",
    showFilter = true,
    onFilterPress,
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

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  // Search bar (Figma: Input Field / Search Bar). The filter button is a toggle.
  if (variant === "search") {
    return (
      <View style={[inputSearch.row, style]}>
        <View
          style={[
            inputSearch.bar,
            focused ? inputSearch.barFocused : null,
            editable ? null : input.fieldDisabled,
          ]}
        >
          <SearchIcon />
          <TextInput
            ref={ref}
            placeholder="Search"
            placeholderTextColor={inputSearchPlaceholderColor}
            selectionColor={inputSelectionColor}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            editable={editable}
            {...rest}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[inputSearch.field, inputStyle]}
          />
        </View>

        {showFilter ? (
          <Pressable
            onPress={onFilterPress}
            accessibilityRole="button"
            accessibilityLabel="Filters"
            style={({ pressed }) => [
              inputSearch.filter,
              pressed ? inputSearch.filterPressed : null,
            ]}
          >
            <FilterIcon />
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[input.wrapper, style]}>
      {label ? <AppText variant="label">{label}</AppText> : null}

      <TextInput
        ref={ref}
        placeholderTextColor={inputPlaceholderColor}
        selectionColor={inputSelectionColor}
        editable={editable}
        {...rest}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
 *  - variant:    "default" | "search"  (search = pill with search icon, 36 high)
 *  - showFilter: (search only) show the filter button next to the bar. Default true
 *  - onFilterPress: (search only) called when the filter button is pressed
 *  - label:      optional small label above the field
 *  - error:      optional message under the field; also turns the border red
 *  - style:      override for the wrapper (spacing around the field)
 *  - inputStyle: override for the field itself
 */