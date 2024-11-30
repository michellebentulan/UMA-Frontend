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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";

const ProfileScreen: React.FC = () => {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [town, setTown] = useState<string | undefined>(undefined);
  const [barangay, setBarangay] = useState<string | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Retrieve userId from AsyncStorage
        if (!userId) {
          throw new Error("User ID not found");
        }

        // Fetch user profile
        const response = await axios.get(
          `http://192.168.29.149:3000/users/${userId}`
        );
        const userData = response.data;

        // Update state with fetched data
        if (userData) {
          console.log("User Data:", userData);
          setUserName(`${userData.first_name} ${userData.last_name}`);
          setPhoneNumber(userData.phone_number);
          if (userData.profile_image) {
            setProfileImageUrl(
              `http://192.168.29.149:3000/uploads/profile-images/${userData.profile_image}`
            );
          }

          // Set town and barangay
          setTown(userData.town);
          setBarangay(userData.barangay);

          // Fetch associated location data based on town and barangay
          if (userData.town && userData.barangay) {
            console.log(
              "Fetching location for:",
              userData.town,
              userData.barangay
            );
            const locationResponse = await axios.get(
              `http://192.168.29.149:3000/locations?town=${userData.town}&barangay=${userData.barangay}`
            );
            const locationData = locationResponse.data;

            console.log("Location Data:", locationData);

            if (locationData.length > 0) {
              setLatitude(Number(locationData[0].latitude)); // Convert to number
              setLongitude(Number(locationData[0].longitude)); // Convert to number
              setLocation(`${userData.barangay}, ${userData.town}`);
            } else {
              setLocation("Location not set");
            }
          } else {
            setLocation("Location not set");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        Alert.alert("Error", "Failed to fetch user profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleViewOnMap = () => {
    try {
      console.log("Attempting to navigate to MapViewScreen with params:");
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("Town:", town);
      console.log("Barangay:", barangay);
      if (
        latitude !== undefined &&
        longitude !== undefined &&
        town !== undefined &&
        barangay !== undefined
      ) {
        navigation.navigate("MapViewScreen", {
          town,
          barangay,
          latitude,
          longitude,
        });
      } else {
        Alert.alert(
          "Location Error",
          "Location coordinates are not available."
        );
      }
    } catch (error) {
      console.error("Error navigating to MapViewScreen:", error);
      Alert.alert("Navigation Error", "Unable to navigate to the map view.");
    }
  };

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
        <TouchableOpacity onPress={handleViewOnMap}>
          <Text style={styles.location}>{location}</Text>
        </TouchableOpacity>
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
    fontSize: RFValue(14),
    color: "#888",
    fontFamily: "Montserrat_400Regular",
    marginTop: 4,
    textDecorationLine: "underline",
  },
  phoneNumber: {
    fontSize: RFValue(14),
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
