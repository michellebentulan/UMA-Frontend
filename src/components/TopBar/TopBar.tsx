import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SvgImage from "../../../assets/svg-images/UMA-Logo.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface TopBarProps {
  isOnline: boolean;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  profileImageUrl?: string;
}

const TopBar = ({
  isOnline,
  onNotificationsPress,
  onProfilePress,
  profileImageUrl,
}: TopBarProps) => {
  // console.log("Received profileImageUrl in TopBar:", profileImageUrl);
  const { width } = useWindowDimensions(); // Dynamically get the screen width
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await axios.get(
          `http://192.168.74.149:3000/notifications?userId=${userId}`
        );

        const unreadNotifications = response.data.filter(
          (notification: any) => !notification.read
        );

        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        // console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadNotifications();
  }, []);

  return (
    <View style={styles.topBarContainer}>
      <View style={[styles.topBar1, { paddingHorizontal: width * 0.05 }]}>
        <View style={styles.logoContainer}>
          <SvgImage width={width * 0.21} height={width * 0.18} />
          <Text style={[styles.subtitle, { fontSize: width * 0.04 }]}>
            Explore the Marketplace
          </Text>
        </View>

        <TouchableOpacity onPress={onNotificationsPress} style={styles.icon}>
          <Ionicons name="notifications-outline" size={29} color="black" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.profileContainer}
          >
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
          </TouchableOpacity>
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
  icon: {
    position: "relative",
    marginRight: -15,
    paddingTop: 15,
    marginHorizontal: 40,
  },
  badge: {
    position: "absolute",
    right: -10,
    top: -10,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default TopBar;
