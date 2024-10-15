// AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/welcome-screen/WelcomScreen";
import LoginScreen from "../screens/login-screen/LoginScreen";
import CreateAccountScreen from "../screens/create-account-screen/CreateAccountScreen";
import OTPVerificationScreen from "../screens/otp-pin-screen/OTPVerificationScreen";
import { RootStackParamList } from "./type";
import CompleteProfileScreen from "../screens/complete-profile-screen/CompleteProfileScreen";
import HomeScreen from "../screens/home-screen/HomeScreen";
import ChatScreen from "../screens/message-screen/ChatScreen";

const Stack = createNativeStackNavigator<RootStackParamList>(); // Pass your types here

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }} // This hides the header
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ title: "Chat" }} // You can customize the header title here
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
