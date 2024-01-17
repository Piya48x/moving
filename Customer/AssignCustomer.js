import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firestore";

const AssignCustomer = () => {
  const navigation = useNavigation();

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSaveCustomer = async () => {
    if (customerName && address && phoneNumber && email) {
      // Create data object
      const data = {
        customerName,
        address,
        phoneNumber,
        email,
      };

      try {
        // Save data to Firebase
        const docRef = await addDoc(collection(db, "customers"), data);

        // Log the ID of the added document
        console.log("Document written with ID: ", docRef.id);

        // Clear input fields after successful save
        setCustomerName("");
        setAddress("");
        setPhoneNumber("");
        setEmail("");

        // Navigate to another screen after save
        navigation.navigate("CustomerScreen");

        // Show success alert
        alert("ลงทะเบียนเรียบร้อย");
      } catch (error) {
        // Handle error
        console.log("Error saving data:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } else {
      // Alert user to fill in all fields
      alert("กรุณากรอกข้อมูลในทุกช่อง");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>กรอกข้อมูลทั่วไปของคุณ</Text>
          <TextInput
            style={styles.input}
            placeholder="ชื่อ"
            value={customerName}
            onChangeText={(text) => setCustomerName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="ที่อยู่"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="หมายเลขโทรศัพท์"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="อีเมล"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveCustomer}
          >
            <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    maxWidth: 300,
    marginTop: -100,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: 280,
    height: 40,
    borderColor: "#0782F9",
    borderWidth: 2,
    marginBottom: "5%",
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#0782F9",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default AssignCustomer;