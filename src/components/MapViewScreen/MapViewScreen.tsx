import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";
import { Ionicons } from "@expo/vector-icons";

type MapViewScreenRouteProp = RouteProp<RootStackParamList, "MapViewScreen">;

interface MapViewScreenProps {
  route: MapViewScreenRouteProp;
}

const MapViewScreen: React.FC<MapViewScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { town, barangay, latitude, longitude } = route.params;

  console.log(
    "Received in MapViewScreen - Latitude:",
    latitude,
    "Longitude:",
    longitude
  );

  if (
    latitude === undefined ||
    longitude === undefined ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    console.error("Invalid coordinates received in MapViewScreen");
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Location data is not available.</Text>
      </View>
    );
  }

  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      <MapView style={styles.map} initialRegion={region}>
        <Marker
          coordinate={{ latitude, longitude }}
          title={`${barangay}, ${town}`}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 25,
    padding: 5,
  },
});

export default MapViewScreen;
