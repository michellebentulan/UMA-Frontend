import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface TabButtonsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.forSaleButton,
          activeTab === "ForSale" && styles.activeButton,
        ]}
        onPress={() => setActiveTab("ForSale")}
      >
        <Text style={styles.buttonText}>For Sale</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.lookingForButton,
          activeTab === "LookingFor" && styles.activeButton,
        ]}
        onPress={() => setActiveTab("LookingFor")}
      >
        <Text style={styles.buttonText}>Looking For</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  forSaleButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  lookingForButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#000",
  },
  buttonText: {
    color: "#FFF",
  },
});

export default TabButtons;
