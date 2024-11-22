import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

interface LivestockCardProps {
  userImage: string; // URL of the user's profile image
  userName: string;
  postDate: string;
  description: string;
  livestockType: string;
  preferredPrice: string;
  quantity: number;
  onMessagePress: () => void;
  postOwnerId: string; // ID of the user who created the post
  currentUserId: string; // ID of the logged-in user
}

const LivestockCard: React.FC<LivestockCardProps> = ({
  userImage,
  userName,
  postDate,
  description,
  livestockType,
  preferredPrice,
  quantity,
  onMessagePress,
  postOwnerId,
  currentUserId,
}) => {
  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

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

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Livestock Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Livestock Type:</Text>
          <Text style={styles.detailValue}>
            {capitalizeFirstLetter(livestockType)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preferred Price:</Text>
          <Text style={[styles.detailValue, styles.price]}>
            PHP {preferredPrice}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>{quantity}</Text>
        </View>
      </View>

      {/* Message Button - Only show if the current user is not the post owner */}
      {currentUserId !== postOwnerId && (
        <TouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LivestockCard;

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
    marginHorizontal: 10, // Add consistent horizontal margin
    width: "95%", // Ensure cards are uniformly sized within the container
    alignSelf: "center", // Center the card
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
  description: {
    fontSize: RFValue(13),
    color: "#333",
    marginBottom: 18,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 2,
    borderColor: "#000000", // Light gray for subtle border
    borderWidth: 0.2,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: RFValue(12),
    color: "gray",
  },
  detailValue: {
    fontSize: RFValue(12),
    fontFamily: "Montserrat_400Regular",
    color: "#333",
  },
  price: {
    color: "red",
  },
  messageButton: {
    backgroundColor: "#4a4a4a",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontFamily: "Montserrat_400Regular",
  },
});
