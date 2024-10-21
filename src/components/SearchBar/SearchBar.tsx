// SearchBar.tsx
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search Livestock",
}) => {
  return (
    <View style={styles.searchSection}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder={placeholder} />
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <Ionicons
          name="options-outline"
          size={20}
          color="#888"
          style={styles.filterIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    // height: 60,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
  searchIcon: {
    marginLeft: 10,
  },
  filterIcon: {
    marginLeft: 10,
  },
});

export default SearchBar;
