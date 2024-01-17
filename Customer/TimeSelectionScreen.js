import React, { useState, useEffect } from "react";
import { View, Text, Button, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/th";

const TimeSelectionScreen = ({ navigation }) => {
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

  const handleConfirmTime = () => {
    // Convert the Date object to a serializable string
    const serializedSelectedTime = selectedTime ? selectedTime.toISOString() : null;
  
    // Pass the selected time to the parent component (BookingScreen)
    navigation.navigate("BookingScreen", { selectedTime: serializedSelectedTime });
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>เลือกเวลา</Text>

      <View style={styles.buttonContainer}>
        <Button title="เลือกวันที่" onPress={showDatePickerModal} />
        <Text style={styles.text}>วันที่: {moment(selectedDate).format("LL")}</Text>

        {showDatePicker && (
          <DateTimePicker value={selectedDate} mode="date" onChange={handleDateChange} locale="th" />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="เลือกเวลา" onPress={showTimePickerModal} />
        <Text style={styles.text}>เวลา: {moment(selectedTime).format("LT")}</Text>

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
            locale="th"
          />
        )}
      </View>

      {/* Confirm Time Button */}
      <Button title="ยืนยันเวลา" onPress={handleConfirmTime} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default TimeSelectionScreen;
