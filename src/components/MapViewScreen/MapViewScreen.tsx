import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/type";

type MapViewScreenRouteProp = RouteProp<RootStackParamList, "MapViewScreen">;

interface MapViewScreenProps {
  route: MapViewScreenRouteProp;
}

const MapViewScreen: React.FC<MapViewScreenProps> = ({ route }) => {
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
});

export default MapViewScreen;
