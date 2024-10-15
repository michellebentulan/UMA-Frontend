import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SvgImage from "../../assets/svg-images/3.svg";
import MessageScreen from "../message-screen/MessageScreen";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("ForSale");
  const [isOnline, setIsOnline] = useState(true);
  const [activeScreen, setActiveScreen] = useState("Home");

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const bottomNavOpacity = useRef(new Animated.Value(1)).current;
  const bottomNavTranslateY = useRef(new Animated.Value(0)).current;

  const createListingOpacity = useRef(new Animated.Value(1)).current;
  const createListingTranslateY = useRef(new Animated.Value(0)).current;

  const generateDummyContent = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Text key={i} style={styles.dummyText}>
        {activeTab === "ForSale"
          ? `For Sale Item ${i + 1}`
          : `Looking For Item ${i + 1}`}
      </Text>
    ));
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "Home":
        return (
          <>
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.forSaleButton,
                  activeTab === "ForSale" && styles.activeButton,
                ]}
                onPress={() => setActiveTab("ForSale")}
              >
                <Text style={styles.buttonText}>For Sale</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.lookingForButton,
                  activeTab === "LookingFor" && styles.activeButton,
                ]}
                onPress={() => setActiveTab("LookingFor")}
              >
                <Text style={styles.buttonText}>Looking for</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.contentContainer}
              onScroll={({ nativeEvent }) => {
                const currentOffset = nativeEvent.contentOffset.y;
                const isScrollingDown = currentOffset > lastScrollY.current;

                if (Math.abs(currentOffset - lastScrollY.current) > 10) {
                  // Check if the scroll is significant
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
              }}
              scrollEventThrottle={16}
            >
              {generateDummyContent(5)}
            </ScrollView>
          </>
        );

      case "Message":
        return <MessageScreen />;

      default:
        return <Text>No Screen Selected</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Logo, Notification, and Profile */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <SvgImage width={145} height={145} />
          <Text style={styles.subtitle}>Explore the Marketplace</Text>
        </View>

        <Ionicons
          name="notifications-outline"
          size={30}
          color="#000"
          style={styles.notificationIcon}
        />

        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/images/profile.jpg")}
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

      {/* Conditional Content Render */}
      {renderContent()}

      {/* Bottom Navigation Bar */}
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
        </TouchableOpacity>
      </Animated.View>

      {/* Floating Create Listing Button */}
      {activeScreen === "Home" && ( // Only show the button when on the Home screen
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 5,
    margin: 3,
  },

  logoContainer: {
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: -50,
    fontFamily: "Montserrat_400Regular",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 35,
    marginRight: -15,
    marginLeft: -12,
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
  notificationIcon: {
    marginRight: -55,
  },
  profileImage: {
    width: 51,
    height: 51,
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  forSaleButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  lookingForButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#000",
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Montserrat_400Regular",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  createListingButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
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
  dummyText: {
    padding: 20,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    width: "100%",
    textAlign: "center",
  },
});

export default HomeScreen;
