import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from "react";

import { View, Keyboard } from "react-native";

import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import { AppText, AppInput, AppButton } from "../ui";
import { layout, sheets } from "../../styles/style";

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

        <AppInput
          as={BottomSheetTextInput}
          label="Why would you like to join our organization?"
          value={message}
          onChangeText={setMessage}
          placeholder="For I..."
          multiline
          textAlignVertical="top"
          inputStyle={{ minHeight: 72 }}
        />

        <View style={layout.buttonContainer}>
          <AppButton
            title="Cancel"
            variant="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => sheetRef.current?.close()}
          />

          <AppButton
            title="Submit Application"
            size="sm"
            fullWidth={false}
            onPress={handleSubmit}
            disabled={!message.trim()}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ApplicationSheet;