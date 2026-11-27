import React, {
  forwardRef,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from "react";

import { View, StyleSheet, Keyboard } from "react-native";

import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import { AppText, AppButton } from "../ui";
import { sheets } from "../../styles/style";

const ApplicationSheet = forwardRef(({ onSubmit }, ref) => {
  const sheetRef = useRef(null);
  const [message, setMessage] = useState("");

  const snapPoints = useMemo(() => ["55%"], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.snapToIndex(0),
    close: () => {
      Keyboard.dismiss();
      sheetRef.current?.close();
    },
  }));

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      await onSubmit?.(message.trim());

      setMessage("");
      sheetRef.current?.close();
    } catch (error) {
      console.error("application submission failed:", error);
    }
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(index) => {
        if (index === -1) {
          Keyboard.dismiss();
        }
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView style={sheets.content}>
        <AppText variant="heading">Apply for Membership</AppText>

        <AppText variant="caption">
          Tell us why you'd like to join this organization.
        </AppText>

        <BottomSheetTextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write your application..."
          multiline
          textAlignVertical="top"
          style={styles.input}
        />

        <View style={styles.buttons}>
          <AppButton
            title="Cancel"
            variant="secondary"
            onPress={() => sheetRef.current?.close()}
          />

          <AppButton
            title="Submit Application"
            onPress={handleSubmit}
            disabled={!message.trim()}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ApplicationSheet;

const styles = StyleSheet.create({
  input: {
    minHeight: 130,
    borderRadius: 16,
    backgroundColor: "#343950",
    padding: 16,
    color: "#FFFFFF",
    fontSize: 15,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
});
