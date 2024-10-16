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
  OTPVerification: undefined;
  CompleteProfile: undefined;
  HomeScreen: undefined;
  MessageScreen: undefined;
  ChatScreen: { user: Message };
  Home: undefined;
};
