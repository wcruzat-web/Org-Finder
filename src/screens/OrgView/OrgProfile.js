import { useState } from "react";
import { View, Image } from "react-native";
import {
  TabScroll,
  AppText,
  Avatar,
  AppButton,
  Pill,
  AppModal,
} from "../../components/ui";
import SwitchCard from "../../components/cards/SwitchCard";
import { layout, card } from "../../styles/style";
import { logoutUser } from "../../../library/services/authService";

import DefaultBanner from "../../../assets/banner-placeholder.png";
import { useNavigation } from "@react-navigation/native";

export default function OrgProfile() {
  const navigation = useNavigation();

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm: null,
  });

  const showModal = (title, message, options = {}) => {
    setModal({
      visible: true,
      title,
      message,
      type: options.type || "alert",
      confirmText: options.confirmText || "OK",
      cancelText: options.cancelText || "Cancel",
      onConfirm: options.onConfirm || null,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      showModal("Logged Out", "You have successfully logged out.");
    } catch (error) {
      showModal("Logout Failed", error.message);
      return;
    }
  };

  const confirmLogout = () => {
    showModal("Menu", "Log out of OrgFinder?", {
      type: "confirmCancel",
      confirmText: "Log out",
      cancelText: "Cancel",
      onConfirm: handleLogout,
    });
  };

  return (
    <>
      <TabScroll contentStyle={layout.screen} useNavPadding={false}>
        {/* Banner kontiner */}
        <View style={layout.banner}>
          {/* Ba is nner picshur */}
          <Image
            source={DefaultBanner}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {/* Frufayl */}
          <View style={layout.profileSection}>
            <Avatar name={null} image={null} size="profile" />
          </View>
        </View>

        <View style={[layout.content, layout.stack]}>
          {/* Name and filter tag continer */}
          <View style={layout.columnCenter}>
            <AppText variant="headline" align="center">
              Organization Name
            </AppText>
            <Pill label="Non-Academic" tone="muted" />
          </View>

          {/* Description */}
          <View style={layout.stackInside}>
            <AppText variant="label">About</AppText>
            <AppText variant="caption" style={card.description}>
              Org description goes here.
            </AppText>
          </View>

          {/* Settings and Switch Account */}
          <View style={layout.stack}>
            <View style={[card.base, card.default, layout.stackInside]}>
              <AppText variant="bodySmall">Edit Info</AppText>
            </View>

            <View style={[card.base, card.default, layout.stackInside]}>
              <View style={layout.stackInside}>
                <AppText variant="bodySmall">Switch Account</AppText>
                <SwitchCard
                  name="Back to Account" // Replace with user's name
                  onPress={() => navigation.navigate("MainTabs")}
                />
              </View>
            </View>

            <AppButton title="Log Out" onPress={confirmLogout} />
          </View>
        </View>
      </TabScroll>

      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={() => {
          const callback = modal.onConfirm;
          closeModal();
          callback?.();
        }}
        onClose={closeModal}
      />
    </>
  );
}