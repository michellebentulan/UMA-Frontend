// navigation/types.ts
export type Message = {
  id: string;
  name: string;
  image: string;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined; // Add more screens as needed, like CreateAccount
  CreateAccount: undefined;
  // OTPVerification: undefined;
  CompleteProfile: { userId: string; sessionToken: string };
  // HomeScreen: undefined;
  MessageScreen: undefined;
  ChatScreen: { user: Message };
  Home: undefined;
  HomeScreen1: undefined;
  SellLivestock: undefined;
  BuyLivestock: undefined;
  ProfileScreen: undefined;
  MapViewScreen: {
    town: string;
    barangay: string;
    latitude: number;
    longitude: number;
  };
};
