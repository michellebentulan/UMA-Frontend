import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import Lonely from "../../../assets/svg-images/lonely.svg";

// Define the Message type
type Message = {
  id: string;
  name: string;
  message: string;
  time: string;
  image: string;
  phone: string;
  isUnread: boolean;
};

// Sample messages data
const messages: Message[] = [
  {
    id: "1",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "2",
    name: "Mae Fatima Aladad",
    message: "Thank you!",
    time: "15m",
    image: "https://example.com/image1.jpg",
    phone: "09100056575",
    isUnread: true,
  },
  {
    id: "3",
    name: "Nico Bentulan",
    message: "Available pa ang baka?",
    time: "2h",
    image: "https://example.com/image3.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "4",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: false,
  },
  {
    id: "5",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: false,
  },
  {
    id: "6",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: false,
  },
  {
    id: "7",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "8",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "9",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "10",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "11",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: false,
  },
  {
    id: "12",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: false,
  },
  {
    id: "13",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "14",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
  {
    id: "15",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
    isUnread: true,
  },
];

// Sample messages data (set to empty array for testing)
// const messages: Message[] = [];

const MessageScreen = ({ bottomNavOpacity, bottomNavTranslateY }: any) => {
  const [searchText, setSearchText] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Correctly typed useNavigation
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const handleScroll = ({ nativeEvent }: any) => {
    const currentOffset = nativeEvent.contentOffset.y;
    const isScrollingDown = currentOffset > lastScrollY.current;

    if (Math.abs(currentOffset - lastScrollY.current) > 10) {
      if (isScrollingDown) {
        // Hide bottom navigation
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
        ]).start();
      } else {
        // Show bottom navigation
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
        ]).start();
      }
    }

    lastScrollY.current = currentOffset;
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.messageItem,
        // item.isUnread && styles.unreadMessageItem,
      ]}
      onPress={() => navigation.navigate("ChatScreen", { user: item })} // Pass the user to ChatScreen
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Check Messages</Text> */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Message"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Lonely />
            <Text style={styles.emptyText}>It's lonely in here...</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1 }} // Ensures FlatList can scroll even with less content
        style={styles.messageList}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 1,
  },
  messageList: {
    flex: 1, // Ensures FlatList takes up remaining space
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    borderRadius: 14,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#888",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: -40,
    fontSize: 18,
    color: "#888",
    fontFamily: "Montserrat_400Regular",
  },
});

export default MessageScreen;
