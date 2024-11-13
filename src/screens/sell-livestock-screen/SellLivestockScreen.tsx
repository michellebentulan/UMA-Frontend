import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import RNPickerSelect from "react-native-picker-select";
import { RFValue } from "react-native-responsive-fontsize";
import { RootStackParamList } from "../../navigation/type";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface ImageItem {
  uri: string;
  id: string;
}

type SellLivestockScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SellLivestock"
>;

const SellLivestockScreen: React.FC<SellLivestockScreenProps> = ({
  navigation,
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [livestockType, setLivestockType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [weight, setWeight] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isNegotiable, setIsNegotiable] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  const handleBackPress = () => {
    Alert.alert(
      "Cancel Listing?",
      "You can always make a list for selling livestock.",
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

  const handleAddPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 2 - images.length,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets?.map((asset, index) => ({
        uri: asset.uri,
        id: (images.length + index + 1).toString(),
      }));
      if (newImages) {
        setImages([...images, ...newImages]);
      }
    }
  };

  const handleRemovePhoto = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const analyzeImages = async () => {
    if (images.length === 0) {
      Alert.alert("No Images", "Please select images to analyze.");
      return;
    }

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("files", {
          uri: image.uri,
          type: "image/jpeg",
          name: `livestock-${Date.now()}-${index}.jpg`,
        } as any);
      });

      const response = await axios.post(
        "http://192.168.187.149:3000/livestock/analyze-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check if images were verified as livestock
      const { validImages, invalidImages } = response.data;
      if (invalidImages.length > 0) {
        setImages(validImages); // Keep only valid images
        Alert.alert(
          "Invalid Images Removed",
          "Some images were not recognized as livestock and were removed."
        );
      } else {
        Alert.alert("Images Validated", "All images are valid livestock.");
      }
    } catch (error) {
      console.error("Error analyzing images:", error);
      Alert.alert("Error", "Failed to analyze images. Please try again.");
    }
  };

  const handlePriceSuggestion = () => {
    let pricePerKilo = 0;
    if (livestockType === "Pigs") pricePerKilo = 200;
    else if (livestockType === "Cow") pricePerKilo = 800;
    else if (livestockType === "Chicken") pricePerKilo = 100;

    const suggested = weight ? parseFloat(weight) * pricePerKilo * quantity : 0;
    setSuggestedPrice(suggested);
    setPrice(suggested.toString());
  };

  const handleSaveListing = async () => {
    if (!livestockType || !weight || !price) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    await analyzeImages();

    try {
      const listingData = {
        livestockType,
        quantity,
        weight,
        price,
        isNegotiable,
        description,
      };
      await axios.post(
        "http://192.168.187.149:3000/livestock/listing",
        listingData
      );

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append("files", {
            uri: image.uri,
            type: "image/jpeg",
            name: `livestock-${Date.now()}-${index}.jpg`,
          } as any);
        });

        await axios.post(
          "http://192.168.187.149:3000/livestock/upload-images",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      Alert.alert("Success", "Livestock listing created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("HomeScreen1"),
        },
      ]);
    } catch (error) {
      console.error("Error creating listing:", error);
      Alert.alert("Error", "Failed to create the listing. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={RFValue(20)} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Sell Livestock</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.photoUploadContainer}>
          {images.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyAttachContainer}
              onPress={handleAddPhoto}
            >
              <Ionicons name="image" size={RFValue(25)} color="black" />
              <Text style={styles.attachPhotoText}>Attach Photos</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.imageContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((image) => (
                  <View key={image.id} style={styles.imageWrapper}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemovePhoto(image.id)}
                    >
                      <Ionicons name="close" size={RFValue(18)} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 4 && (
                  <TouchableOpacity
                    style={styles.addPhotoButton}
                    onPress={handleAddPhoto}
                  >
                    <Ionicons name="add" size={RFValue(25)} color="black" />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
              <Text style={styles.photoCount}>
                {`${images.length}/4 Photos Added`}
              </Text>
            </View>
          )}
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
            <Text style={styles.label}>Weight in Kilogram</Text>
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
            <Text style={styles.label}>Price</Text>
            <View style={styles.PriceContainer}>
              <View style={styles.cardContainer}>
                <TextInput
                  style={[
                    styles.input,
                    price != suggestedPrice?.toString() &&
                      styles.priceDifferent,
                  ]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsNegotiable(!isNegotiable)}
            style={styles.checkboxContainer}
          >
            <Ionicons
              name={isNegotiable ? "checkbox" : "square-outline"}
              size={RFValue(18)}
              color="black"
            />
            <Text style={styles.checkboxLabel}>Price Negotiable?</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity onPress={handlePriceSuggestion}>
          <Text style={styles.priceSuggestion}>Get Price Suggestion</Text>
        </TouchableOpacity> */}
        <View style={styles.row}>
          <TouchableOpacity onPress={handlePriceSuggestion}>
            <Text style={styles.priceSuggestion}>Get Price Suggestion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tooltipContainer}
            onPress={() =>
              Alert.alert(
                "Price Information",
                "Suggested price based on SRP guidelines provided by the Department of Agriculture."
              )
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={RFValue(16)}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Write Description..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.postButton} onPress={analyzeImages}>
          <Text style={styles.postButtonText}>Analyze Images</Text>
        </TouchableOpacity>
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
  photoUploadContainer: {
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyAttachContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  attachPhotoText: {
    fontSize: RFValue(13),
    marginTop: 10,
    fontFamily: "Montserrat_400Regular",
  },
  imageContainer: {
    maxHeight: 180,
    overflow: "hidden",
  },
  imageWrapper: {
    marginRight: 10,
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
  },
  addPhotoButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  addPhotoText: {
    fontSize: RFValue(12),
    marginTop: 4,
    fontFamily: "Montserrat_400Regular",
  },
  photoCount: {
    textAlign: "right",
    marginTop: 8,
    color: "#888",
    fontFamily: "Montserrat_400Regular",
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
  PriceContainer: {
    flex: 1,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    fontFamily: "Montserrat_400Regular",
    fontSize: RFValue(14),
  },
  checkboxContainer: {
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontFamily: "Montserrat_400Regular",
    fontSize: RFValue(12),
  },
  priceSuggestion: {
    color: "red",
    marginBottom: 18,
    marginTop: -8,
    marginLeft: 12,
    fontFamily: "Montserrat_400Regular",
    fontSize: RFValue(12),
    textDecorationLine: "underline",
  },
  tooltipContainer: {
    marginLeft: 6,
    marginTop: -8,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  priceDifferent: {
    color: "red",
  },
  textAreaContainer: {
    marginBottom: 60,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 120,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
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

export default SellLivestockScreen;
