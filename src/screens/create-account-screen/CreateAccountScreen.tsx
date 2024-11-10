import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icon package for eye icons
import LottieView from "lottie-react-native"; // Import LottieView
import animationData from "../../../assets/lottie/pin.json";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import styles from "./CreateAccountStyles";
import axios from "axios";
import { AxiosError } from "axios";

const CreateAccountScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use typed navigation

  // Toggle visibility for password fields
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const toggleCheckbox = () => {
    setIsChecked((prev) => !prev); // Define the function here
  };

  // Validate the input fields before submitting
  const validateInputs = () => {
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }

    if (!/^\d{11}$/.test(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }

    if (!isChecked) {
      Alert.alert("Error", "Please agree to the Terms and Privacy Policy.");
      return false;
    }

    return true;
  };

  // Handle the account creation
  const handleCreateAccount = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.137.29:3000/users/create-account",
        // "http://localhost:3000/users/create-account",
        {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          password: password,
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("CompleteProfile", {
                userId: response.data.user.id,
                sessionToken: response.data.sessionToken, // Pass the session token
              }),
          },
        ]);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error creating account:", error);
        Alert.alert(
          "Error",
          error.response?.data?.message ||
            "Failed to create an account. Please try again."
        );
      } else {
        console.error("Unknown error:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Ionicons name="arrow-back" size={25} color="#333" />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {/* Add the Lottie Animation */}
        <LottieView
          source={animationData} // Use the imported Lottie JSON file
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      <Text style={styles.title}>Create Your Account</Text>

      {/* First Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      {/* Last Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      {/* Phone Number Input */}
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

      {/* Password Input */}
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

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleConfirmPasswordVisibility}
        >
          <Ionicons
            name={isConfirmPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Terms and Conditions Checkbox */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleCheckbox} style={styles.checkbox}>
          <Ionicons
            name={isChecked ? "checkbox-outline" : "square-outline"}
            size={27}
            color={isChecked ? "#A14B44" : "#888"}
          />
        </TouchableOpacity>
        <Text style={styles.termsText}>
          I have read and agree to the{" "}
          <Text style={styles.link}>Terms of Service</Text> {"\n"} and{" "}
          <Text style={styles.link}>Privacy Policy</Text> of UMA (2024)
        </Text>
      </View>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount} // Use the new handler to create an account
        >
          <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateAccountScreen;
