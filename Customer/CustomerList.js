import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Notifications from "expo-notifications";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import "react-native-get-random-values";

const apiKey = "AIzaSyAp5OleyH2H46AGS4kFoPvVu2SDZqCz5nc";

const CustomerList = ({ route }) => {
  const { pickupLocation, dropoffLocation, selectedVehicleType, reservationStatus, selectedDateTime } = route.params;
  const [distance, setDistance] = useState(null);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [pickupAddress, setPickupAddress] = useState("กำลังโหลด...");
  const [dropoffAddress, setDropoffAddress] = useState("กำลังโหลด...");
  const [cancellationMessage, setCancellationMessage] = useState(null); // Move state declaration here
  const navigation = useNavigation();
  const [isCancellationVisible, setIsCancellationVisible] = useState(true); // Initialize as true to show initially
  const [driverInfo, setDriverInfo] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const mapRef = useRef(null);
  const [selectedDateTimeString, setSelectedDateTimeString] = useState("");


  useEffect(() => {
    const getLocationName = async (latitude, longitude, setAddressFunction) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );

        const address = response?.data?.results[0]?.formatted_address;
        if (address) {
          setAddressFunction(address);
        } else {
          console.error("ไม่สามารถดึงข้อมูลที่อยู่ได้");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่:", error.message);
      }
    };

    const calculateDistance = async () => {
      try {
        await getLocationName(
          pickupLocation.latitude,
          pickupLocation.longitude,
          setPickupAddress
        );
        await getLocationName(
          dropoffLocation.latitude,
          dropoffLocation.longitude,
          setDropoffAddress
        );

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${pickupLocation.latitude},${pickupLocation.longitude}&destinations=${dropoffLocation.latitude},${dropoffLocation.longitude}&key=${apiKey}`
        );

        const distanceValue =
          response?.data?.rows[0]?.elements[0]?.distance?.value;
        if (distanceValue) {
          const distanceInKm = distanceValue / 1000;
          setDistance(distanceInKm);

          // ดึงข้อมูลพิกัดและกำหนดค่าให้กับ polylineCoordinates
          const polylineResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLocation.latitude},${pickupLocation.longitude}&destination=${dropoffLocation.latitude},${dropoffLocation.longitude}&key=${apiKey}`
          );

          const points =
            polylineResponse?.data?.routes[0]?.overview_polyline?.points;
          if (points) {
            const polylineCoords = decodePolyline(points);
            setPolylineCoordinates(polylineCoords);
          }
        } else {
          console.error("ไม่สามารถดึงข้อมูลระยะทางได้");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการคำนวณระยะทาง:", error.message);
      }
    };

    const generateOrderNumber = () => {
      setSelectedDateTimeString(selectedDateTime.toString())
      //การประทับเวลา % 1000
      //ช่วยให้มั่นใจได้ว่าจะพิจารณาเฉพาะตัวเลข 3 หลักสุดท้ายเท่านั้น
      //และ padStart(3, //'0') ใช้เพื่อปัดตัวเลขด้วยเลขศูนย์นำหน้าหากมีตัวเลขน้อยกว่า 3 หลัก ด้วยวิธีนี้
      //คุณจะได้รับหมายเลขคำสั่งซื้อ 3 หลักเสมอ
      const timestamp = Date.now() % 1000; // Take the last 3 digits of the current timestamp
      const newOrderNumber = `CS-${timestamp.toString().padStart(3, "0")}`;
      setOrderNumber(newOrderNumber);
    };

    calculateDistance();
    generateOrderNumber(); // Call the function to generate order number
  }, [pickupLocation, dropoffLocation, apiKey]);

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  const calculateShippingCost = () => {
    if (distance) {
      const shippingCost = distance * 18;
      return shippingCost.toFixed(2);
    }
    return "ไม่สามารถคำนวณราคาได้";
  };

  const handleCancelMessageVisibility = () => {
    setIsCancellationVisible(false);
  };

  const followDirver = () => {
    navigation.navigate("FollowDirver", {
      //orderSummary: order,
    });
  };

  const totalCost = parseFloat(calculateShippingCost()).toFixed(2);

  const socket = io("http://192.168.1.8:3000"); // แทนที่ YOUR_SOCKET_SERVER_URL ด้วย URL ของเซิร์ฟเวอร์ Socket.IO

  useEffect(() => {
    if (socket) {
      // Listen for cancellation events
      socket.on("driverCanceledOrder", ({ orderId }) => {
        setCancellationMessage(`คำสั่งถูกยกเลิกโดยคนขับแล้ว!`);
        setIsCancellationVisible(true);
        console.log(orderId);
        // Additional logic or actions on order cancellation
        // You can customize this function based on your requirements
        // For example, show an alert, update UI, etc.
        Alert.alert("คำสั่งซื้อถูกยกเลิก", `คำสั่งถูกยกเลิกโดยคนขับแล้ว.`);
      });
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("driverCanceledOrder");
      }
    };
  }, [socket]);

  useEffect(() => {
    const handleFeedBlackOrder = ({ orderId }) => {
      console.log("Order Accepted:", orderId);

      // Check the order count and show different alerts
      if (orderCount === 0) {
        followDirver();
      } else if (orderCount === 1) {
        navigation.navigate("DeliveryCUS");
      }

      // Increment the order count
      setOrderCount((prevCount) => prevCount + 1);
    };

    // Listen for orderAcceptedNotification event from the server
    socket.on("feedBlackOrder", handleFeedBlackOrder);

    // Cleanup the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("feedBlackOrder", handleFeedBlackOrder);
      }
    };
  }, [socket, orderCount]);

  useEffect(() => {
    const confirmDelivery = async () => {
      if (socket) {
        const orderData = {
          pickupLocation,
          dropoffLocation,
          distance,
          orderCost: totalCost,
          selectedVehicleType,
          selectedDateTime: selectedDateTimeString, // ส่ง selectedDateTimeString แทน selectedDateTime
          orderNumber,
          reservationStatus,
        };
    
        socket.emit("sendOrder", orderData);
    
        setIsConfirming(true);
    
        await new Promise((resolve) => setTimeout(resolve, 10000));
    
        setIsConfirming(false);
    
        if (!driverInfo) {
          // Display an alert after 10 seconds if no driver is found
          // Alert.alert("ไม่พบคนขับรถขนส่งในขณะนี้", "โปรดลองอีกครั้ง..");
        }
      }
    };
    
  if (isConfirming) {
    confirmDelivery();
  }
}, [isConfirming, driverInfo]);

const handleConfirmDelivery = () => {
  // Set the button to a loading state
  setIsConfirming(true);
};

const data = [
  { label: "ตำแหน่งรับสินค้า : ", value: pickupAddress },
  { label: "ตำแหน่งจัดส่ง : ", value: dropoffAddress },
  { label: "ระยะทาง", value: `${distance || "กำลังคำนวณ..."} กม.` },
  {
    label: "ประเภทรถ",
    value: selectedVehicleType ? selectedVehicleType : "ยังไม่ได้เลือก",
  },
  {
    label: "ค่าจัดส่ง",
    value: `${calculateShippingCost().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท`,
  },
  { label: "สถานะการจอง : ", value: selectedDateTime ? selectedDateTime : "ยังไม่ได้เลือก" },
  { label: "หมายเลขคำสั่ง: ", value: orderNumber },
];


  return (
    <View style={styles.container}>
      {driverInfo && (
        <View style={styles.driverInfoContainer}>
          <Text style={styles.driverInfo}>Driver Information:</Text>
          <Text>{`Name: ${driverInfo.name}`}</Text>
          <Text>{`Vehicle: ${driverInfo.vehicleType}`}</Text>
          {/* Add any other driver information you want to display */}
        </View>
      )}
      <Text style={styles.heading}>สรุปคำสั่งซื้อ</Text>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: (pickupLocation.latitude + dropoffLocation.latitude) / 2,
          longitude: (pickupLocation.longitude + dropoffLocation.longitude) / 2,
          latitudeDelta:
            Math.abs(pickupLocation.latitude - dropoffLocation.latitude) * 1.5,
          longitudeDelta:
            Math.abs(pickupLocation.longitude - dropoffLocation.longitude) *
            1.5,
        }}
      >
        {pickupLocation && (
          <Marker coordinate={pickupLocation} title="ตำแหน่งรับสินค้า" />
        )}
        {dropoffLocation && (
          <Marker coordinate={dropoffLocation} title="ตำแหน่งจัดส่ง" />
        )}
        {polylineCoordinates.length > 0 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#3498db"
            strokeWidth={3}
          />
        )}
      </MapView>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Text style={styles.totalCost}>
        รวมทั้งสิ้น: {totalCost.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
      </Text>
      <TouchableOpacity
        style={[
          styles.confirmButton,
          isConfirming && styles.confirmButtonLoading,
        ]}
        onPress={handleConfirmDelivery}
        disabled={isConfirming}
      >
        <Text style={styles.buttonText}>
          {isConfirming ? 'กำลังค้นหารถขนส่ง...' : 'ยืนยันการส่งสินค้า'}
        </Text>
      </TouchableOpacity>
      {isCancellationVisible && cancellationMessage && (
        <View style={styles.cancellationMessageContainer}>
          <Text
            style={styles.cancellationMessage}
            onPress={handleCancelMessageVisibility}
          >
            {cancellationMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cancellationMessageContainer: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  orderNumber: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  cancellationMessage: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  map: {
    flex: 1,
    marginBottom: 16,
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
  totalCost: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#0782F9",
    padding: 15,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  confirmButtonLoading: {
    backgroundColor: '#3498db', // Change the color to your loading state color
    opacity: 0.7, // You can adjust the opacity to visually indicate the loading state
  },
});

export default CustomerList;
