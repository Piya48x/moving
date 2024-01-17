import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client"; // Correct import statement

const ReceiveOrderScreen = ({ route }) => {
  const { pickupLocation } = route.params;

  const [isOnline, setIsOnline] = useState(false);
  const [order, setOrder] = useState(null);

  const socket = io("http://192.168.1.8:3000"); // Replace with your socket server URL

  const handleGoOnline = () => {
    setIsOnline(true);
    // Emit an event to the server indicating that the driver is online
    socket.emit("driverOnline");
  };

  const handleGoOffline = () => {
    setIsOnline(false);
    setOrder(null); // Clear the current order
    // Emit an event to the server indicating that the driver is offline
    socket.emit("driverOffline");
  };

  // Listen for incoming orders from the server
  socket.on("newOrder", (newOrder) => {
    setOrder(newOrder);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Receive Order</Text>
      <MapView
        style={styles.map}
        region={{
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
          }}
          title="Pickup Location"
        />
      </MapView>
      {isOnline ? (
        <>
          <Text style={styles.orderInfo}>
            {order ? `New Order: ${order.pickupLocation}` : "Waiting for orders..."}
          </Text>
          <TouchableOpacity style={styles.offlineButton} onPress={handleGoOffline}>
            <Text style={styles.buttonText}>Go Offline</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.onlineButton} onPress={handleGoOnline}>
          <Text style={styles.buttonText}>Go Online</Text>
        </TouchableOpacity>
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
  onlineButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: "80%",
  },
  offlineButton: {
    backgroundColor: "#FF0000",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  orderInfo: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});

export default ReceiveOrderScreen;
