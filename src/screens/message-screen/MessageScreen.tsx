import React, { useState, useEffect, useRef } from "react";
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket, {
  initializeSocket,
  disconnectSocket,
} from "../../utils/socketService";

// Define the Message type
type Message = {
  id: number;
  name: string;
  message: string;
  time: string;
  image: string;
  phone: string;
  isUnread: boolean;
};

const MessageScreen = ({ bottomNavOpacity, bottomNavTranslateY }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const sessionToken = await AsyncStorage.getItem("sessionToken");

        if (!userId || !sessionToken) {
          throw new Error("User ID or Session Token not found");
        }

        console.log("Session Token used for authorization:", sessionToken);

        await initializeSocket(); // Initialize the socket

        const response = await axios.get(
          "http://192.168.58.149:3000/conversations",
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`, // Use the session token obtained from login
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleScroll = ({ nativeEvent }: any) => {
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
        ]).start();
      }
    }

    lastScrollY.current = currentOffset;
  };

  // Filter messages based on search text
  const filteredMessages = messages.filter((message) =>
    message.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() =>
        navigation.navigate("ChatScreen", {
          user: {
            id: item.id,
            name: item.name,
            image: item.image,
            phone: item.phone,
          },
          conversationId: item.id, // Pass `id` as number
        })
      }
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
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Message"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessageItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Lonely />
            <Text style={styles.emptyText}>It's lonely in here...</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
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
  },
  messageList: {
    flex: 1,
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
  metaContainer: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  unreadBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: -40,
    fontSize: 18,
    color: "#888",
  },
});

export default MessageScreen;
