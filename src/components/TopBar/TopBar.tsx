import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SvgImage from "../../../assets/svg-images/UMA-Logo.svg";

interface TopBarProps {
  isOnline: boolean;
  onNotificationsPress?: () => void; // Optional prop for handling notification icon press
}

const TopBar = ({ isOnline, onNotificationsPress }: TopBarProps) => {
  return (
    <View style={styles.topBarContainer}>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <SvgImage width={85} height={85} />
          <Text style={styles.subtitle}>Explore the Marketplace</Text>
        </View>

        <Ionicons
          name="notifications-outline"
          size={30}
          color="#000"
          style={styles.notificationIcon}
          onPress={onNotificationsPress} // Handle notification icon press
        />

        <View style={styles.profileContainer}>
          <Image
            source={require("../../../assets/images/profile.jpg")}
            style={styles.profileImage}
          />
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isOnline ? "green" : "gray" },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    top: 0, // Position it at the top
    left: 0,
    right: 0,
    zIndex: 1000,
    // backgroundColor: "#FFFFFF", // Slight off-white background for the rounded top bar
    height: 100,
    paddingVertical: 18,
    paddingHorizontal: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 5, // Shadow for Android
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#8E8E8E",
    marginTop: -20,
    fontFamily: "Montserrat_400Regular",
  },
  notificationIcon: {
    marginRight: -35,
    marginHorizontal: 20, // Create spacing between the notification and the profile image
  },
  profileContainer: {
    position: "relative", // To position the status dot over the image
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30, // Circular image
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 10, // Circular dot
    position: "absolute",
    bottom: 0, // Positioned at the bottom-right of the image
    right: 0,
    borderWidth: 2,
    borderColor: "#FFF", // White border around the dot for a clean look
  },
});

export default TopBar;
