import React, { useState, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat"; // Import IMessage for typing
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type ChatScreenProps = {
  route: RouteProp<RootStackParamList, "ChatScreen">;
};

const ChatScreen = ({ route }: ChatScreenProps) => {
  const { user } = route.params; // Get the user details from MessageScreen

  const [messages, setMessages] = useState<IMessage[]>([]); // Explicitly define the type of messages

  useEffect(() => {
    // Example: Preload some messages
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

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: 1, // Your own user id (you can dynamically set this based on logged-in user)
      }}
    />
  );
};

export default ChatScreen;
