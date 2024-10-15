import React, { useRef } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native"; // Import NativeSyntheticEvent and NativeScrollEvent

const BottomNav = () => {
  const translateY = useRef(new Animated.Value(0)).current;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Type for 'e'
    const yOffset = e.nativeEvent.contentOffset.y;
    if (yOffset > 0) {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity style={styles.navItem}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text>Message</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text>Learn</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text>Profile</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BottomNav;
