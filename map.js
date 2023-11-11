import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "./environments";

const CustomerScreen = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const mapRef = useRef(null);

  const handlePickupConfirm = () => {
    if (pickupLocation && dropoffLocation) {
      console.log("จุดรับ:", pickupLocation);
      console.log("จุดส่ง:", dropoffLocation);
    } else {
      alert("โปรดเลือกทั้งจุดรับและจุดส่ง");
    }
  };

  const clearPickupLocation = () => {
    setPickupLocation(null);
  };

  const clearDropoffLocation = () => {
    setDropoffLocation(null);
  };

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const INITIAL_POSITION = {
    latitude: 16.2007537,
    longitude: 103.2684035,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      enabled
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={INITIAL_POSITION}
            onPress={(e) => {
              if (!pickupLocation) {
                setPickupLocation(e.nativeEvent.coordinate);
              } else if (!dropoffLocation) {
                setDropoffLocation(e.nativeEvent.coordinate);
              }
            }}
          >
            {pickupLocation && (
              <Marker coordinate={pickupLocation} title="จุดรับสินค้า" />
            )}
            {dropoffLocation && (
              <Marker coordinate={dropoffLocation} title="จุดส่งสินค้า" />
            )}
          </MapView>
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              styles={{ textInput: styles.input }}
              placeholder="Search"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              query={{
                key: { GOOGLE_API_KEY },
                language: "en",
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearPickupLocation}
            >
              <Text style={styles.buttonText}>Clear Pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearDropoffLocation}
            >
              <Text style={styles.buttonText}>Clear Drop-off</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handlePickupConfirm}
            >
              <Text style={styles.buttonText}>ยืนยันจุดรับและจุดส่ง</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmButton: {
    backgroundColor: "#0782F9",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  clearButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
  },

  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
});

export default CustomerScreen;
