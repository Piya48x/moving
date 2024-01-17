import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const RegisterVehicleTypeScreen = () => {
  const navigation = useNavigation();

  const AssignData = () => {
    // Navigate to the registration screen
    navigation.navigate("AssignScreen");
  };

  const handleStartJob = () => {
    // Display an alert indicating successful registration
    Alert.alert("ลงทะเบียนเรียบร้อย", "คุณสามารถเริ่มงานได้แล้ว");

    // Navigate to the EnterOrder screen after the alert
    navigation.navigate('EnterOrder');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>เลือกลงทะเบียนประเภทรถที่คุณมี</Text>
      {/* <Text style={styles.headerText1}>ประกาศ</Text>
      <Text>
        หากคุณเคยลงทะเบียนไว้
      </Text>
      <Text>เรียบร้อยแล้วสามารถกดปุ่มเริ่มงานได้เลย</Text> */}
      <View style={styles.centerContent}>
        <TouchableOpacity style={styles.registerButton} onPress={AssignData}>
          <Text style={styles.buttonText}>ลงทะเบียน</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.startJobButton} onPress={handleStartJob}>
          <Text style={styles.buttonText}>เริ่มงานได้ไปกันเลย!</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  startJobButton: {
    backgroundColor: "#32cd32",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
   
  },
  registerButton: {
    backgroundColor: "#0782F9",
    paddingVertical: 40,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginTop: -200,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
  },
  headerText1: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterVehicleTypeScreen;
