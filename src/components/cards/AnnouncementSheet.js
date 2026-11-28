import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AppText, AppButton, AppInput } from "../ui";
import { layout, sheets } from "../../styles/style";

const AnnouncementSheet = forwardRef(({ onSubmit }, ref) => {
  const sheetRef = useRef(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const snapPoints = useMemo(() => ["70%"], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.snapToIndex(0),
    close: () => {
      Keyboard.dismiss();
      sheetRef.current?.close();
    },
  }));

  const canPost = title.trim() && body.trim();
  const handlePost = () => {
    if (!canPost) return;
    onSubmit?.({ title: title.trim(), body: body.trim() });
    setTitle("");
    setBody("");
    sheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(i) => i === -1 && Keyboard.dismiss()}
      backdropComponent={(p) => (
        <BottomSheetBackdrop
          {...p}
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
        <AppText variant="heading">New announcement</AppText>
        <AppInput
          as={BottomSheetTextInput}
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="What's the headline?"
          maxLength={80}
        />
        <AppInput
          as={BottomSheetTextInput}
          label="Message"
          value={body}
          onChangeText={setBody}
          placeholder="Write your announcement..."
          multiline
          textAlignVertical="top"
          inputStyle={{ minHeight: 96 }}
        />
        <View style={[layout.buttonContainer]}>
          <AppButton
            title="Cancel"
            variant="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => sheetRef.current?.close()}
          />
          <AppButton
            title="Post"
            size="sm"
            fullWidth={false}
            onPress={handlePost}
            disabled={!canPost}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default AnnouncementSheet;
