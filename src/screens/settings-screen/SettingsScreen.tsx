import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
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
          setUserName(`${userData.first_name} ${userData.last_name}`);
          if (userData.profile_image) {
            setProfileImageUrl(
              `http://192.168.29.149:3000/uploads/profile-images/${userData.profile_image}`
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

  const handleEditProfile = () => {
    // navigation.navigate("EditProfileScreen");
  };

  const handlePrivacyPolicy = () => {
    // navigation.navigate("PrivacyPolicyScreen");
  };

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Delete account action clicked.");
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            // Clear user session or token
            try {
              await AsyncStorage.clear(); // Clears all AsyncStorage data
              navigation.navigate("Login"); // Navigate to Login screen after sign out
            } catch (error) {
              console.error("Failed to log out:", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={28} color="#000" />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: profileImageUrl || "https://via.placeholder.com/150", // Display profile image or a placeholder
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userName}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={handleEditProfile}>
          <View style={styles.optionContent}>
            <Ionicons name="pencil-outline" size={24} color="#555" />
            <Text style={styles.optionText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handlePrivacyPolicy}>
          <View style={styles.optionContent}>
            <Ionicons name="document-text-outline" size={24} color="#555" />
            <Text style={styles.optionText}>Service and Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleDeleteAccount}>
          <View style={styles.optionContent}>
            <Ionicons name="trash-outline" size={24} color="#555" />
            <Text style={styles.optionText}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleSignOut}>
          <View style={styles.optionContent}>
            <Ionicons name="log-out-outline" size={24} color="#555" />
            <Text style={styles.optionText}>Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
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
  backButton: {
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default SettingsScreen;
