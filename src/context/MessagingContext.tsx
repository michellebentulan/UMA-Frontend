// import React, { createContext, useEffect, useState, useContext } from "react";
// import { socket } from "../utils/socketService";

// interface Message {
//   id: number;
//   conversationId: number;
//   senderId: number;
//   content: string;
//   createdAt: string;
// }

// interface MessagingContextType {
//   messages: Message[];
//   sendMessage: (
//     conversationId: number,
//     senderId: number,
//     content: string
//   ) => void;
//   joinConversation: (conversationId: number) => void;
// }

// const MessagingContext = createContext<MessagingContextType | undefined>(
//   undefined
// );

// export const MessagingProvider: React.FC<React.PropsWithChildren<{}>> = ({
//   children,
// }) => {
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     // Listen for incoming messages
//     socket.on("receiveMessage", (message: Message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, []);

//   const sendMessage = (
//     conversationId: number,
//     senderId: number,
//     content: string,
//     imageUrl?: string
//   ) => {
//     socket.emit("sendMessage", { conversationId, senderId, content, imageUrl });
//   };

//   const joinConversation = (conversationId: number) => {
//     socket.emit("joinRoom", conversationId);
//   };

//   return (
//     <MessagingContext.Provider
//       value={{ messages, sendMessage, joinConversation }}
//     >
//       {children}
//     </MessagingContext.Provider>
//   );
// };

// export const useMessaging = () => {
//   const context = useContext(MessagingContext);
//   if (!context) {
//     throw new Error("useMessaging must be used within a MessagingProvider");
//   }
//   return context;
// };
