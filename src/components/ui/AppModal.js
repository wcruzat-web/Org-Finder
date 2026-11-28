
import { Modal, View, Pressable, StyleSheet } from "react-native";

import AppText from "./AppText";
import AppButton from "./AppButton";

import { modal, layout } from "../../styles/style";

export default function AppModal({
  visible,
  type = "alert",
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  closeOnBackdrop = true,
}) {
  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleRequestClose = () => {
    if (type === "confirmCancel") {
      handleCancel();
    } else {
      handleClose();
    }
  };

  const buttonLabel =
    confirmText || (type === "alert" ? "OK" : "Confirm");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <View style={modal.overlay}>
        {/* Backdrop */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeOnBackdrop ? handleRequestClose : undefined}
        />

        {/* Modal Content */}
        <View style={modal.container}>
          {title && (
            <AppText variant="heading" tone="primary">
              {title}
            </AppText>
          )}

          <AppText variant="body" tone="secondary">
            {message}
          </AppText>

          {/* Buttons */}
          <View style={layout.buttonContainer}>
            {type === "confirmCancel" && (
              <AppButton
                title={cancelText}
                variant="secondary"
                size="sm"
                fullWidth={false}
                onPress={handleCancel}
              />
            )}

            <AppButton
              title={buttonLabel}
              variant="primary"
              size="sm"
              fullWidth={false}
              onPress={type === "alert" ? handleClose : handleConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}