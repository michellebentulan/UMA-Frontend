import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons from expo
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker for selecting images
import PlaceholderIcon from "../../../assets/svg-images/Vector.svg"; // Import your SVG icon
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native"; // For navigation
import { RootStackParamList } from "../../navigation/type";
import { RFValue } from "react-native-responsive-fontsize";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CompleteProfileScreenRouteProp = RouteProp<
  RootStackParamList,
  "CompleteProfile"
>;

interface CompleteProfileScreenProps {
  route: CompleteProfileScreenRouteProp;
}

const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({
  route,
}) => {
  const { userId, sessionToken } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [town, setTown] = useState<string | undefined>(undefined);
  const [barangay, setBarangay] = useState<string | undefined>(undefined);
  const [birthDate, setBirthDate] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleImagePicker = async () => {
    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date || new Date();
    setShowPicker(false);
    setDate(currentDate);
    setBirthDate(currentDate.toISOString().split("T")[0]);
  };

  const validateInputs = () => {
    if (!profileImage) {
      Alert.alert("Validation Error", "Please select a profile image.");
      return false;
    }

    if (!birthDate) {
      Alert.alert("Validation Error", "Please select your birthdate.");
      return false;
    }

    if (!gender) {
      Alert.alert("Validation Error", "Please select your gender.");
      return false;
    }

    if (!town) {
      Alert.alert("Validation Error", "Please select your town/municipality.");
      return false;
    }

    if (!barangay) {
      Alert.alert("Validation Error", "Please select your barangay.");
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      // Update user profile details
      const profileData = {
        birthdate: birthDate,
        gender: gender,
        town: town,
        barangay: barangay,
        email: "", // Add email field if needed
      };
      await axios.put(
        `http://192.168.29.149:3000/users/complete-profile/${userId}`,
        profileData
      );

      // If an image was selected, upload it
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", {
          uri: profileImage,
          type: "image/jpeg", // Update based on your file type
          name: `profile-${Date.now()}.jpg`,
        } as any);

        await axios.post(
          `http://192.168.29.149:3000/users/upload-profile-image/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // Store userId and sessionToken in AsyncStorage for future use
      await AsyncStorage.setItem("userId", userId.toString());

      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("HomeScreen1", {
              refreshRequestedListings: true,
            }),
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update the profile. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title and Subtitle */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Provide a few more details to complete your profile.
        </Text>
      </View>

      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <PlaceholderIcon width={120} height={120} /> // Use your imported SVG
        )}
        <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePicker}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Birth Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth Date</Text>
          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={showDatePicker}
          >
            <TextInput
              style={styles.input}
              placeholder="MM/DD/YYYY"
              value={birthDate}
              editable={false} // Prevent manual editing
            />
            <Ionicons name="calendar" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Show Date Picker */}
        {showPicker && (
          <DateTimePicker
            value={date || new Date()} // Default to current date
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        {/* Gender Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <RNPickerSelect
            onValueChange={(value) => setGender(value)}
            items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              // { label: "Other", value: "other" },
            ]}
            value={gender}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Gender", value: null }}
          />
        </View>

        {/* Town Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Town / Municipality</Text>
          <RNPickerSelect
            onValueChange={(value) => setTown(value)}
            items={[
              { label: "Tubigon", value: "Tubigon" },
              // { label: "Town 2", value: "town2" },
              // { label: "Town 3", value: "town3" },
            ]}
            value={town}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Town / Municipality", value: null }}
          />
        </View>

        {/* Barangay Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Barangay</Text>
          <RNPickerSelect
            onValueChange={(value) => setBarangay(value)}
            items={[
              { label: "Bagongbanwa Island", value: "Bagongbanwa Island" },
              { label: "Banlasan", value: "Banlasan" },
              { label: "Batasan Island", value: "Batasan Island" },
              {
                label: "Bilangbilangan Island",
                value: "Bilangbilangan Island",
              },
              { label: "Bosongon", value: "Bosongon" },
              { label: "Buenos Aires", value: "Buenos Aires" },
              { label: "Bunacan", value: "Bunacan" },
              { label: "Cabulijan", value: "Cabulijan" },
              { label: "Cahayag", value: "Cahayag" },
              { label: "Cawayanan", value: "Cawayanan" },
              { label: "Centro", value: "Centro" },
              { label: "Genonocan", value: "Genonocan" },
              { label: "Guiwanon", value: "Guiwanon" },
              { label: "Ilijan Norte", value: "Ilijan Norte" },
              { label: "Ilijan Sur", value: "Ilijan Sur" },
              { label: "Libertad", value: "Libertad" },
              { label: "Macaas", value: "Macaas" },
              { label: "Matabao", value: "Matabao" },
              { label: "Mocaboc Island", value: "Mocaboc Island" },
              { label: "Panadtaran", value: "Panadtaran" },
              { label: "Panaytayon", value: "Panaytayon" },
              { label: "Pandan", value: "Pandan" },
              { label: "Pangapasan Island", value: "Pangapasan Island" },
              { label: "Pinayagan Norte", value: "Pinayagan Norte" },
              { label: "Pinayagan Sur", value: "Pinayagan Sur" },
              { label: "Pooc Occidental", value: "Pooc Occidental" },
              { label: "Pooc Oriental", value: "Pooc Oriental" },
              { label: "Potohan", value: "Potohan" },
              { label: "Talenceras", value: "Talenceras" },
              { label: "Tan-awan", value: "Tan-awan" },
              { label: "Tinangnan", value: "Tinangnan" },
              { label: "Ubojan", value: "Ubojan" },
              { label: "Ubay Island", value: "Ubay Island" },
              { label: "Villanueva", value: "Villanueva" },
            ]}
            value={barangay}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Barangay", value: null }}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="123@gmail.com"
            keyboardType="email-address"
          />
        </View>

        {/* Save Button */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles for the screen and components
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "5%",
    justifyContent: "center", // Center content vertically
    flexGrow: 1,
  },
  headerContainer: {
    paddingTop: 18,
    margin: 10,
    marginBottom: 25,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 2,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#32a852",
  },
  cameraIcon: {
    bottom: 30,
    left: 35,
    right: 10,
    backgroundColor: "#32a852",
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: "Montserrat_400Regular",
    textAlign: "left", // Align to the left
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "left", // Align to the left
    marginBottom: 20,
    fontFamily: "Montserrat_400Regular",
  },
  formContainer: {
    padding: 8,
  },
  inputGroup: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    padding: 12,
    flex: 1,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 1,
    paddingRight: 12,
  },
  saveButton: {
    backgroundColor: "#A14B44",
    width: "75%",
    paddingVertical: "3.8%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontFamily: "Montserrat_400Regular",
    fontSize: RFValue(15),
  },

  // createAccountButton: {
  //   width: "75%",
  //   paddingVertical: "3.8%",
  //   backgroundColor: "#A14B44",
  //   borderRadius: 20,
  //   alignItems: "center",
  //   marginTop: 5,
  //   marginBottom: 40,
  // },
  // createAccountButtonText: {
  //   color: "#FFFFFF",
  //   fontSize: RFValue(15),
  //   fontFamily: "Montserrat_400Regular",
  // },
});

// Picker Select styles
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    color: "black",
    marginTop: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    color: "black",
    marginTop: 5,
  },
};

export default CompleteProfileScreen;
