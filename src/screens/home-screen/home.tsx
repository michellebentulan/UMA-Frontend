import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "../../components/TopBar/TopBar";
import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";
import TabButtons from "../../components/TabButtons/TabButtons";

const Home = () => {
  const [activeTab, setActiveTab] = useState("ForSale");
  const [activeScreen, setActiveScreen] = useState("Home");
  const lastScrollY = useRef(0);
  const bottomNavOpacity = useRef(new Animated.Value(1)).current;
  const bottomNavTranslateY = useRef(new Animated.Value(0)).current;
  const createListingOpacity = useRef(new Animated.Value(1)).current;
  const createListingTranslateY = useRef(new Animated.Value(0)).current;

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const currentOffset = nativeEvent.contentOffset.y;
    const isScrollingDown = currentOffset > lastScrollY.current;

    if (Math.abs(currentOffset - lastScrollY.current) > 10) {
      if (isScrollingDown) {
        // Animate bottom nav hiding (slide down and fade out)
        Animated.parallel([
          Animated.timing(bottomNavOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bottomNavTranslateY, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(createListingOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(createListingTranslateY, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Animate bottom nav showing (slide up and fade in)
        Animated.parallel([
          Animated.timing(bottomNavOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bottomNavTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(createListingOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(createListingTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }

    lastScrollY.current = currentOffset;
  };

  const handleNavigation = (screen: string) => {
    setActiveScreen(screen);
  };

  const generateDummyContent = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Text key={i} style={styles.dummyText}>
        {activeTab === "ForSale"
          ? `For Sale Item ${i + 1}`
          : `Looking For Item ${i + 1}`}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Search */}
      <View style={styles.topSection}>
        <TopBar isOnline={true} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 70}
        >
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Livestock"
              />
              <Ionicons
                name="search"
                size={20}
                color="#888"
                style={styles.searchIcon}
              />
              <Ionicons
                name="options-outline"
                size={20}
                color="#888"
                style={styles.filterIcon}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollableContent}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Better scroll performance
      >
        {/* Generate and display dummy content based on active tab */}
        {generateDummyContent(50)}
      </ScrollView>

      <Animated.View
        style={[
          styles.createListingButton,
          {
            opacity: createListingOpacity,
            transform: [{ translateY: createListingTranslateY }],
          },
        ]}
      >
        <TouchableOpacity>
          <Ionicons name="add-circle" size={50} color="#000" />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen={activeScreen}
        setActiveScreen={handleNavigation}
        bottomNavOpacity={bottomNavOpacity}
        bottomNavTranslateY={bottomNavTranslateY}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    paddingTop: 18,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  searchSection: {
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
  searchIcon: {
    marginLeft: 10,
  },
  filterIcon: {
    marginLeft: 10,
  },
  scrollableContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80, // Added padding to avoid overlapping with BottomNavigation
  },
  createListingButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  dummyText: {
    fontSize: 18,
    color: "#8E8E8E",
    marginVertical: 10,
  },
});

export default Home;
