import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Modal } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface LoadingScreenProps {
  visible: boolean; // Controls visibility of the loader
  text?: string; // Customizable loading text
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ visible, text }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a4a4a" />
          <Text style={styles.loadingText}>{text || "Loading..."}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  loaderContainer: {
    width: RFValue(150),
    padding: RFValue(20),
    backgroundColor: "#fff",
    borderRadius: RFValue(10),
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: RFValue(10),
    fontSize: RFValue(14),
    color: "#4a4a4a",
    textAlign: "center",
    fontFamily: "Montserrat_400Regular",
  },
});
