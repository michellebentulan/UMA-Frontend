import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SvgImage from "../../../assets/svg-images/UMA-Logo.svg";

interface TopBarProps {
  isOnline: boolean;
  onNotificationsPress?: () => void;
  profileImageUrl?: string;
}

const TopBar = ({
  isOnline,
  onNotificationsPress,
  profileImageUrl,
}: TopBarProps) => {
  // console.log("Received profileImageUrl in TopBar:", profileImageUrl);
  const { width } = useWindowDimensions(); // Dynamically get the screen width

  return (
    <View style={styles.topBarContainer}>
      <View style={[styles.topBar1, { paddingHorizontal: width * 0.05 }]}>
        <View style={styles.logoContainer}>
          <SvgImage width={width * 0.21} height={width * 0.18} />
          <Text style={[styles.subtitle, { fontSize: width * 0.04 }]}>
            Explore the Marketplace
          </Text>
        </View>

        <Ionicons
          name="notifications-outline"
          size={width * 0.07}
          color="#000"
          style={styles.notificationIcon}
          onPress={onNotificationsPress}
        />

        <View style={styles.profileContainer}>
          <Image
            source={
              profileImageUrl && profileImageUrl !== ""
                ? { uri: profileImageUrl }
                : require("../../../assets/images/profile.jpg")
            }
            style={[
              styles.profileImage,
              { width: width * 0.12, height: width * 0.12 },
            ]}
            resizeMode="cover"
          />
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isOnline ? "green" : "gray",
                width: width * 0.03,
                height: width * 0.03,
                borderRadius: width * 0.02,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
  topBar1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
  },
  subtitle: {
    color: "#8E8E8E",
    marginTop: -15,
    fontFamily: "Montserrat_400Regular",
  },
  notificationIcon: {
    marginRight: -15,
    paddingTop: 15,
    marginHorizontal: 20,
  },
  profileContainer: {
    position: "relative",
  },
  profileImage: {
    borderRadius: 50, // Keep circular shape responsive
  },
  statusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#FFF",
  },
});

export default TopBar;
