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
  Modal,
  TouchableHighlight,
  FlatList,
  Image,
  Button,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "../src/environments";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/th";

const CustomerScreen = ({ route }) => {
  const navigation = useNavigation();
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [pickupLocationName, setPickupLocationName] = useState(""); // State for pickup location name
  const [dropoffLocationName, setDropoffLocationName] = useState("");
  // const [reservationStatus, setReservationStatus] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isDateTimeModalVisible, setDateTimeModalVisible] = useState(false);
  //const { bookingType, selectedTime, reservationStatus } = route.params;
  const [reservationStatus, setReservationStatus] = useState(null);

  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const pickupAutocompleteRef = useRef(); // Ref for Pickup Location Autocomplete
  const dropoffAutocompleteRef = useRef(); // Ref for Drop-off Location Autocomplete

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    moment.locale("th");
  }, []);

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (time) {
      const selectedTime = new Date(time);
      setSelectedTime(selectedTime);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  // useEffect(() => {
  //   // Log the received parameters to ensure they are correct
  //   console.log("Booking Type:", bookingType);
  //   console.log("Selected Time:", selectedTime);
  //   console.log("Reservation Status:", reservationStatus);

  //   // You can use these values to update your component state or UI
  // }, [bookingType, selectedTime, reservationStatus]);

  const toggleDateTimeModal = () => {
    setDateTimeModalVisible(!isDateTimeModalVisible);
  };

  const selectDateTime = (dateTime) => {
    setSelectedDateTime(dateTime);
    toggleDateTimeModal();
  };

  const renderDateTimeItem = ({ item }) => (
    <TouchableHighlight
      onPress={() => {
        selectDateTime(item);
        setReservationStatus(item); // Set reservation status when selecting date/time
      }}
      underlayColor="#DDDDDD"
      style={styles.vehicleTypeItem}
    >
      <Text>{item}</Text>
    </TouchableHighlight>
  );

  const reservationStatuses = ["ด่วน", "เหมาเต็มวัน"]; // Add more as needed

  const handleDateTimeSelection = () => {
    // Handle the selected date/time
    // console.log("Selected Date/Time:", selectedDateTime);

    // Format the selected date and time
    const formattedDate = moment(selectedDate).format("LL");
    const formattedTime = moment(selectedTime).format("LT");

    // Combine the date and time into a single string
    const combinedDateTime = `${formattedDate} เวลา: ${formattedTime}`;

    // Check if the selected date and time are different from the existing state
    if (combinedDateTime !== selectedDateTime) {
      // Update the state variable with the selected date and time
      setSelectedDateTime(combinedDateTime);
    }

    // Close the modal
    setDateTimeModalVisible(false);
  };

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectVehicleType = (vehicleType) => {
    setSelectedVehicleType(vehicleType);
    toggleModal();
  };

  const renderVehicleTypeItem = ({ item }) => (
    <TouchableHighlight
      onPress={() => selectVehicleType(item)}
      underlayColor="#DDDDDD"
      style={styles.vehicleTypeItem}
    >
      <Text>{item}</Text>
    </TouchableHighlight>
  );

  const vehicleTypes = ["รถมอเตอร์ไซร์", "รถกะบะ", "รถสามล้อ", "รถบรรทุก"];

  const handleDirections = () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert("ข้อผิดพลาด", "กรุณาเลือกสถานที่รับและส่ง.");
      return;
    }

    if (!selectedVehicleType) {
      Alert.alert("ข้อผิดพลาด", "กรุณาเลือกประเภทรถ.");
      return;
    }

    const directionsURL = `https://www.google.com/maps/dir/?api=1&origin=${pickupLocation.latitude},${pickupLocation.longitude}&destination=${dropoffLocation.latitude},${dropoffLocation.longitude}`;
    Linking.openURL(directionsURL);
  };
  const customerList = () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert("ข้อผิดพลาด", "กรุณาเลือกสถานที่รับและส่ง.");
      return;
    }

    if (!selectedVehicleType) {
      Alert.alert("ข้อผิดพลาด", "กรุณาเลือกประเภทรถ.");
      return;
    }

    if (!selectedDateTime) {
      Alert.alert("ข้อผิดพลาด", "กรุณาเลือกวันที่และเวลาการจอง.");
      return;
    }

    navigation.navigate("CustomerList", {
      pickupLocation,
      dropoffLocation,
      selectedVehicleType,
      reservationStatus,
      selectedDateTime, // Pass selectedDateTime here
    });

    // Reset state
    setPickupLocation(null);
    setDropoffLocation(null);
    setSelectedVehicleType(null);
    setSelectedDateTime(null); // Reset selectedDateTime

    // Clear GooglePlacesAutocomplete fields
    pickupAutocompleteRef.current.clear();
    dropoffAutocompleteRef.current.clear();
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
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="ตำแหน่งปัจจุบัน"
                pinColor="blue" // Set the pin color to red
              />
            )}
            {pickupLocation && (
              <Marker
                coordinate={pickupLocation}
                title="สถานที่รับสินค้า"
                description={pickupLocationName}
              />
            )}
            {dropoffLocation && (
              <Marker
                coordinate={dropoffLocation}
                title="สถานที่จัดส่ง"
                description={dropoffLocationName}
              />
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
                          setPickupLocationName(result.result.name); // Set pickup location name
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
                          setDropoffLocationName(result.result.name); // Set dropoff location name
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
            {pickupLocation && dropoffLocation ? (
              <>
                <TouchableOpacity
                  style={styles.directionsButtonCon}
                  onPress={customerList}
                >
                  <Text style={styles.buttonText}>ยืนยันสถานที่</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.vehicleTypeButton}
                  onPress={toggleModal}
                >
                  <Text style={styles.buttonText}>
                    {selectedVehicleType
                      ? selectedVehicleType
                      : "เลือกประเภทรถ"}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
            style={styles.vehicleTypeButton}
            onPress={handleReservationStatus}
          >
            <Text style={styles.buttonText}>
              {bookingType ? `สถานะการจอง: ${bookingType}` : "เลือกการจอง"}
            </Text>
          </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.vehicleTypeButton}
                  onPress={toggleDateTimeModal}
                >
                  <Text style={styles.buttonText}>
                    {selectedDateTime
                      ? `สถานะการจอง: ${selectedDateTime}`
                      : "เลือกการจอง"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

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
      <Modal animationType="slide" transparent={false} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>เลือกประเภทรถ</Text>
          <FlatList
            data={vehicleTypes}
            renderItem={renderVehicleTypeItem}
            keyExtractor={(item) => item}
          />

          <TouchableHighlight onPress={toggleModal}>
            <Text style={styles.modalCloseButton}>ปิด</Text>
          </TouchableHighlight>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isDateTimeModalVisible}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>เลือกสถานะการจอง</Text>
          <FlatList
            data={reservationStatuses}
            renderItem={renderDateTimeItem}
            keyExtractor={(item) => item}
          />
          <Text style={styles.text1}>
            คุณสามารถกำหนดวันที่และเวลาที่ต้องการขนส่งได้
          </Text>
          <Text style={styles.text}>
            วันที่: {moment(selectedDate).format("LL")} และ เวลา:{" "}
            {moment(selectedTime).format("LT")}
          </Text>

          {/* <TouchableOpacity
            style={styles.vehicleTypeButton}
            onPress={showDatePickerModal}
          >
            <Text style={styles.buttonText}>กดเพื่อเลือกวันที่</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.vehicleTypeButton1}>
            <DateTimePicker
              style={{ marginLeft: -30 }}
              value={selectedDate}
              mode="date"
              onChange={handleDateChange}
              locale="th"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.vehicleTypeButton1}>
            <DateTimePicker
              style={{ marginLeft: -10 }}
              value={selectedTime}
              mode="time"
              is24Hour={true}
              onChange={handleTimeChange}
              locale="th"
            />
          </TouchableOpacity>

          <TouchableHighlight onPress={handleDateTimeSelection}>
            <Text style={styles.modalCloseButton}>ยืนยัน</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookingButton: {
    backgroundColor: "#FFD700", // สีทอง
    padding: 15,
    borderRadius: 10,
  },
  modalContainer: {
    marginBottom: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3498db", // Blue color
    marginTop: 50,
  },
  vehicleTypeItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 20,
    color: "#333",
  },
  modalCloseButton: {
    fontSize: 30,
    color: "#3498db",
    marginTop: 50,
  },
  vehicleTypeButton: {
    backgroundColor: "#00bfff",
    padding: 15,
    borderRadius: 10,
  },
  vehicleTypeButton1: {
    backgroundColor: "#00bfff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
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
  directionsButtonCon: {
    backgroundColor: "#32cd32",
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
  text1: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 30,
  },
});

export default CustomerScreen;
