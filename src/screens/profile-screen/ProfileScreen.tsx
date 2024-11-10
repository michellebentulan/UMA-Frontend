import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen: React.FC = () => {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Fetch user profile data from backend on component mount
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Retrieve userId from AsyncStorage
        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await axios.get(
          `http://192.168.187.149:3000/users/${userId}`
        );
        const userData = response.data;

        // Update state with fetched data
        if (userData) {
          setUserName(`${userData.first_name} ${userData.last_name}`);
          setLocation(
            userData.barangay
              ? `${userData.barangay}, ${userData.town}`
              : "Location not set"
          );
          setPhoneNumber(userData.phone_number);
          if (userData.profile_image) {
            setProfileImageUrl(
              `http://192.168.187.149:3000/uploads/profile-images/${userData.profile_image}`
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        Alert.alert("Error", "Failed to fetch user profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Menu Button Only */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={RFValue(20)} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: profileImageUrl || "https://via.placeholder.com/150" }} // Display profile image or a placeholder
          style={styles.profileImage}
        />
      </View>

      {/* User Info */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabButtons}>
        <TouchableOpacity style={[styles.tabButton, styles.activeButton]}>
          <Text style={styles.tabButtonTextActive}>For Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.inactiveButton]}>
          <Text style={styles.tabButtonTextInactive}>Looking for</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    paddingHorizontal: 10,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: RFValue(18),
    fontFamily: "Montserrat_700Bold",
  },
  location: {
    fontSize: RFValue(13),
    color: "#888",
    fontFamily: "Montserrat_400Regular",
    marginTop: 4,
  },
  phoneNumber: {
    fontSize: RFValue(13),
    color: "#888",
    fontFamily: "Montserrat_400Regular",
    marginTop: 2,
  },
  tabButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  tabButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#000",
  },
  inactiveButton: {
    backgroundColor: "#E0E0E0",
  },
  tabButtonTextActive: {
    color: "#fff",
    fontFamily: "Montserrat_400Regular",
  },
  tabButtonTextInactive: {
    color: "#888",
    fontFamily: "Montserrat_400Regular",
  },
});

export default ProfileScreen;
