// WelcomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native"; // Lottie animation
import * as Font from "expo-font"; // Font loader
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat"; // Font import
import styles from "./WelcomeScreenStyles"; // Import styles from a separate file
import { useNavigation, NavigationProp } from "@react-navigation/native"; // For navigation
import { RootStackParamList } from "../../navigation/type";
import SellLivestockScreen from "../sell-livestock-screen/SellLivestockScreen";

const WelcomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use typed navigation

  useEffect(() => {
    async function loadResources() {
      try {
        // Pre-load fonts and other resources
        await Font.loadAsync({
          Montserrat_400Regular,
          Montserrat_700Bold,
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    }

    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null; // Optionally return a fallback component while fonts are loading
  }

  return (
    <View style={styles.container}>
      {/* Rest of your screen components */}
      {/* Middle Section (Lottie Animation + Intro Text) */}
      <View style={styles.middleSection}>
        <LottieView
          source={require("../../../assets/lottie/waving.json")}
          autoPlay
          loop
          style={styles.lottie}
        />

        <Text style={styles.introText}>Welcome to UMA!</Text>
        <Text style={styles.introText2}>
          Your one-stop marketplace for all livestock.
        </Text>
        <Text style={styles.introText2}>
          Join us to explore, buy, and sell with ease.
        </Text>
      </View>

      {/* Bottom Section (Buttons) */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")} // Typed navigation
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("CreateAccount")}
          // Add this route if you have it
        >
          <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
