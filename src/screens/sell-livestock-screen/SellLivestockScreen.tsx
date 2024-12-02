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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        navigation.goBack();
      }
      setUserId(storedUserId);
    };

    fetchUserId();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [navigation]);

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
      selectionLimit: 4 - images.length,
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

  const handlePriceSuggestion = async () => {
    if (!livestockType || !weight) {
      Alert.alert("Error", "Please select livestock type and enter weight.");
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.137.146:3000/price-suggestions/search`,
        {
          params: { livestock_type: livestockType },
        }
      );
      const pricePerKg = response.data.price_per_kg;
      const suggested =
        pricePerKg && weight ? parseFloat(weight) * pricePerKg * quantity : 0;
      setSuggestedPrice(suggested);
      setPrice(suggested.toString());
    } catch (error) {
      console.error("Error fetching price suggestion:", error);
      Alert.alert("Error", "Unable to fetch price suggestion.");
    }
  };

  const handleSaveListing = async () => {
    if (!livestockType || !weight || !price || images.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields and attach at least one image."
      );
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID is missing. Please log in again.");
      return;
    }

    try {
      setLoading(true); // Show loading screen

      // Prepare formData for image analysis
      console.log("Valid Images for Submission:", images);
      const formData = new FormData();

      images.forEach((image, index) => {
        formData.append("files", {
          uri: image.uri,
          type: "image/jpeg",
          name: `livestock-${Date.now()}-${index}.jpg`,
        } as any);
      });

      formData.append("user_id", userId.toString());
      formData.append("type", livestockType.toLowerCase());
      formData.append("quantity", quantity.toString());
      formData.append("weight_per_kg", weight.toString());
      formData.append("price", price.toString());
      formData.append("negotiable", isNegotiable ? "true" : "false");
      formData.append("description", description);
      formData.append("livestockType", livestockType.toLowerCase());

      console.log("Analyzing images...");
      console.log("Livestock Type:", livestockType);

      const analyzeResponse = await axios.post(
        "http://192.168.137.146:3000/livestock/analyze-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image Analysis Response:", analyzeResponse.data);
      const { validImages, invalidImages } = analyzeResponse.data;

      if (invalidImages.length > 0) {
        setLoading(false);
        Alert.alert(
          "Image Validation Failed",
          `Some images are not recognized as ${livestockType}. Please attach valid images.`,
          [
            {
              text: "OK",
              onPress: () => setImages(validImages),
            },
          ]
        );
        return;
      }

      console.log("Image validation passed, preparing listing data...");

      // Combine listing data with original valid image URIs
      const listingFormData = new FormData();

      images.forEach((image, index) => {
        // Use the original local URI of the image
        listingFormData.append("files", {
          uri: image.uri,
          type: "image/jpeg",
          name: `livestock-${Date.now()}-${index}.jpg`,
        } as any);
      });

      listingFormData.append("user_id", userId.toString());
      listingFormData.append("type", livestockType.toLowerCase());
      listingFormData.append("quantity", quantity.toString());
      listingFormData.append("weight_per_kg", weight.toString());
      listingFormData.append("price", price.toString());
      listingFormData.append("negotiable", isNegotiable ? "true" : "false");
      listingFormData.append("description", description);

      console.log("Submitting listing...");
      const listingResponse = await axios.post(
        "http://192.168.137.146:3000/livestock-listings",
        listingFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Listing created successfully:", listingResponse.data);
      setLoading(false);

      Alert.alert("Success", "Livestock listing created successfully!", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("HomeScreen1", {
              refreshRequestedListings: true,
            }),
        },
      ]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setLoading(false);
        if (error.response) {
          console.error("Error Response:", error.response.data);
        } else if (error.request) {
          console.error("Error Request:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }
      } else {
        console.error("Unexpected Error:", error);
      }

      Alert.alert("Error", "Failed to create the listing. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen visible={loading} text="Processing..." />
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
                {images.length < 3 && (
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
                {`${images.length}/3 Photos Added`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={(value) => setLivestockType(value)}
            items={[
              { label: "Pig", value: "pig" },
              { label: "Cow", value: "cow" },
              { label: "Chicken", value: "chicken" },
              { label: "Goat", value: "goat" },
              { label: "Duck", value: "duck" },
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
