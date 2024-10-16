import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  TextInput,
} from "react-native";
import TopBar from "../../components/TopBar/TopBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import TabButtons from "../../components/TabButtons/TabButtons";
import { Ionicons } from "@expo/vector-icons";
import MessageScreen from "../message-screen/MessageScreen";

const HomeScreen1: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ForSale");
  const [activeScreen, setActiveScreen] = useState("Home");
  const bottomNavOpacity = useRef(new Animated.Value(1)).current;
  const bottomNavTranslateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const createListingOpacity = useRef(new Animated.Value(1)).current;
  const createListingTranslateY = useRef(new Animated.Value(0)).current;

  const [menuVisible, setMenuVisible] = useState(false);

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
            {/* Search Bar Area */}
            <View style={styles.searchBar}>
              {/* Search input will go here */}
              <SearchBar placeholder="Search Livestock" />
            </View>

            <View style={styles.tabButtons}>
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
            </View>

            <View style={styles.scrollableContent}>
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
                {generateDummyContent(30)}
              </ScrollView>
            </View>

            {menuVisible && ( // Conditional rendering for the menu
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    console.log("Sell Livestock");
                  }}
                >
                  <Text style={styles.menuText}>Sell Livestock</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    console.log("Look for Livestock");
                  }}
                >
                  <Text style={styles.menuText}>Look for Livestock</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        );

      case "Message":
        return <MessageScreen />;

      case "Learn":
        return <MessageScreen />;

      default:
        return <Text>No Screen Selected</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.topBar}> */}
      <TopBar isOnline={true} />
      {/* </View> */}

      {renderContent()}

      {/* Search Bar Area */}
      {/* <View style={styles.searchBar}> */}
      {/* Search input will go here */}
      {/* <SearchBar placeholder="Search Livestock" />
      </View> */}

      {/* Tab Buttons Area */}
      {/* <View style={styles.tabButtons}>
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
      </View> */}

      {/* Scrollable Content Area */}
      {/* <View style={styles.scrollableContent}>
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
          {generateDummyContent(30)}
        </ScrollView>
      </View> */}

      {/* {activeScreen === "Home" && ( // Only show the button when on the Home screen
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
      )} */}

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
          <TouchableOpacity
            onPress={() => {
              setMenuVisible((prev) => !prev); // Toggle the menu visibility
            }}
          >
            <Ionicons name="add-circle" size={50} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Bottom Navigation Area */}
      <View style={styles.bottomNavigation}>
        {/* Bottom navigation items will go here */}
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
                activeScreen === "Message"
                  ? "chatbubbles"
                  : "chatbubbles-outline"
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 90,
    // marginBottom: 30,
    backgroundColor: "#f8f9fa",
    // Add additional styles for the top bar
  },
  searchBar: {
    height: 60,
    margin: 15,
    borderRadius: 20,
    backgroundColor: "#000000",
    // backgroundColor: "#e9ecef",
    // Add additional styles for the search bar
  },
  tabButtons: {
    height: 70,
    backgroundColor: "#dee2e6",
    // Add additional styles for tab buttons
  },
  scrollableContent: {
    flex: 1,
    backgroundColor: "#f1f3f5",
    // Add additional styles for scrollable content
  },
  bottomNavigation: {
    height: 60,
    backgroundColor: "#ced4da",
    // Add additional styles for the bottom navigation
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dummyText: {
    padding: 20,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    width: "100%",
    textAlign: "center",
  },
  createListingButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  redDot: {
    width: 6,
    height: 6,
    backgroundColor: "red",
    borderRadius: 3,
    marginTop: 2,
  },
  menu: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
});

export default HomeScreen1;
