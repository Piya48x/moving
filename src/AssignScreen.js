import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../config/firestore";

const vehicleTypes = ["รถมอเตอร์ไซร์", "รถกะบะ", "รถสามล้อ", "รถบรรทุก"];

const AssignScreen = () => {
  const [selectedType, setSelectedType] = useState(vehicleTypes[0]);
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const handleAssign = () => {
    // ตรวจสอบว่าทุกช่องถูกกรอกค่าหรือไม่
    if (brand && color && licensePlate) {
      // สร้างชุดข้อมูล
      const data = {
        type: selectedType,
        brand,
        color,
        licensePlate,
      };

      //ทำสิ่งที่คุณต้องการกับข้อมูลที่สร้าง เช่นเก็บลง Firebase
      addDoc(collection(db, "users"), {
        selectedType: selectedType,
        brand: brand,
        color: color,
        licensePlate: licensePlate,
      })
        .then(() => {
          //Data saved successfully!
          console.log("Data Submitted");
        })
        .catch((error) => {
          // The write failed
          console.log(error);
        });

      // ล้างค่าในช่องกรอกข้อมูลหลังจากบันทึก
      setBrand("");
      setColor("");
      setLicensePlate("");
      alert("ลงทะเบียนเรียบร้อย");
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={styles.container}
          enabled={true}
          behavior="padding"
        >
          <View style={styles.innerContainer}>
            <Text style={styles.headerText}>
              เลือกลงทะเบียนประเภทรถที่คุณมี
            </Text>
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedType(itemValue)
              }
              style={styles.picker}
            >
              {vehicleTypes.map((type, index) => (
                <Picker.Item label={type} value={type} key={index} />
              ))}
            </Picker>
            <TextInput
              placeholder="ยี่ห้อรถ"
              value={brand}
              onChangeText={(text) => setBrand(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="สีรถ"
              value={color}
              onChangeText={(text) => setColor(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="ทะเบียนรถ"
              value={licensePlate}
              onChangeText={(text) => setLicensePlate(text)}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleAssign}
            >
              <Text style={styles.buttonText}>ลงทะเบียน</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginTop: -100,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: -100,
  },
  picker: {
    width: "80%",
    marginBottom: 10,
    marginTop: -5,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: "#0782F9",
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AssignScreen;
