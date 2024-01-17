import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";
import * as Location from "expo-location";
import axios from "axios";
import { GOOGLE_PLACES_API_KEY } from "./apiKeys";

const EnterOrder = () => {
  const [socket, setSocket] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [order, setOrder] = useState(null);
  const route = useRoute();

  useEffect(() => {
    // สร้างการเชื่อมต่อ Socket.IO เมื่อ component ถูก mount
    const newSocket = io("http://192.168.1.8:3000");
    setSocket(newSocket);

    // ยกเลิกการเชื่อมต่อ Socket.IO เมื่อ component ถูก unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // ดึงข้อมูลตำแหน่งของคนขับและตั้งค่า state
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "การปฏิเสธการอนุญาต",
            "การอนุญาตในการเข้าถึงตำแหน่งถูกปฏิเสธ"
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setDriverLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("ข้อผิดพลาดในการรับตำแหน่ง:", error);
      }
    };

    getLocation();

    // เมื่อ socket พร้อมใช้งาน, ฟังเหล่านี้เพื่อรับข้อมูลการอัปเดตตำแหน่งและคำสั่งใหม่
    if (socket) {
      socket.on("locationUpdated", (location) => setDriverLocation(location));
      socket.on("newOrder", async (newOrder) => {
        // Include place names in the order data
        const orderWithPlaces = {
          ...newOrder,
          pickupPlace: await getPlaceName(newOrder.pickupLocation),
          dropoffPlace: await getPlaceName(newOrder.dropoffLocation),
        };

        setOrder(orderWithPlaces);
        Alert.alert("คำสั่งใหม่", `คำสั่งใหม่: ${orderWithPlaces.pickupPlace} ถึง ${orderWithPlaces.dropoffPlace}`);
      }, [socket]);
    }

    // ยกเลิกการฟัง socket เมื่อ component ถูก unmount
    return () => {
      if (socket) {
        socket.off("locationUpdated");
        socket.off("newOrder");
      }
    };
  }, [socket]);

  const getPlaceName = async (location) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${'AIzaSyAp5OleyH2H46AGS4kFoPvVu2SDZqCz5nc'}`
      );

      const address = response?.data?.results[0]?.formatted_address;
      return address || "ไม่พบข้อมูลที่อยู่";
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่:", error.message);
      return "ไม่สามารถดึงข้อมูลที่อยู่ได้";
    }
  };

  const handleAcceptOrder = () => {
    navigation.navigate("SummaryPage");
    // ส่งคำสั่งยอมรับไปที่เซิร์ฟเวอร์
    if (socket && order) {
      socket.emit("acceptOrder", { orderId: order.id });
      Alert.alert("ยอมรับคำสั่ง", "คุณได้ยอมรับคำสั่งแล้ว!");

      // Navigate to the summary page
     

      // Call the asynchronous function
      handleDirections(order);
    }
  };

  const handleCancelOrder = () => {
    // ส่งคำสั่งยกเลิกไปที่เซิร์ฟเวอร์
    if (socket && order) {
      socket.emit("cancelOrder", { orderId: order.id });
      Alert.alert("ยกเลิกคำสั่ง", "คุณได้ยกเลิกคำสั่งแล้ว!");
    }
  };

  const handleDirections = (order) => {
    // แสดงเส้นทางใน Google Maps
    showDirections(order.pickupLocation, order.dropoffLocation);
  };

  const showDirections = (pickupLocation, dropoffLocation) => {
    const origin = `${pickupLocation.latitude},${pickupLocation.longitude}`;
    const destination = `${dropoffLocation.latitude},${dropoffLocation.longitude}`;
    const travelMode = "driving";
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;

    // เปิด Google Maps เพื่อแสดงเส้นทาง
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>รับคำสั่ง</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: driverLocation?.latitude || 0,
          longitude: driverLocation?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            title="ตำแหน่งคนขับ"
          />
        )}
        {order && order.pickupLocation && (
          <Marker
            coordinate={{
              latitude: order.pickupLocation.latitude,
              longitude: order.pickupLocation.longitude,
            }}
            title={`ตำแหน่งรับ: ${order.pickupPlace}`}
            pinColor="blue"
          />
        )}
        {order && order.dropoffLocation && (
          <Marker
            coordinate={{
              latitude: order.dropoffLocation.latitude,
              longitude: order.dropoffLocation.longitude,
            }}
            title={`ตำแหน่งส่ง: ${order.dropoffPlace}`}
            pinColor="red"
          />
        )}
      </MapView>
      {order ? (
        <View>
          <View>
            <Text>{`ตำแหน่งรับ: ${order.pickupPlace}`}</Text>
            <Text>{`ตำแหน่งส่ง: ${order.dropoffPlace}`}</Text>
            <Text>{`ระยะทาง: ${order.distance} กิโลเมตร`}</Text>
            <Text>{`ค่าจัดส่ง: ${order.orderCost} บาท`}</Text>
          </View>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptOrder}>
            <Text style={styles.buttonText}>ยอมรับคำสั่ง</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
            <Text style={styles.buttonText}>ยกเลิกคำสั่ง</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.orderInfo}>รอรับคำสั่ง...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  orderInfo: {
    fontSize: 18,
    marginBottom: 16,
  },
  acceptButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
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
});

export default EnterOrder;
