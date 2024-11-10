import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { RFValue } from "react-native-responsive-fontsize";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/type";

interface BuyLivestockScreenProps
  extends NativeStackScreenProps<RootStackParamList, "BuyLivestock"> {}

const BuyLivestockScreen: React.FC<BuyLivestockScreenProps> = ({
  navigation,
}) => {
  const [livestockType, setLivestockType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [weight, setWeight] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleBackPress = () => {
    Alert.alert(
      "Cancel Listing?",
      "You can always make a list for purchasing livestock.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => navigation.goBack() },
      ]
    );
    return true; // Prevent default back action
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, []);

  const handleSaveListing = () => {
    if (!livestockType || !weight || !price) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
    Alert.alert("Success", "Livestock purchase listing created successfully!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("HomeScreen1"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={RFValue(20)} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Buy Livestock</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Write Description..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={(value) => setLivestockType(value)}
            items={[
              { label: "Pigs", value: "Pigs" },
              { label: "Cow", value: "Cow" },
              { label: "Chicken", value: "Chicken" },
              { label: "Goat", value: "Goat" },
              { label: "Duck", value: "Duck" },
            ]}
            value={livestockType}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Livestock Type", value: null }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Ionicons name="chevron-down" size={RFValue(18)} color="gray" />
            )}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.cardContainer}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  <Ionicons name="remove" size={RFValue(18)} color="red" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                  <Ionicons name="add" size={RFValue(18)} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preferred Weight</Text>
            <View style={styles.cardContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preferred Price</Text>
            <View style={styles.cardContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.postButton} onPress={handleSaveListing}>
          <Text style={styles.postButtonText}>Post List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 18,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    justifyContent: "flex-start",
  },
  backButton: {
    paddingHorizontal: 18,
  },
  header: {
    fontSize: RFValue(18),
    textAlign: "center",
    flex: 1,
    fontFamily: "Montserrat_400Regular",
  },

  textAreaContainer: {
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  textArea: {
    height: 140,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    fontFamily: "Montserrat_400Regular",
    fontSize: RFValue(14),
  },

  dropdownContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: RFValue(13),
    marginBottom: 8,
    fontFamily: "Montserrat_400Regular",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quantityText: {
    fontSize: RFValue(16),
    marginHorizontal: 8,
    fontFamily: "Montserrat_400Regular",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    fontFamily: "Montserrat_400Regular",
    fontSize: RFValue(14),
  },
  footerContainer: {
    justifyContent: "flex-end",
    padding: 18,
    backgroundColor: "#fff",
  },
  postButton: {
    backgroundColor: "#333",
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  postButtonText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontFamily: "Montserrat_400Regular",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
    fontFamily: "Montserrat_400Regular",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    color: "black",
    fontFamily: "Montserrat_400Regular",
  },
  iconContainer: {
    top: 17,
    right: 14,
  },
};

export default BuyLivestockScreen;
