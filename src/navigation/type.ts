// navigation/types.ts

type Message = {
  id: number; // Change from string to number to match RootStackParamList
  name: string;
  message: string;
  time: string;
  image: string;
  phone: string;
  isUnread: boolean;
};

export type User = {
  id: number;
  name: string;
  image: string;
  phone: string; // Include phone property
};

export type Participant = {
  id: number;
  first_name: string;
  last_name: string;
  profile_image: string;
};

export type Conversation = {
  id: number;
  lastMessage: Message; // The last message in the conversation
  unreadMessagesCount: number; // Unread message count
  participants: Participant[]; // List of participants
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined; // Add more screens as needed, like CreateAccount
  CreateAccount: undefined;
  // OTPVerification: undefined;
  CompleteProfile: { userId: string; sessionToken: string };
  MessageScreen: undefined;
  ChatScreen: {
    conversationId: number;
    user: {
      id: number;
      name: string;
      image: string;
      phone?: string; // Make phone optional
    };
  };
  Home: undefined;
  HomeScreen1: { refreshRequestedListings?: boolean };
  SellLivestock: undefined;
  BuyLivestock: undefined;
  ProfileScreen: undefined;
  MapViewScreen: {
    town: string;
    barangay: string;
    latitude: number;
    longitude: number;
  };
  ListingDetailsScreen: {
    listingId: number; // Parameter to navigate to ListingDetailsScreen
  };
};
