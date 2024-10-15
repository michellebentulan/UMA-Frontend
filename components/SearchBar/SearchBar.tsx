import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color="black" style={styles.icon} />{" "}
      {/* Search Icon */}
      <TextInput style={styles.input} placeholder="Search Livestock" />
      <Ionicons
        name="filter"
        size={24}
        color="black"
        style={styles.icon}
      />{" "}
      {/* Filter Icon */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    marginVertical: "2%",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default SearchBar;
