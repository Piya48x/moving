import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "./environments";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const CustomerScreen = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const pickupAutocompleteRef = useRef(); // Ref for Pickup Location Autocomplete
  const dropoffAutocompleteRef = useRef(); // Ref for Drop-off Location Autocomplete

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("การเข้าถึงตำแหน่งถูกปฏิเสธ");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleDirections = () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert("ข้อผิดพลาด", "กรุณาเลือกสถานที่รับและส่ง.");
      return;
    }

    const directionsURL = `https://www.google.com/maps/dir/?api=1&origin=${pickupLocation.latitude},${pickupLocation.longitude}&destination=${dropoffLocation.latitude},${dropoffLocation.longitude}`;
    Linking.openURL(directionsURL);
  };

  const clearPickupLocation = () => {
    setPickupLocation(null);
    // ล้างฟิลด์ GooglePlacesAutocomplete สำหรับรับสินค้า
    pickupAutocompleteRef.current.clear();
  };

  const clearDropoffLocation = () => {
    setDropoffLocation(null);
    // ล้างฟิลด์ GooglePlacesAutocomplete สำหรับจุดส่ง
    dropoffAutocompleteRef.current.clear();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={
              location
                ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }
                : null
            }
            onPress={(e) => {
              if (!pickupLocation) {
                setPickupLocation(e.nativeEvent.coordinate);
              } else if (!dropoffLocation) {
                setDropoffLocation(e.nativeEvent.coordinate);
              }
            }}
          >
            {pickupLocation && (
              <Marker coordinate={pickupLocation} title="สถานที่รับสินค้า" />
            )}
            {dropoffLocation && (
              <Marker coordinate={dropoffLocation} title="สถานที่จัดส่ง" />
            )}
          </MapView>
          <View style={styles.searchContainer}>
            <View style={styles.input}>
              <GooglePlacesAutocomplete
                ref={pickupAutocompleteRef}
                placeholder="สถานที่รับสินค้า"
                onPress={(data) => {
                  const placeId = data.place_id;
                  if (placeId) {
                    // ใช้ Place Details API เพื่อดึงข้อมูลที่ละเอียด
                    fetch(
                      `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_API_KEY}&place_id=${placeId}`
                    )
                      .then((response) => response.json())
                      .then((result) => {
                        if (
                          result.status === "OK" &&
                          result.result.geometry &&
                          result.result.geometry.location
                        ) {
                          setPickupLocation({
                            latitude: result.result.geometry.location.lat,
                            longitude: result.result.geometry.location.lng,
                          });
                        } else {
                          console.error("ข้อมูลสถานที่ไม่ถูกต้อง:", result);
                        }
                      })
                      .catch((error) => {
                        console.error(
                          "ข้อผิดพลาดในการดึงข้อมูลสถานที่:",
                          error
                        );
                      });
                  } else {
                    console.error("รหัสสถานที่ไม่ถูกต้อง");
                  }
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: "th",
                }}
              />
            </View>
            <View style={styles.input}>
              <GooglePlacesAutocomplete
                ref={dropoffAutocompleteRef}
                placeholder="สถานที่จัดส่ง"
                onPress={(data) => {
                  const placeId = data.place_id;
                  if (placeId) {
                    // ใช้ Place Details API เพื่อดึงข้อมูลที่ละเอียด
                    fetch(
                      `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_API_KEY}&place_id=${placeId}`
                    )
                      .then((response) => response.json())
                      .then((result) => {
                        if (
                          result.status === "OK" &&
                          result.result.geometry &&
                          result.result.geometry.location
                        ) {
                          setDropoffLocation({
                            latitude: result.result.geometry.location.lat,
                            longitude: result.result.geometry.location.lng,
                          });
                        } else {
                          console.error("ข้อมูลสถานที่ไม่ถูกต้อง:", result);
                        }
                      })
                      .catch((error) => {
                        console.error(
                          "ข้อผิดพลาดในการดึงข้อมูลสถานที่:",
                          error
                        );
                      });
                  } else {
                    console.error("รหัสสถานที่ไม่ถูกต้อง");
                  }
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: "th",
                }}
              />
            </View>
          </View>
          <View style={styles.notificationBar}>
            {location ? (
              <View>
                <Text style={styles.text}>
                  <Ionicons name="location" size={24} color="black" />
                  Location: สถานะของคุณอยู่ในตำแหน่งปัจจุบันแล้ว
                  {/* : Lat: {location.coords.latitude}, Lng:{" "}
                {location.coords.longitude} */}
                </Text>
              </View>
            ) : errorMsg ? (
              <Text style={styles.text}>{errorMsg}</Text>
            ) : (
              <Text style={styles.text}>
                โปรดรอสักครู่กำลังเข้าถึงตำแหน่ง GPS ปัจจุบันของคุณ...
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={handleDirections}
            >
              <Text style={styles.buttonText}>รับคำแนะนำทาง</Text>
            </TouchableOpacity>
            {pickupLocation && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearPickupLocation}
              >
                <Text style={styles.buttonText}>ล้างสถานที่รับสินค้า</Text>
              </TouchableOpacity>
            )}
            {dropoffLocation && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearDropoffLocation}
              >
                <Text style={styles.buttonText}>ล้างสถานที่จัดส่ง</Text>
              </TouchableOpacity>
            )}
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
  searchContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    

  },
  input: {
    borderColor: "#0782F9",
    borderWidth: 2,
    margin: 2,
    borderRadius: 3,
  },
  directionsButton: {
    backgroundColor: "#0782F9",
    padding: 15,
    borderRadius: 10,
  },
  clearButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  notificationBar: {
    backgroundColor: "#f5f5f5",
    padding: 2,
    elevation: 3,
    borderRadius: 3,
  },
  text: {
    color: "#333",
  },
});

export default CustomerScreen;
