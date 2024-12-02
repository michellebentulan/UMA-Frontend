import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { RootStackParamList } from "../../navigation/type";
import MapView, { Marker } from "react-native-maps";

type ListingDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ListingDetailsScreen"
>;

const ListingDetailsScreen: React.FC<ListingDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { listingId } = route.params;
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchListingDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://192.168.137.146:3000/livestock-listings/${listingId}`
        );
        console.log("Listing response:", response.data); // Log the response
        setListing(response.data);

        // Fetch location details
        const locationResponse = await axios.get(
          `http://192.168.137.146:3000/locations?town=${response.data.user.town}&barangay=${response.data.user.barangay}`
        );
        if (locationResponse.data && locationResponse.data.length > 0) {
          setLocation(locationResponse.data[0]);
        } else {
          console.error("Location not found for user");
        }
      } catch (error) {
        console.error("Failed to fetch listing or location details:", error);
        Alert.alert(
          "Error",
          "Unable to fetch listing details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetails();
  }, [listingId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Listing not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={RFValue(24)} color="black" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView>
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Image
            source={{
              uri: `http://192.168.137.146:3000/uploads/profile-images/${listing.user.profile_image}`,
            }}
            style={styles.userImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {listing.user.first_name} {listing.user.last_name}
            </Text>
            <Text style={styles.postDate}>
              {new Date(listing.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Livestock Images with Swipe Functionality and Paging Dots */}
        <View>
          <FlatList
            data={listing.images}
            keyExtractor={(item: string, index: number) => `${item}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }: { item: string }) => (
              <Image
                source={{
                  uri: item.startsWith("http")
                    ? item
                    : `http://192.168.137.146:3000/${item}`,
                }}
                style={styles.listingImage}
                onError={() =>
                  console.error(
                    "Failed to load listing image:",
                    `http://192.168.137.146:3000/${item}`
                  )
                }
              />
            )}
          />
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {listing.images.map((_: string, index: number) => {
              const inputRange = [
                (index - 1) * RFValue(350),
                index * RFValue(350),
                (index + 1) * RFValue(350),
              ];
              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={index}
                  style={[styles.dot, { opacity: dotOpacity }]}
                />
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionHeader}>Description</Text>
          <Text style={styles.descriptionText}>{listing.description}</Text>
        </View>

        {/* Livestock Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.price}>
              PHP {listing.price.toLocaleString()}{" "}
              {listing.negotiable && (
                <Text style={styles.negotiableText}>Negotiable</Text>
              )}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Livestock Type:</Text>
            <Text style={styles.detailValue}>{listing.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{listing.quantity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight:</Text>
            <Text style={styles.detailValue}>{listing.weight_per_kg} kg</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Listed at:</Text>
            <Text style={styles.location}>
              {listing.user.town}, {listing.user.barangay}
            </Text>
          </View>
        </View>

        {/* Map Section */}
        {location ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(location.latitude),
                  longitude: parseFloat(location.longitude),
                }}
                title={`${listing.user.town}, ${listing.user.barangay}`}
              />
            </MapView>
          </View>
        ) : (
          <View style={styles.mapFallback}>
            <Text style={styles.loadingText}>Location not available.</Text>
          </View>
        )}

        {/* Message Button */}
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => {
            // Handle message button press, create a new conversation
          }}
        >
          <Text style={styles.messageButtonText}>MESSAGE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListingDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  mapFallback: {
    height: RFValue(100),
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  userImage: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(25),
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: RFValue(16),
    fontFamily: "Montserrat_400Regular",
    color: "#333",
  },
  postDate: {
    fontSize: RFValue(12),
    fontFamily: "Montserrat_400Regular",
    color: "gray",
  },
  listingImage: {
    width: RFValue(315), // Set a fixed width
    height: RFValue(210),
    borderRadius: 10,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: RFValue(14),
    fontFamily: "Montserrat_400Regular",
    textAlign: "center",
    color: "#888",
  },
  descriptionContainer: {
    paddingVertical: 16,
  },
  descriptionHeader: {
    fontSize: RFValue(15),
    fontFamily: "Montserrat_400Regular",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: RFValue(13),
    fontFamily: "Montserrat_400Regular",
    color: "#333",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: RFValue(14),
    fontFamily: "Montserrat_400Regular",
  },
  price: {
    fontSize: RFValue(18),
    color: "#c04b37",
    fontFamily: "Montserrat_400Regular",
  },
  negotiableText: {
    fontSize: RFValue(13),
    color: "#c04b37",
    fontStyle: "italic",
    fontFamily: "Montserrat_400Regular",
  },
  location: {
    fontSize: RFValue(14),
    color: "#666",
    fontFamily: "Montserrat_400Regular",
  },
  mapContainer: {
    height: RFValue(170),
    marginVertical: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  messageButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 30,
    fontSize: RFValue(15),
    fontFamily: "Montserrat_400Regular",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: RFValue(15),
    fontFamily: "Montserrat_400Regular",
  },
  loadingText: {
    textAlign: "center",
    fontSize: RFValue(16),
    marginTop: 50,
    fontFamily: "Montserrat_400Regular",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    marginHorizontal: 3,
  },
});
