import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import io from "socket.io-client";
import * as Location from "expo-location";
import axios from "axios";
import SwitchToggle from "react-native-switch-toggle";
import Icon from "react-native-vector-icons/FontAwesome"; // Assuming you want to use FontAwesome icons
import { GOOGLE_PLACES_API_KEY } from "./apiKeys";
import * as Animatable from "react-native-animatable";

const SummaryPage  = () => {
  const mapRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [order, setOrder] = useState(null);
  const route = useRoute();
  const [location, setLocation] = useState(null);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
   const navigation = useNavigation();

  // Simulate some async task (e.g., fetching orders)
  useEffect(() => {
    const fetchData = async () => {
      // Simulate fetching data
      setIsAcceptingOrders(true);

      // Simulate some delay (you can replace this with your actual data fetching logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsAcceptingOrders(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // สร้างการเชื่อมต่อ Socket.IO เมื่อ component ถูก mount
    const newSocket = io("http://192.168.1.8:3000");

    const handleCancelOrder = () => {
      if (socket && order) {
        socket.emit("cancelOrder", { orderId: order.id });
        Alert.alert("ยกเลิกคำสั่ง", "คุณได้ยกเลิกคำสั่งแล้ว!");
        setOrder(null);

        // Emit an event to notify CustomerList about the canceled order
        socket.emit("driverCanceledOrder", { orderId: order.id });
      }
    };

    setSocket(newSocket);

    // ยกเลิกการเชื่อมต่อ Socket.IO เมื่อ component ถูก unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

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

    // เมื่อ socket พร้อมใช้งาน, ฟังเหล่านี้เพื่อรับข้อมูลการอัปเดตตำแหน่งและคำสั่งใหม่
    if (socket) {
      socket.on("locationUpdated", (location) => setDriverLocation(location));
      socket.on("newOrder", async (newOrder) => {
        if (isAcceptingOrders) {
          // ประมวลผลการแจ้งเตือนเฉพาะในกรณีที่คนขับยอมรับคำสั่งซื้อในปัจจุบันเท่านั้น
          // รวมชื่อสถานที่ในข้อมูลคำสั่งซื้อ
          const orderWithPlaces = {
            ...newOrder,
            pickupPlace: await getPlaceName(newOrder.pickupLocation),
            dropoffPlace: await getPlaceName(newOrder.dropoffLocation),
          };

          setOrder(orderWithPlaces);
          Alert.alert(
            "คำสั่งใหม่",
            `คำสั่งใหม่: ${orderWithPlaces.pickupPlace} ถึง ${orderWithPlaces.dropoffPlace}`
          );
        }
      });
    }

    // ยกเลิกการฟัง socket เมื่อ component ถูก unmount
    return () => {
      if (socket) {
        socket.off("locationUpdated");
        socket.off("newOrder");
      }
    };
  }, [socket, isAcceptingOrders]);

  useEffect(() => {
    // Listen for driver cancellation events
    const handleDriverCanceledOrder = ({ orderId }) => {
      if (isAcceptingOrders) {
        // Only process notifications if the driver is currently accepting orders
        // Alert.alert("คำสั่งซื้อถูกยกเลิก", `คำสั่ง ${orderId} ถูกยกเลิกโดยคนขับแล้ว.`);
        // You can also trigger any other action or update UI as needed
      }
    };

    if (socket) {
      socket.on("driverCanceledOrder", handleDriverCanceledOrder);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("driverCanceledOrder", handleDriverCanceledOrder);
      }
    };
  }, [socket, isAcceptingOrders]);

  const getPlaceName = async (location) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_PLACES_API_KEY}`
      );

      const address = response?.data?.results[0]?.formatted_address;
      return address || "ไม่พบข้อมูลที่อยู่";
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่:", error.message);
      return "ไม่สามารถดึงข้อมูลที่อยู่ได้";
    }
  };

  const handleAcceptOrder = () => {
    // Check if the driver is accepting orders before proceeding
    if (socket && order && isAcceptingOrders) {
      socket.emit("acceptOrder", { orderId: order.id });
      Alert.alert("ยอมรับคำสั่ง", "คุณได้ยอมรับคำสั่งแล้ว!");

      // Call the asynchronous function
      handleDirections(order);
    }
  };

  const handleCancelOrder = () => {
    if (socket && order) {
      // Show a confirmation alert
      Alert.alert(
        "ยกเลิกคำสั่ง",
        "คุณแน่ใจหรือไม่ที่จะยกเลิกคำสั่งนี้?",
        [
          {
            text: "ยกเลิก",
            style: "cancel",
          },
          {
            text: "ใช่",
            onPress: () => {
              // User confirmed, proceed with cancellation
              socket.emit("cancelOrder", { orderId: order.id });
              Alert.alert("ยกเลิกคำสั่ง", "คุณได้ยกเลิกคำสั่งแล้ว!");

              // Clear the order data in the current screen
              setOrder(null);

              // Emit an event to notify CustomerList about the canceled order
              socket.emit("driverCanceledOrder", { orderId: order.id });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  // Add this function to handle the toggle switch
  const handleToggleSwitch = () => {
    setIsAcceptingOrders(!isAcceptingOrders);
    setIsHovered(!isHovered);
    // You can also send a socket event to update the server about the driver's status
    if (socket) {
      socket.emit("updateDriverStatus", {
        acceptingOrders: !isAcceptingOrders,
      });
    }
  };

  // Add a new state to manage whether to process socket events
  const [processSocketEvents, setProcessSocketEvents] = useState(true);

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
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          order
            ? {
                latitude:
                  (order.pickupLocation.latitude +
                    order.dropoffLocation.latitude) /
                  2,
                longitude:
                  (order.pickupLocation.longitude +
                    order.dropoffLocation.longitude) /
                  2,
                latitudeDelta:
                  Math.abs(
                    order.pickupLocation.latitude -
                      order.dropoffLocation.latitude
                  ) * 2,
                longitudeDelta:
                  Math.abs(
                    order.pickupLocation.longitude -
                      order.dropoffLocation.longitude
                  ) * 2,
              }
            : location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : null
        }
      >
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            title="Driver's Location"
          />
        )}
        {order && order.pickupLocation && (
          <Marker
            coordinate={{
              latitude: order.pickupLocation.latitude,
              longitude: order.pickupLocation.longitude,
            }}
            title={`Pickup Location: ${order.pickupPlace}`}
            pinColor="blue"
          />
        )}
        {order && order.dropoffLocation && (
          <Marker
            coordinate={{
              latitude: order.dropoffLocation.latitude,
              longitude: order.dropoffLocation.longitude,
            }}
            title={`Dropoff Location: ${order.dropoffPlace}`}
            pinColor="red"
          />
        )}

        {order && order.pickupLocation && order.dropoffLocation && (
          <Polyline
            coordinates={[
              {
                latitude: order.pickupLocation.latitude,
                longitude: order.pickupLocation.longitude,
              },
              {
                latitude: order.dropoffLocation.latitude,
                longitude: order.dropoffLocation.longitude,
              },
            ]}
            strokeWidth={3}
            strokeColor="blue"
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
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAcceptOrder}
          >
            <Text style={styles.buttonText}>ยอมรับคำสั่ง</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <Text style={styles.buttonText}>ยกเลิกคำสั่ง</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Animatable.Text
            style={styles.orderInfo}
            animation={isAcceptingOrders ? "fadeInUp" : "fadeOutDown"}
            duration={1000}
          >
            {isAcceptingOrders ? "กำลังค้นหาออเดอร์..." : "ปิดรับออเดอร์."}
          </Animatable.Text>
        </View>
      )}

      {/* <SwitchToggle
        containerStyle={styles.switchContainer}
        circleStyle={styles.powerButtonCircle}
        switchOn={isAcceptingOrders}
        backgroundColorOn="#27ae60"
        backgroundColorOff="#e74c3c"
        circleColorOff="white"
        circleColorOn="white"
        duration={300}
      /> */}
      <TouchableOpacity
        onPress={handleToggleSwitch}
        activeOpacity={0.8} // Set the opacity when pressed
        style={{
          shadowColor: "#008000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: isHovered ? 0.5 : 0, // Adjust the shadow opacity based on hover state
          shadowRadius: 6,
          elevation: isHovered ? 5 : 0, // Adjust the elevation based on hover state
        }}
      >
        <Icon
          name={isAcceptingOrders ? "check-circle" : "times-circle"}
          size={100}
          color={isAcceptingOrders ? "#27ae60" : "#e74c3c"}
        />
      </TouchableOpacity>
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
  switchContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 5,
    marginVertical: 10,
  },
  switchCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  powerButtonCircle: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0782F9", // Set to "transparent" to hide the switch background
  },
});

export default SummaryPage;
