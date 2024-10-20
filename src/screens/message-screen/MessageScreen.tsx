import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";

// Define the Message type
type Message = {
  id: string;
  name: string;
  message: string;
  time: string;
  image: string;
  phone: string;
};

// Sample messages data
const messages: Message[] = [
  {
    id: "1",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
  },
  {
    id: "2",
    name: "Mae Fatima Aladad",
    message: "Thank you!",
    time: "15m",
    image: "https://example.com/image1.jpg",
    phone: "09100056575",
  },
  {
    id: "3",
    name: "Nico Bentulan",
    message: "Available pa ang baka?",
    time: "2h",
    image: "https://example.com/image3.jpg",
    phone: "+6369634491842",
  },
  {
    id: "4",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
  },
  {
    id: "5",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
  },
  {
    id: "6",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
  },
  {
    id: "7",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
  },
  {
    id: "8",
    name: "Mark Ian Labuca",
    message: "Yes. The price is still negotiable...",
    time: "1h",
    image: "https://example.com/image1.jpg",
    phone: "+6369634491842",
  },
];

const MessageScreen = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Correctly typed useNavigation

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.messageItem}
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
      <Text style={styles.header}>Check Messages</Text>
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
            <Image
              source={require("../../../assets/images/profile.jpg")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>It's lonely in here...</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
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
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: "#888",
  },
});

export default MessageScreen;
