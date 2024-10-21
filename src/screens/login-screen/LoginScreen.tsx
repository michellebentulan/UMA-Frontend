import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icon package for the eye icon
import styles from "./LoginScreenStyles";
import LottieView from "lottie-react-native"; // Lottie animation
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import SvgImage from "../../assets/svg-images/login-w8QV5Bdxgy.svg";

const LoginScreen = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use typed navigation

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Ionicons name="arrow-back" size={25} color="#333" />
      </TouchableOpacity>

      {/* <View style={styles.imageContainer}> */}
      {/* Add the SVG image */}
      {/* <SvgImage width={250} height={250} />
      </View> */}

      <View style={styles.middleSection}>
        <LottieView
          source={require("../../../assets/lottie/pin.json")} // Replace with your Lottie file path
          autoPlay
          loop
          style={styles.lottie}
        />
        {/* Title */}
        <Text style={styles.title}>Welcome Back to UMA!</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input with Eye Icon */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!isPasswordVisible} // Toggle secure text entry
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
        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("HomeScreen1")}
        >
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Create Account Button */}
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
