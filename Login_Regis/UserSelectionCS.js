// UserSelectionCS.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import * as Animatable from "react-native-animatable";

const UserSelectionCS = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth); // ทำการออกจากระบบ
      console.log("Logout successful"); // ล็อกออกจากระบบสำเร็จ
      navigation.navigate("Login");
      alert("ออกจากระบบเรียบร้อย");
    } catch (error) {
      console.error("Logout error:", error); // พิมพ์ข้อผิดพลาด (ถ้ามี)
    }
  };

  // const handleCustomerPress = () => {
  //   // นำทางไปยังหน้าลูกค้าทั่วไป
  //   navigation.navigate('CustomerScreen');
  // };
  const handleCustomerPress = () => {
    // นำทางไปยังหน้าลูกค้าทั่วไป
    navigation.navigate("CustomerProvider");
  };
  // const handleCustomerPress = () => {
  //   // นำทางไปยังหน้าลูกค้าทั่วไป
  //   navigation.navigate('CallOder');
  // };

  // const handleServiceProviderPress = () => {
  //   // นำทางไปยังหน้าผู้ให้บริการ
  //   navigation.navigate('EnterOder');
  // };
  const handleServiceProviderPress = () => {
    // นำทางไปยังหน้าผู้ให้บริการ
    navigation.navigate("ServiceProviderScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" duration={1500} delay={500}>
          <Text style={styles.headerText}>เลือกสถานะของคุณ?</Text>
        </Animatable.Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.customerButton]}
            onPress={handleCustomerPress}
          >
            <Text style={[styles.buttonText, styles.customerButtonText]}>
              ลูกค้าทั่วไป
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.serviceProviderButton]}
            onPress={handleServiceProviderPress}
          >
            <Text style={[styles.buttonText, styles.serviceProviderButtonText]}>
              ผู้ให้บริการ
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginTop: -100
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center", // จัดวางปุ่มตรงกลาง
  },
  button: {
    backgroundColor: "#0782F9",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10, // เพิ่มระยะห่างระหว่างปุ่ม
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  customerButton: {
    backgroundColor: "#0782F9",
  },
  serviceProviderButton: {
    backgroundColor: "#0782F9",
  },
  customerButtonText: {
    color: "white",
    fontWeight: "bold",
    height: "20%",
    marginTop: "80%",
    fontWeight: "700",
    fontSize: 16,
  },
  serviceProviderButtonText: {
    color: "white",
    fontWeight: "bold",
    height: "20%",
    marginTop: "80%",
    fontWeight: "700",
    fontSize: 16,
  },
  signOutButton: {
    color: "#000000",
    backgroundColor: "#0085E6",
    width: "40%",
    marginVertical: 50,
    borderRadius: 10,
    alignItems: "center", // จัดตำแหน่งแนวตั้งตรงกลาง
    height: "8%",
  },
  signOutButtonText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    marginTop: "13%",
  },
  scrollContainer: {
    flexGrow: 1, // ให้ ScrollView ขยายขนาดเต็มหน้าจอ
  },
});

export default UserSelectionCS;
