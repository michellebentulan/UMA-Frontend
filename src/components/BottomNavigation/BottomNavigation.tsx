import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Add icons from a library like React Native Vector Icons

interface BottomNavigationProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  bottomNavOpacity: Animated.Value;
  bottomNavTranslateY: Animated.Value;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeScreen,
  setActiveScreen,
  bottomNavOpacity,
  bottomNavTranslateY,
}) => {
  return (
    <Animated.View
      style={[
        styles.bottomNav,
        {
          opacity: bottomNavOpacity,
          transform: [{ translateY: bottomNavTranslateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveScreen("Home")}
      >
        <Ionicons
          name={activeScreen === "Home" ? "home" : "home-outline"}
          size={24}
          color="#000"
        />
        <Text style={styles.navText}>Home</Text>
        {activeScreen === "Home" && <View style={styles.redDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveScreen("Message")}
      >
        <Ionicons
          name={
            activeScreen === "Message" ? "chatbubbles" : "chatbubbles-outline"
          }
          size={24}
          color="#000"
        />
        <Text style={styles.navText}>Message</Text>
        {activeScreen === "Message" && <View style={styles.redDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveScreen("Learn")}
      >
        <Ionicons
          name={activeScreen === "Learn" ? "book" : "book-outline"}
          size={24}
          color="#000"
        />
        <Text style={styles.navText}>Learn</Text>
        {activeScreen === "Learn" && <View style={styles.redDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveScreen("Profile")}
      >
        <Ionicons
          name={activeScreen === "Profile" ? "person" : "person-outline"}
          size={24}
          color="#000"
        />
        <Text style={styles.navText}>Profile</Text>
        {activeScreen === "Profile" && <View style={styles.redDot} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontFamily: "Montserrat_400Regular",
  },
  redDot: {
    width: 6,
    height: 6,
    backgroundColor: "red",
    borderRadius: 3,
    marginTop: 2,
  },
});

export default BottomNavigation;
