import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import TopBar from "../../components/TopBar/TopBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import MessageScreen from "../message-screen/MessageScreen";
import LearnScreen from "../learn-screen/LearnScreen";
import ProfileScreen from "../profile-screen/ProfileScreen";
import { FlatList } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native"; // For navigation
import { RootStackParamList } from "../../navigation/type";
import LivestockCard from "../../components/RequestCard/RequestCard";
import SellLivestockCard from "../../components/SellLivestockCard/SellLivestockCard";

interface RequestedListing {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    profile_image: string;
  };
  type: string;
  preferred_price: number;
  quantity: number;
  description: string;
  created_at: string;
}

interface SellListing {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    profile_image: string;
    town: string; // Added town
    barangay: string; // Added barangay
  };
  type: string;
  price: number;
  negotiable: boolean;
  quantity: number;
  weight_per_kg: number;
  description: string;
  images: string[];
  created_at: string;
}

const HomeScreen1: React.FC = () => {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState("ForSale");
  const [activeScreen, setActiveScreen] = useState("Home");
  const bottomNavOpacity = useRef(new Animated.Value(1)).current;
  const bottomNavTranslateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const createListingOpacity = useRef(new Animated.Value(1)).current;
  const createListingTranslateY = useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use typed navigation
  const [requestedListings, setRequestedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sellListings, setSellListings] = useState<SellListing[]>([]); // State for sell livestock listings

  useFocusEffect(
    React.useCallback(() => {
      const checkForRefresh = async () => {
        const params = navigation
          .getState()
          .routes.find((route) => route.name === "HomeScreen1")?.params as {
          refreshRequestedListings?: boolean;
        };

        if (params?.refreshRequestedListings) {
          await fetchRequestedListings();
          await fetchSellListings();
          navigation.setParams({ refreshRequestedListings: false }); // Reset the parameter
        }
      };

      checkForRefresh();
    }, [navigation])
  );

  useEffect(() => {
    // Fetch user profile on component mount
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Retrieve userId from AsyncStorage
        if (!userId) {
          throw new Error("User ID not found");
        }
        setCurrentUserId(userId);

        const response = await axios.get(
          `http://192.168.137.146:3000/users/${userId}`
        );
        const userData = response.data;

        console.log("User profile data:", userData);

        if (userData.profile_image) {
          setProfileImageUrl(
            `http://192.168.137.146:3000/uploads/profile-images/${userData.profile_image}`
          );
        } else {
          console.warn("Profile image not found in user data");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
    fetchRequestedListings();
    fetchSellListings(); // Fetch sell listings on component mount
  }, []);

  const fetchRequestedListings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.137.146:3000/requested-listings"
      );

      // Sort posts by creation date (newest first)
      const sortedListings = response.data.sort(
        (a: RequestedListing, b: RequestedListing) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setRequestedListings(sortedListings);
    } catch (error) {
      console.error("Failed to fetch requested listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellListings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://192.168.137.146:3000/livestock-listings"
      );

      const sortedSellListings = response.data.sort(
        (a: SellListing, b: SellListing) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSellListings(sortedSellListings);
    } catch (error) {
      console.error("Failed to fetch sell livestock listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchRequestedListings();
    await fetchSellListings();
    setIsRefreshing(false);
  };

  const handlePressMessage = async (
    postOwnerId: number,
    userName: string,
    userImage: string
  ) => {
    try {
      // Retrieve the current user's ID from AsyncStorage
      const currentUserId = await AsyncStorage.getItem("userId");
      if (!currentUserId) {
        throw new Error("User ID not found");
      }

      // Convert currentUserId to a number
      const currentUserIdNum = parseInt(currentUserId);

      // Call backend to create or fetch the conversation
      const response = await axios.post(
        "http://192.168.137.146:3000/conversations",
        {
          userIds: [currentUserIdNum, postOwnerId],
        }
      );

      const { id: conversationId } = response.data;

      // Navigate to the ChatScreen
      navigation.navigate("ChatScreen", {
        conversationId,
        user: {
          id: postOwnerId,
          name: userName,
          image: userImage,
        },
      });
    } catch (error) {
      console.error("Error creating or fetching conversation:", error);
      Alert.alert("Error", "Failed to start a conversation. Please try again.");
    }
  };

  const renderRequestCard = ({ item }: { item: RequestedListing }) => {
    if (!item.user) {
      console.warn(
        `Missing user information for requested listing ID: ${item.id}`
      );
      return null;
    }

    return (
      <LivestockCard
        userImage={
          item.user?.profile_image
            ? `http://192.168.137.146:3000/uploads/profile-images/${item.user.profile_image}`
            : "http://192.168.137.146:3000/uploads/profile-images/default.png" // Fallback to a default image
        }
        userName={`${item.user.first_name} ${item.user.last_name}`}
        postDate={new Date(item.created_at).toLocaleDateString()}
        description={item.description}
        livestockType={item.type}
        preferredPrice={item.preferred_price.toLocaleString()}
        quantity={item.quantity}
        postOwnerId={item.user.id.toString()} // Pass the post owner's ID
        currentUserId={currentUserId || ""} // Pass the logged-in user's ID
        onMessagePress={() =>
          handlePressMessage(
            item.user.id,
            `${item.user.first_name} ${item.user.last_name}`,
            `http://192.168.137.146:3000/uploads/profile-images/${item.user.profile_image}`
          )
        }
      />
    );
  };

  const validSellListings = sellListings.filter((item) => item.user !== null);

  const renderSellLivestockCard = ({ item }: { item: SellListing }) => {
    if (!item.user) {
      console.warn(`Missing user information for sell listing ID: ${item.id}`);
      return null;
    }

    const livestockImageUrls =
      item.images?.length > 0
        ? item.images.map((image) =>
            image.includes("http")
              ? image
              : `http://192.168.137.146:3000/${image.replace(/\\/g, "/")}`
          )
        : ["http://192.168.137.146:3000/uploads/livestock-images/default.png"]; // Fallback to a default image if none provided

    return (
      <SellLivestockCard
        userImage={
          item.user?.profile_image
            ? `http://192.168.137.146:3000/uploads/profile-images/${item.user.profile_image}`
            : "http://192.168.137.146:3000/uploads/profile-images/default.png" // Fallback to a default image
        }
        userName={`${item.user.first_name} ${item.user.last_name}`}
        postDate={new Date(item.created_at).toLocaleDateString()}
        livestockImages={livestockImageUrls}
        livestockType={item.type}
        price={item.price.toLocaleString()}
        negotiable={item.negotiable}
        description={item.description}
        location={`${item.user.town || "N/A"}, ${item.user.barangay || "N/A"}`} // Updated location
        postOwnerId={item.user.id.toString()}
        currentUserId={currentUserId || ""}
        onMessagePress={() =>
          handlePressMessage(
            item.user.id,
            `${item.user.first_name} ${item.user.last_name}`,
            `http://192.168.137.146:3000/uploads/profile-images/${item.user.profile_image}`
          )
        }
        onDetailsPress={() =>
          navigation.navigate("ListingDetailsScreen", {
            listingId: item.id,
          })
        }
      />
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      // Reset animations for bottom navigation and create listing button
      Animated.timing(bottomNavOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(bottomNavTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Handle back button behavior to prevent going back to profile screen
      const onBackPress = () => {
        Alert.alert("Exit App", "Do you want to exit the app?", [
          { text: "Cancel", style: "cancel" },
          {
            // text: "Yes", onPress: () => BackHandler.exitApp()

            text: "Yes",
            onPress: async () => {
              try {
                const sessionToken = await AsyncStorage.getItem("sessionToken");

                if (sessionToken) {
                  // Make API call to set the session to expire in 2 minutes
                  await axios.put(
                    "http://192.168.137.146:3000/users/expire-session",
                    {
                      sessionToken,
                    }
                  );
                }
                BackHandler.exitApp();
              } catch (error) {
                console.error("Error expiring session:", error);
              }
            },
          },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Cleanup function to remove event listener
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

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
              <SearchBar placeholder="Search Livestock" />
            </View>

            {/* Tab Buttons */}
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
                  <Text style={styles.LookForText}>Looking for</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Content Area */}
            <View style={styles.scrollableContent}>
              {activeTab === "LookingFor" ? (
                <FlatList
                  data={requestedListings}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderRequestCard}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  contentContainerStyle={styles.requestCardContainer}
                  ListEmptyComponent={() =>
                    isLoading ? (
                      <Text style={styles.emptyMessage}>Loading...</Text>
                    ) : (
                      <Text style={styles.emptyMessage}>
                        No listings available.
                      </Text>
                    )
                  }
                  onScroll={({ nativeEvent }) => {
                    const currentOffset = nativeEvent.contentOffset.y;
                    const isScrollingDown = currentOffset > lastScrollY.current;

                    if (Math.abs(currentOffset - lastScrollY.current) > 10) {
                      if (isScrollingDown) {
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
                />
              ) : (
                <FlatList
                  data={validSellListings}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderSellLivestockCard}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  contentContainerStyle={styles.requestCardContainer}
                  ListEmptyComponent={() =>
                    isLoading ? (
                      <Text style={styles.emptyMessage}>Loading...</Text>
                    ) : (
                      <Text style={styles.emptyMessage}>
                        No listings available.
                      </Text>
                    )
                  }
                  onScroll={({ nativeEvent }) => {
                    const currentOffset = nativeEvent.contentOffset.y;
                    const isScrollingDown = currentOffset > lastScrollY.current;

                    if (Math.abs(currentOffset - lastScrollY.current) > 10) {
                      if (isScrollingDown) {
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
                />
              )}
            </View>

            {/* Conditional Menu Rendering */}
            {menuVisible && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("SellLivestock"); // Navigate to Sell Livestock screen
                  }}
                >
                  <Text style={styles.menuText}>Sell Livestock</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("BuyLivestock"); // Navigate to Buy Livestock screen
                  }}
                >
                  <Text style={styles.menuText}>Look for Livestock</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        );

      case "Message":
        return (
          <MessageScreen
            bottomNavOpacity={bottomNavOpacity}
            bottomNavTranslateY={bottomNavTranslateY}
            createListingOpacity={createListingOpacity}
            createListingTranslateY={createListingTranslateY}
          />
        );

      case "Learn":
        return <LearnScreen />;

      // case "Profile":
      //   // Profile screen content
      //   return <ProfileScreen />;

      case "Profile":
        return (
          <>
            <ProfileScreen />

            {menuVisible && (
              <View style={styles.menu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("SellLivestock");
                  }}
                >
                  <Text style={styles.menuText}>Sell Livestock</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("BuyLivestock");
                  }}
                >
                  <Text style={styles.menuText}>Look for Livestock</Text>
                </TouchableOpacity>
              </View>
            )}

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
                  setMenuVisible((prev) => !prev);
                }}
              >
                <Ionicons name="add-circle" size={50} color="#000" />
              </TouchableOpacity>
            </Animated.View>
          </>
        );

      default:
        return <Text>No Screen Selected</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        {activeScreen !== "Profile" && (
          <View style={styles.topBar2}>
            <TopBar
              isOnline={true}
              onNotificationsPress={() => console.log("Notifications pressed")}
              profileImageUrl={profileImageUrl}
            />
          </View>
        )}

        {renderContent()}

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
        {/* </View>// */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar2: {
    height: 84,
    // marginBottom: 30,
    backgroundColor: "#ffffff",
    // borderColor: "red",
    // borderWidth: 1,
  },
  searchBar: {
    height: 65,
    margin: 8,
    borderRadius: 15,
    paddingHorizontal: 5,
    // backgroundColor: "#000000",
    backgroundColor: "#ffffff",
    // Add additional styles for the search bar
  },
  searchSection: {
    // height: 60,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  tabButtons: {
    height: 43,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    // Add additional styles for tab buttons
  },
  scrollableContent: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginVertical: 0,
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
  LookForText: {
    color: "#808080",
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
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  requestCardContainer: {
    flexGrow: 1, // Ensures scrolling works
    justifyContent: "flex-start", // Aligns items to the top
    alignItems: "stretch", // Makes the cards take full width
    paddingHorizontal: 5, // Add consistent horizontal padding for spacing
  },
});

export default HomeScreen1;
