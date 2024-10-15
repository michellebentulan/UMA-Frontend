import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native"; // Lottie animation
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import styles from "./OTPVerificationStyles";
import OTPConfirmationModal from "../../components/OTPModal/OTPConfirmationModal";

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  // Handle OTP input change
  const handleChangeText = (value: string, index: number) => {
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  // Handle OTP verification logic
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join(""); // Join the OTP array into a single string

    // Replace '123456' with the actual OTP sent to the user
    if (enteredOtp === "123456") {
      setIsModalVisible(true); // Show modal on successful OTP verification
    } else {
      alert("Incorrect OTP");
    }
  };

  // Handle the action on pressing "Continue" in the modal
  const handleContinue = () => {
    setIsModalVisible(false);
    // Proceed with the navigation or other actions after successful OTP verification
    // navigation.navigate("NextScreen"); // Example of navigating to the next screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {/* Add the Lottie Animation */}
        <LottieView
          source={require("../../assets/lottie/pin.json")} // Replace with your Lottie file path
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        To ensure your account's security, we need to verify your phone number.
      </Text>

      <Text style={styles.phoneText}>
        Enter the 6-digit pin we sent to{" "}
        <Text style={styles.phoneNumber}>+91 9879873333</Text>
      </Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChangeText(value, index)}
          />
        ))}
      </View>

      {/* Resend OTP */}
      <Text style={styles.resendText}>
        Didn’t receive the pin?{" "}
        <Text style={styles.resendLink}>Resend OTP</Text>
      </Text>

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
        <Text style={styles.verifyButtonText}>VERIFY</Text>
      </TouchableOpacity>

      {/* OTP Confirmation Modal */}
      <OTPConfirmationModal
        visible={isModalVisible}
        onContinue={handleContinue}
      />
    </ScrollView>
  );
};

export default OTPVerificationScreen;
