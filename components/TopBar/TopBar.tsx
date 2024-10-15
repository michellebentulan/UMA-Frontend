import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import UmaLogo from "../../assets/svg-images/3.svg"; // Ensure the path is correct

interface TopBarProps {
  profileImage: string;
}

const TopBar: React.FC<TopBarProps> = ({ profileImage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <UmaLogo width={80} height={40} />
        <Text style={styles.subHeading}>Explore the Marketplace</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Ionicons name="notifications-outline" size={24} color="#3C3C43" />
        </TouchableOpacity>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subHeading: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "400",
    color: "#8E8E93",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#3C3C43",
  },
});

export default TopBar;
