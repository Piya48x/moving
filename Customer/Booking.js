import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Picker } from 'react-native';

const Booking = () => {
 const [bookingDate, setBookingDate] = useState('');
 const [carType, setCarType] = useState('');

 const bookNow = () => {
    console.log('Booking Now!');
    console.log('Date:', bookingDate);
    console.log('Car Type:', carType);
 };

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking</Text>

      <View style={styles.bookingDetails}>
        <Text style={styles.label}>Booking Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Booking Date"
          onChangeText={setBookingDate}
          value={bookingDate}
        />

        <Text style={styles.label}>Car Type</Text>
        <Picker
          selectedValue={carType}
          onValueChange={(itemValue, itemIndex) => setCarType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Hatchback" value="hatchback" />
          <Picker.Item label="Sedan" value="sedan" />
          <Picker.Item label="SUV" value="suv" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.bookNowButton} onPress={bookNow}>
        <Text style={styles.bookNowText}>Book Now</Text>
      </TouchableOpacity>
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
 },
 title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
 },
 bookingDetails: {
    alignItems: 'flex-start',
 },
 label: {
    fontSize: 18,
    marginBottom: 5,
 },
 input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
 },
 picker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
 },
 bookNowButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
 },
 bookNowText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
 },
});

export default Booking;