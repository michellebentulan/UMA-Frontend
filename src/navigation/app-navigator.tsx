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
import ChatScreen from "../screens/message-screen/ChatScreen";
import MessageScreen from "../screens/message-screen/MessageScreen";
import HomeScreen1 from "../screens/home-screen/homelayout";
import SellLivestockScreen from "../screens/sell-livestock-screen/SellLivestockScreen";
import BuyLivestockScreen from "../screens/buy-livestock-screen/BuyLivestockScreen";
import MapViewScreen from "../components/MapViewScreen/MapViewScreen";
import ProfileScreen from "../screens/profile-screen/ProfileScreen";
import ListingDetailsScreen from "../components/ListingDetailsScreen/ListingDetailsScreen";
import NotificationScreen from "../components/NotificationScreen/NotificationScreen";
import SettingsScreen from "../screens/settings-screen/SettingsScreen";
// import NotificationScreen from "../components/NotificationScreen/NotificationScreen";

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
        {/* <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ headerShown: false }}
          initialParams={{ userId: "" }} // Default empty userId
        />
        {/* <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }} // You can customize the header title here
        />
        <Stack.Screen
          name="HomeScreen1"
          component={HomeScreen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SellLivestock"
          component={SellLivestockScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BuyLivestock"
          component={BuyLivestockScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MapViewScreen"
          component={MapViewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListingDetailsScreen"
          component={ListingDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
