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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ChatScreenProps = {
  route: RouteProp<RootStackParamList, "ChatScreen">;
};

const ChatScreen = ({ route }: ChatScreenProps) => {
  const { user, conversationId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(parseInt(id));
      }
    };

    fetchUserId();

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
        // Add required fields for the GiftedChat component
        const formattedMessage = {
          _id: newMessage._id || Math.random().toString(), // Ensure each message has a unique _id
          text: newMessage.content || "",
          createdAt: new Date(newMessage.timestamp || new Date()),
          user: {
            _id: newMessage.senderId,
            name: newMessage.sender?.name || "User",
          },
          image: newMessage.imageUrl || null,
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [formattedMessage])
        );
      });

      try {
        const sessionToken = await AsyncStorage.getItem("sessionToken");
        if (!sessionToken) {
          throw new Error("Session token not found");
        }

        const response = await axios.get(
          `http://192.168.74.149:3000/messages/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        const fetchedMessages = response.data.map((message: any) => ({
          _id: message.id,
          text: message.content,
          createdAt: new Date(message.timestamp),
          user: {
            _id: message.sender.id,
            name: `${message.sender.first_name} ${message.sender.last_name}`,
          },
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    initializeChat();

    // Cleanup socket on unmount
    // return () => {
    //   const socket = getSocket();
    //   if (socket) {
    //     socket.emit("leaveConversation", { conversationId });
    //     disconnectSocket();
    //   }
    // };
  }, [conversationId]);

  const onSend = async (newMessages: IMessage[] = []) => {
    const socket = getSocket(); // Safely retrieve the socket instance
    if (!socket) {
      console.error("Socket is not connected.");
      return;
    }

    try {
      // Retrieve the logged-in user's ID
      if (!userId) {
        console.error("User ID not found. Cannot send message.");
        return;
      }

      // Emit new message through Socket.io for each message in the newMessages array
      newMessages.forEach((message) => {
        const formattedMessage = {
          conversationId,
          content: message.text,
          senderId: userId, // Use the logged-in user's ID
          imageUrl: message.image || null, // Include image if there is one
        };

        // Emit to socket server
        socket.emit("sendMessage", formattedMessage);
      });
    } catch (error) {
      console.error("Error while sending message:", error);
    }
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

  // const selectImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     const selectedImage = result.assets[0].uri;
  //     const imageMessage = {
  //       _id: Math.random().toString(),
  //       createdAt: new Date(),
  //       text: "",
  //       image: selectedImage,
  //       user: {
  //         _id: 1,
  //       },
  //     };
  //     const socket = getSocket(); // Safely retrieve the socket instance
  //     if (!socket) {
  //       console.error("Socket is not connected.");
  //       return;
  //     }
  //     // Send image message via socket
  //     socket.emit("sendMessage", {
  //       conversationId,
  //       ...imageMessage,
  //     });

  //     // Update local state
  //     setMessages((previousMessages) =>
  //       GiftedChat.append(previousMessages, [imageMessage])
  //     );
  //   }
  // };

  // const selectImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     const selectedImage = result.assets[0].uri;
  //     const socket = getSocket(); // Safely retrieve the socket instance
  //     if (!socket) {
  //       console.error("Socket is not connected.");
  //       return;
  //     }

  //     const newImageMessage = {
  //       _id: Math.random().toString(),
  //       createdAt: new Date(),
  //       text: "",
  //       imageUrl: selectedImage, // Correctly include the image URL here
  //       user: {
  //         _id: userId || -1,
  //       },
  //     };

  //     // Send image message via socket
  //     socket.emit("sendMessage", {
  //       conversationId,
  //       ...newImageMessage,
  //     });

  //     // Update local state
  //     setMessages((previousMessages) =>
  //       GiftedChat.append(previousMessages, [newImageMessage])
  //     );
  //   }
  // };

  // const selectImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     const selectedImage = result.assets[0].uri;

  //     try {
  //       const formData = new FormData();
  //       formData.append("file", {
  //         uri: selectedImage,
  //         name: "image.jpg", // Customize the file name
  //         type: "image/jpeg",
  //       } as any);

  //       const serverAddress = "http://192.168.74.149:3000"; // Replace with your server address
  //       const response = await axios.post(
  //         `${serverAddress}/messages/upload`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       const imageUrl = response.data.url;

  //       // Create a new image message with the URL returned from the server
  //       const newImageMessage = {
  //         _id: Math.random().toString(),
  //         createdAt: new Date(),
  //         text: "",
  //         image: imageUrl,
  //         user: {
  //           _id: userId || -1,
  //         },
  //       };

  //       const socket = getSocket(); // Safely retrieve the socket instance
  //       if (!socket) {
  //         console.error("Socket is not connected.");
  //         return;
  //       }

  //       // Send image message via socket
  //       socket.emit("sendMessage", {
  //         conversationId,
  //         ...newImageMessage,
  //       });

  //       // Update local state
  //       setMessages((previousMessages) =>
  //         GiftedChat.append(previousMessages, [newImageMessage])
  //       );
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //     }
  //   }
  // };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;

      try {
        // Retrieve session token
        const sessionToken = await AsyncStorage.getItem("sessionToken");
        if (!sessionToken) {
          console.error("Session token not found");
          return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("file", {
          uri: selectedImage,
          name: "image.jpg", // Customize the file name
          type: "image/jpeg",
        } as any);

        const serverAddress = "http://192.168.74.149:3000"; // Replace with your server address
        const response = await axios.post(
          `${serverAddress}/messages/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${sessionToken}`, // Add the authorization header
            },
          }
        );

        const imageUrl = response.data.url;

        // Create a new image message with the URL returned from the server
        const newImageMessage = {
          _id: Math.random().toString(),
          createdAt: new Date(),
          text: "",
          imageUrl: imageUrl, // Make sure this matches your backend's property name
          user: {
            _id: userId || -1,
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
          ...newImageMessage,
        });

        // **IMPORTANT**: Remove the manual state update here to prevent duplicates.
      } catch (error) {
        console.error("Error uploading image:", error);
      }
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
      {userId !== null && (
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={{
            _id: userId || -1, // Use fallback value
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
      )}
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
