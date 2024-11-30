import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

interface SellLivestockCardProps {
  userImage: string;
  userName: string;
  postDate: string;
  livestockImages: string[]; // Added a prop to pass the livestock image
  livestockType: string;
  price: string;
  negotiable: boolean;
  description: string;
  location: string; // Town and barangay
  onMessagePress: () => void;
  onDetailsPress: () => void;
  postOwnerId: string; // ID of the user who created the post
  currentUserId: string; // ID of the logged-in user
}

const SellLivestockCard: React.FC<SellLivestockCardProps> = ({
  userImage,
  userName,
  postDate,
  livestockImages,
  livestockType,
  price,
  negotiable,
  description,
  location,
  onMessagePress,
  onDetailsPress,
  postOwnerId,
  currentUserId,
}) => {
  console.log("Livestock Images URL Array:", livestockImages);

  return (
    <View style={styles.cardContainer}>
      {/* User Info */}
      <View style={styles.userContainer}>
        <Image source={{ uri: userImage }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.postDate}>{postDate}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={RFValue(18)} color="gray" />
      </View>

      {/* Livestock Images with Swipe Functionality */}
      <FlatList
        data={livestockImages}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => {
          console.log(`Loading image from: ${item}`); // Log each URL
          return (
            <Image
              source={{ uri: item }}
              style={styles.livestockImage}
              onLoad={() => console.log(`Image loaded successfully: ${item}`)}
              onError={({ nativeEvent }) =>
                console.error(
                  `Image load error for ${item}:`,
                  nativeEvent.error
                )
              }
            />
          );
        }}
      />

      {/* Price and Description */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>PHP {price}</Text>
        {negotiable && <Text style={styles.negotiableText}>Negotiable</Text>}
      </View>
      <Text style={styles.description}>{description}</Text>

      {/* Location */}
      <Text style={styles.location}>{location}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Only show the Message button if the current user is not the post owner */}
        {currentUserId !== postOwnerId && (
          <TouchableOpacity
            style={styles.messageButton}
            onPress={onMessagePress}
          >
            <Text style={styles.buttonText}>MESSAGE</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.detailsButton} onPress={onDetailsPress}>
          <Text style={styles.buttonText}>DETAILS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SellLivestockCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 10,
    width: "97%",
    alignSelf: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: RFValue(14),
    fontFamily: "Montserrat_400Regular",
    color: "#333",
  },
  postDate: {
    fontSize: RFValue(11),
    color: "gray",
    fontFamily: "Montserrat_400Regular",
  },
  livestockImage: {
    width: RFValue(300), // Set a fixed width
    height: RFValue(190),
    borderRadius: 8,
    marginRight: 15, // Add margin to prevent overlapping when swiping
  },

  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceText: {
    fontSize: RFValue(16),
    fontFamily: "Montserrat_700Bold",
    color: "#c04b37",
  },
  negotiableText: {
    fontSize: RFValue(12),
    color: "#c04b37",
    fontFamily: "Montserrat_400Regular",
  },
  description: {
    fontSize: RFValue(13),
    color: "#333",
    marginBottom: 8,
    paddingHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 2,
    borderColor: "#000000",
    borderWidth: 0.1,
    fontFamily: "Montserrat_400Regular",
  },
  location: {
    fontSize: RFValue(11),
    color: "gray",
    marginBottom: 10,
    fontFamily: "Montserrat_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageButton: {
    backgroundColor: "#65884E",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  detailsButton: {
    backgroundColor: "#808080",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontFamily: "Montserrat_400Regular",
  },
});
