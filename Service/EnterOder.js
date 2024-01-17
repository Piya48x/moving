import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView, // Import ScrollView
} from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import io from "socket.io-client";
import * as Location from "expo-location";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome"; // Assuming you want to use FontAwesome icons
import { GOOGLE_PLACES_API_KEY } from "./apiKeys";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";

const EnterOrder = () => {
  const mapRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [order, setOrder] = useState(null);
  const route = useRoute();
  const [location, setLocation] = useState(null);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sound, setSound] = useState();
  const [isOrderAccepted, setIsOrderAccepted] = useState(false);
  const navigation = useNavigation();
  const [resetScreen, setResetScreen] = useState(false);
  const [countdown, setCountdown] = useState(50);
  const isHandlFeedblackPressedRef = useRef(false);

  useEffect(() => {
    let timer;

    if (isAcceptingOrders && countdown > 0) {
      // Start the countdown if accepting orders and countdown is greater than 0
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      // Cleanup timer on unmount or when countdown reaches 0
      clearInterval(timer);
    };
  }, [isAcceptingOrders, countdown]);

  useEffect(() => {
    if (countdown === 0 && !isHandlFeedblackPressedRef.current) {
      // If countdown reaches 0 and handlFeedblack was not pressed, reset the screen and clear the order
      setOrder(null);
      setIsOrderAccepted(false);
      setResetScreen(true); // Trigger the screen reset
    }
  }, [countdown]);

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
            reservationStatus: newOrder.reservationStatus,
          };

          setOrder(orderWithPlaces);
          setCountdown(40);
          showNotification(orderWithPlaces);
          vibrate();
          Alert.alert(`มีงานใหม่เข้ามา`, `คำสั่งใหม่: ไปลุยกันเลย!`);
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
    if (resetScreen) {
      // Reset the screen by setting the necessary states to their initial values
      setOrder(null);
      setIsOrderAccepted(false);
      setResetScreen(false);
    }
  }, [resetScreen]);

  // Function to show a notification
  const showNotification = async (order) => {
    // Load the sound file
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/mixkit-happy-bells-notification-937.wav") // Adjust the path to your sound file
    );

    // Play the sound
    await sound.playAsync();

    Notifications.scheduleNotificationAsync({
      content: {
        title: "New Order",
        body: `New order from ${order.pickupPlace} to ${order.dropoffPlace}`,
      },
      trigger: null, // Notification is shown immediately
    });
  };

  // Function to vibrate the device
  const vibrate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

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
    handleDirections(order);
  };
  const handlFeedblack = () => {
    if (socket && order && isAcceptingOrders) {
      // User confirmed, proceed with acceptance
      socket.emit("acceptOrder", { orderId: order.id });
      Alert.alert("ยอมรับคำสั่ง", "คุณได้ยอมรับคำสั่งแล้ว!");
      setIsOrderAccepted(true);

      // Clear the reset flag if it was set (countdown was not 0)
      if (resetScreen) {
        setResetScreen(false);
      }

      // Set the ref to true when handlFeedblack is pressed
      isHandlFeedblackPressedRef.current = true;
    }
  };
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/ui_correct_button2-103167.mp3") // เปลี่ยนเป็นที่อยู่ไฟล์เสียงของคุณ
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเล่นเสียง:", error.message);
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
              // socket.emit("driverCanceledOrder", { orderId: order.id });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleCompleteOrder = () => {
    if (socket && order) {
      Alert.alert(
        "เสร็จสิ้นการขนส่ง",
        `คุณแน่ใจหรือไม่ที่จะเสร็จสิ้นการขนส่งของหมายเลข ${order.orderNumber}?`,
        [
          {
            text: "ยกเลิก",
            style: "cancel",
          },
          {
            text: "ใช่",
            onPress: () => {
              socket.emit("acceptOrder", { orderId: order.id });
              Alert.alert("เสร็จสิ้นการขนส่ง", "คุณได้เสร็จสิ้นการขนส่งแล้ว!");
              setResetScreen(true); // Trigger the screen reset
              navigation.navigate("DeliverySV", {
                //orderSummary: order,
              });
              setOrder(null);
              setIsOrderAccepted(false);
              setResetScreen(true); // Trigger the screen reset
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
    // เพิ่มการเล่นเสียงที่นี่
    playSound();
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
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View
        style={{
          backgroundColor: "white",
          shadowColor: "black",
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>สรุปรายการขนส่ง</Text>
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
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="ตำแหน่งปัจจุบันของคุณ.."
                pinColor="green"
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
              <View style={styles.summaryDetails}>
                <Text
                  style={styles.detailText}
                >{`ตำแหน่งรับ:${order.pickupPlace}`}</Text>
                <Text
                  style={styles.detailText}
                >{`ตำแหน่งส่ง: ${order.dropoffPlace}`}</Text>
                <Text
                  style={styles.detailText}
                >{`ระยะทาง: ${order.distance} กิโลเมตร`}</Text>
                <Text
                  style={styles.detailText}
                >{`ประเภทรถ: ${order.selectedVehicleType}`}</Text>
                <Text
                  style={styles.detailText}
                >{`ค่าจัดส่ง: ${order.orderCost} บาท`}</Text>
                <Text
                  style={styles.detailText}
                >{`สถานะการจอง: ${order.selectedDateTime}`}</Text>
                <Text
                  style={styles.detailText}
                >{`หมายเลขคำสั่งซื้อ: ${order.orderNumber}`}</Text>
              </View>
              {isOrderAccepted ? (
                <>
                  <TouchableOpacity
                    style={styles.acceptButton1}
                    onPress={handleAcceptOrder}
                  >
                    <Text style={styles.buttonText}>ดูเส้นทางจุดรับ-ส่ง</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton1}
                    onPress={() => {
                      handleCompleteOrder();
                    }}
                    // onPress={() => {
                    //   if (socket) {
                    //     Alert.alert(
                    //       `ยืนยันการจัดส่ง`,
                    //       `คุณจัดส่งของหมายเลขออเดอร์ ${order.orderNumber} เสร็จเรียบร้อยแล้วใช่ไหม?`,
                    //       [
                    //         {
                    //           text: "ยกเลิก",
                    //           style: "cancel",
                    //         },
                    //         {
                    //           text: "ใช่",
                    //           onPress: () => {
                    //             socket.emit("acceptOrder", {
                    //               orderId: order.id,
                    //             });
                    //             navigation.navigate("DeliverySV", {
                    //               //orderSummary: order,
                    //             });
                    //             // Clear the order data in the current screen
                    //             setOrder(null);
                    //             setIsOrderAccepted(true); // Update the state if needed
                    //           },
                    //         },
                    //       ]
                    //     );
                    //   }
                    // }}
                  >
                    <Text style={styles.buttonText}>เสร็จสิ้นการขนส่ง</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelOrder}
                  >
                    <Text style={styles.buttonText}>ยกเลิกคำสั่ง</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.orderInfo}>
                    {countdown > 0
                      ? `กรุณารับงานภายใน ${countdown} วินาที`
                      : "หมดเวลาการรับงาน"}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      {
                        backgroundColor: isOrderAccepted
                          ? "#40e0d0"
                          : "#27ae60",
                      },
                    ]}
                    onPress={handlFeedblack}
                    disabled={isOrderAccepted || countdown === 0}
                  >
                    <Text style={styles.buttonText}>
                      {isOrderAccepted
                        ? "คุณกำลังอยู่ในการส่งของ.."
                        : "ยอมรับคำสั่ง"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelOrder}
                  >
                    <Text style={styles.buttonText}>ยกเลิกคำสั่ง</Text>
                  </TouchableOpacity>
                </>
              )}
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
          <TouchableOpacity
            onPress={handleToggleSwitch}
            activeOpacity={0.8}
            style={{
              shadowColor: "#008000",
              shadowOpacity: isHovered ? 0.5 : 0,
              shadowRadius: 5,
              elevation: isHovered ? 5 : 0, // Corrected this line
            }}
          >
            <Icon
              name={isAcceptingOrders ? "check-circle" : "check-circle"}
              size={100}
              color={isAcceptingOrders ? "#27ae60" : "#c0c0c0"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  heading: {
    alignItems: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    justifyContent: "center",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 10,
    paddingLeft: 90,
  },
  summaryDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
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
  acceptButton1: {
    backgroundColor: "#0782F9",
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
  cancelButton1: {
    backgroundColor: "#87cefa",
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

export default EnterOrder;
