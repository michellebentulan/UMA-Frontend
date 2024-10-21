import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native"; // Lottie animation
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";

interface OTPConfirmationModalProps {
  visible: boolean;
  onContinue: () => void;
}

const OTPConfirmationModal: React.FC<OTPConfirmationModalProps> = ({
  visible,
  onContinue,
}) => {
  // Use typed navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require("../../../assets/lottie/pin.json")} // Replace with your Lottie file path
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.modalTitle}>Verified</Text>
          <Text style={styles.modalMessage}>
            You successfully verified your phone number!
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text
              style={styles.continueButtonText}
              onPress={() => navigation.navigate("CompleteProfile")} // Navigate to "CompleteProfile"
            >
              CONTINUE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Add your styles here
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "82%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Montserrat_400Regular",
    margin: 10,
    marginBottom: 10,
  },
  lottie: {
    width: "50%",
    aspectRatio: 1,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "Montserrat_400Regular",
  },
  continueButton: {
    backgroundColor: "#A14B44",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
});

export default OTPConfirmationModal;
