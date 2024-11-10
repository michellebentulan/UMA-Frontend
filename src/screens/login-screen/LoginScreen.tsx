import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./LoginScreenStyles";
import LottieView from "lottie-react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import axios from "axios";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Validate the input fields before attempting login
  const validateInputs = () => {
    if (!phoneNumber || !password) {
      Alert.alert(
        "Validation Error",
        "Both phone number and password are required."
      );
      return false;
    }

    if (!/^\d{11}$/.test(phoneNumber)) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid 11-digit phone number."
      );
      return false;
    }

    return true;
  };

  // Handle the login functionality
  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }
    console.log("Login button pressed");

    try {
      // Attempt to login
      console.log("Attempting login...");
      const response = await axios.post(
        "http://192.168.187.149:3000/users/login",
        {
          phone_number: phoneNumber,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds
        }
      );

      // Log the response details
      console.log("Response received:", response);

      // Handle successful response with status code 200 or 201
      if (response.status === 200 || response.status === 201) {
        console.log("Login successful:", response.data);

        // Store the userId in AsyncStorage for future use
        await AsyncStorage.setItem("userId", response.data.userId.toString());
        await AsyncStorage.setItem("sessionToken", response.data.sessionToken);

        // Show a toast message for login success
        Toast.show("Login successful!", Toast.SHORT);

        // Navigate to HomeScreen1
        console.log("Navigating to HomeScreen1");
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen1" }],
        });
      } else {
        // console.warn("Unexpected response status:", response.status);
        Alert.alert("Login Failed", "An unexpected error occurred.");
      }
    } catch (error) {
      // console.error("Error logging in:", error);
      Alert.alert("Login Failed", "Invalid phone number or password.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Ionicons name="arrow-back" size={25} color="#333" />
      </TouchableOpacity>

      <View style={styles.middleSection}>
        <LottieView
          source={require("../../../assets/lottie/pin.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.title}>Welcome Back to UMA!</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("CreateAccount")}
        >
          <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
