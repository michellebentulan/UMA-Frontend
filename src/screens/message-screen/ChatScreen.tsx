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
import { Ionicons } from "@expo/vector-icons"; // Use Ionicons from Expo
import { Menu, MenuItem } from "react-native-material-menu"; // Optional for showing menu
import * as ImagePicker from "expo-image-picker"; // For image picker

type ChatScreenProps = {
  route: RouteProp<RootStackParamList, "ChatScreen">;
};

type User = {
  id: string;
  name: string;
  image: string;
  phone: string; // Ensure phone is defined here
};

const ChatScreen = ({ route }: ChatScreenProps) => {
  const { user } = route.params as { user: User };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [visible, setVisible] = useState(false); // For report menu
  const [inputText, setInputText] = useState(""); // Manage input text state
  const [showChat, setShowChat] = useState(true); // Control visibility of chat

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! How can I help you?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: user.name,
          avatar: user.image,
        },
      },
    ]);
  }, []);

  const onSend = (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleCallUser = () => {
    const phoneNumber = user.phone || "1234567890"; // Replace with the actual user's phone number
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

  // Function to handle image picking using Expo Image Picker
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
        image: selectedImage, // Image URI to display
        user: {
          _id: 1, // Your user ID
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [imageMessage])
      );
    }
  };

  // Handle sending text message
  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        _id: Math.random().toString(),
        text: inputText,
        createdAt: new Date(),
        user: {
          _id: 1, // Your own user id
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
          {/* <TouchableOpacity> */}
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
      {showChat && (
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={{
            _id: 1, // Your own user id
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
    marginLeft: 10, // Adjust margin for spacing
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
