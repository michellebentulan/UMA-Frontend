import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons from expo
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker for selecting images
import PlaceholderIcon from "../../../assets/svg-images/Vector.svg"; // Import your SVG icon
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, NavigationProp } from "@react-navigation/native"; // For navigation
import { RootStackParamList } from "../../navigation/type";

const CompleteProfileScreen = () => {
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
    setBirthDate(currentDate.toLocaleDateString()); // Format as needed
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
              { label: "Other", value: "other" },
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
              { label: "Town 1", value: "town1" },
              { label: "Town 2", value: "town2" },
              { label: "Town 3", value: "town3" },
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
              { label: "Barangay 1", value: "barangay1" },
              { label: "Barangay 2", value: "barangay2" },
              { label: "Barangay 3", value: "barangay3" },
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
            onPress={() => navigation.navigate("HomeScreen1")}
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
    paddingTop: 15,
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
    fontSize: 16,
  },
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
