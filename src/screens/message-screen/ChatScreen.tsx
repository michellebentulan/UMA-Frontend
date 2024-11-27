import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Menu, MenuItem } from "react-native-material-menu";
import * as ImagePicker from "expo-image-picker";
import {
  initializeSocket,
  disconnectSocket,
  getSocket,
} from "../../utils/socketService";

type ChatScreenProps = {
  route: RouteProp<RootStackParamList, "ChatScreen">;
};

const ChatScreen = ({ route }: ChatScreenProps) => {
  const { user, conversationId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const initializeChat = async () => {
      const socket = await initializeSocket(); // Ensure socket is initialized

      if (!socket) {
        console.error("Socket connection failed.");
        return;
      }

      // Join the conversation room
      socket.emit("joinConversation", conversationId);

      // Listen for new messages
      socket.on("newMessage", (newMessage) => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [newMessage])
        );
      });

      if (!socket) {
        console.error("Socket instance not initialized.");
        return;
      }

      return () => {
        socket.emit("leaveConversation", { conversationId });
        disconnectSocket();
      };
    };

    initializeChat();
  }, [conversationId]);

  const onSend = (newMessages: IMessage[] = []) => {
    const socket = getSocket(); // Safely retrieve the socket instance
    if (!socket) {
      console.error("Socket is not connected.");
      return;
    }

    // Emit new message through Socket.io
    newMessages.forEach((message) => {
      socket.emit("sendMessage", {
        conversationId,
        ...message, // Spread message directly, which already contains the user field
      });
    });

    // Update the local message state
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleCallUser = () => {
    const phoneNumber = user.phone || "1234567890";
    Alert.alert(
      "Open Dialer",
      "You will be going to the phone app to call this number. Do you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
              Alert.alert(
                "Error",
                "Unable to open the dialer. Please try again."
              )
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      const imageMessage = {
        _id: Math.random().toString(),
        createdAt: new Date(),
        text: "",
        image: selectedImage,
        user: {
          _id: 1,
        },
      };
      const socket = getSocket(); // Safely retrieve the socket instance
      if (!socket) {
        console.error("Socket is not connected.");
        return;
      }
      // Send image message via socket
      socket.emit("sendMessage", {
        conversationId,
        ...imageMessage,
      });

      // Update local state
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [imageMessage])
      );
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        _id: Math.random().toString(),
        text: inputText,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      };
      onSend([newMessage]);
      setInputText(""); // Clear the input field
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>

        {/* User Avatar */}
        <Image source={{ uri: user.image }} style={styles.avatar} />

        {/* User Name */}
        <Text style={styles.userName}>{user.name}</Text>

        {/* Phone Icon */}
        <TouchableOpacity onPress={handleCallUser} style={styles.callStyle}>
          <Ionicons name="call-outline" size={26} color="#333" />
        </TouchableOpacity>

        {/* Menu Icon */}
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Ionicons
                name="information-circle-outline"
                size={26}
                color="#333"
              />
            </TouchableOpacity>
          }
          onRequestClose={closeMenu}
        >
          <MenuItem
            onPress={() => {
              closeMenu();
              alert("Report User");
            }}
          >
            Report
          </MenuItem>
        </Menu>
      </View>

      {/* Conditionally render the chat */}
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        renderInputToolbar={() => (
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={selectImage}>
              <Ionicons name="image-outline" size={28} color="#888" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#aaa"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSendMessage}
            >
              <Ionicons name="send-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  userName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  callStyle: {
    paddingRight: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  iconButton: {
    padding: 5,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    fontSize: 16,
    color: "#333",
  },
});
