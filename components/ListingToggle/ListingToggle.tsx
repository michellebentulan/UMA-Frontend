// components/ListingsToggle.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ListingsToggle = () => {
  const [activeTab, setActiveTab] = useState("ForSale");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, activeTab === "ForSale" && styles.active]}
        onPress={() => setActiveTab("ForSale")}
      >
        <Text
          style={[styles.text, activeTab === "ForSale" && styles.activeText]}
        >
          For Sale
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, activeTab === "LookingFor" && styles.inactive]}
        onPress={() => setActiveTab("LookingFor")}
      >
        <Text
          style={[
            styles.text,
            activeTab === "LookingFor" && styles.inactiveText,
          ]}
        >
          Looking for
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: "2%",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  active: {
    backgroundColor: "#333",
  },
  inactive: {
    backgroundColor: "#e0e0e0",
  },
  text: {
    fontSize: 16,
  },
  activeText: {
    color: "#fff",
  },
  inactiveText: {
    color: "#999",
  },
});

export default ListingsToggle;
