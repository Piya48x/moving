import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import moment from "moment";
import "moment/locale/th"; // Import the Thai locale

const BookingScreen = ({ navigation, route }) => {
  const [bookingType, setBookingType] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    // Check if the route params contain selectedTime
    if (route.params?.selectedTime) {
      // Convert the string representation back to a Date object
      setSelectedTime(new Date(route.params.selectedTime));
    }
  }, [route.params]);

  

  const handleBookingConfirmation = () => {
    if (!bookingType) {
      alert("กรุณาเลือกวิธีการจองเวลา");
      return;
    }
  
    // Convert the Date object to a serializable string if selectedTime is defined
    const serializedSelectedTime = selectedTime
      ? selectedTime.toISOString()
      : null;
  
    // Check if booking type is "ด่วน" or "เหมาเต็มวัน" and navigate to CustomerScreen
    if (bookingType === "ด่วน" || bookingType === "เหมาเต็มวัน") {
      navigation.navigate("CustomerScreen", {
        bookingType,
        selectedTime: serializedSelectedTime,
      });
    } else {
      // Handle other booking types or navigate to a different screen if needed
      alert("Booking type not supported for direct confirmation");
    }
  };

  const navigateToBooking = () => {
    navigation.navigate("CustomerScreen", {
      bookingType,
      selectedTime: selectedTime ? selectedTime.toISOString() : null,
    });
  };

  const handleTimeSelection = () => {
    // นำทางไปยังหน้า TimeSelectionScreen
    navigation.navigate("TimeSelectionScreen", {
      onTimeSelected: (time) => {
        // Set the selected time in the state
        setSelectedTime(time);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เลือกวิธีการจอง</Text>

      {selectedTime && (
        <TouchableHighlight style={styles.selectedTimeHighlight}>
          <Text style={styles.selectedTimeText}>
            {bookingType === "ด่วน" || bookingType === "เหมาเต็มวัน"
              ? `คุณเลือก: ${
                  typeof selectedTime === "string"
                    ? selectedTime
                    : moment(selectedTime).format("LLLL")
                }`
              : `คุณเลือก: ${moment(selectedTime).format("LLLL")}`}
          </Text>
        </TouchableHighlight>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setBookingType("ด่วน");
            setSelectedTime("ตอนนี้");
          }}
          style={[styles.bookingButton, styles.urgentButton]}
        >
          <Text style={styles.buttonText}>จองเวลาด่วน</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bookingButton, styles.fullDayButton]}
          onPress={() => {
            setBookingType("เหมาเต็มวัน");
            setSelectedTime("เต็มวัน");
          }}
        >
          <Text style={styles.buttonText}>จองเวลาเหมาเต็มวัน</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.confirmButton1}
        onPress={handleTimeSelection}
      >
        <Text style={styles.buttonText}>จองเวลาล้วงหน้า</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleBookingConfirmation}
      >
        <Text style={styles.buttonText}>ยืนยัน</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookingButton}
        onPress={navigateToBooking}
      >
        <Text style={styles.buttonText}>จองเวลา: {bookingType}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginTop: -110,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", // ปรับขนาด buttonContainer ให้ไม่เต็ม screen
  },
  bookingButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: 245,
  },
  confirmButton: {
    backgroundColor: "#0782F9", // สีฟ้า
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
  },
  confirmButton1: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: 320,
    height: 100,
    justifyContent: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  selectedTimeHighlight: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "yellow",
    borderRadius: 5,
    marginBottom: 20,
  },
  selectedTimeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  urgentButton: {
    backgroundColor: "red",
  },
  fullDayButton: {
    backgroundColor: "green",
  },
});

export default BookingScreen;
