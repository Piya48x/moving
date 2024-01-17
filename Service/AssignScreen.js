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
import { useNavigation } from "@react-navigation/native";

const vehicleTypes = ["รถมอเตอร์ไซร์", "รถกะบะ", "รถสามล้อ", "รถบรรทุก"];

const AssignScreen = () => {
  const [selectedType, setSelectedType] = useState(vehicleTypes[0]);
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigation = useNavigation();

  const handleAssign = () => {
    // ตรวจสอบว่าทุกช่องถูกกรอกค่าหรือไม่
    if (name && surname && brand && color && licensePlate && phoneNumber) {
      // สร้างชุดข้อมูล
      const data = {
        type: selectedType,
        name,
        surname,
        brand,
        color,
        licensePlate,
        phoneNumber,
      };
      console.log(data);

      //ทำสิ่งที่คุณต้องการกับข้อมูลที่สร้าง เช่นเก็บลง Firebase
      addDoc(collection(db, "users"), data)
        .then(() => {
          //Data saved successfully!
          console.log("Data Submitted");
        })
        .catch((error) => {
          // The write failed
          console.log(error);
        });
      navigation.navigate("EnterOrder");

      // ล้างค่าในช่องกรอกข้อมูลหลังจากบันทึก
      setName("");
      setSurname("");
      setBrand("");
      setColor("");
      setLicensePlate("");
      setPhoneNumber("");
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
              placeholder="ชื่อ"
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="นามสกุล"
              value={surname}
              onChangeText={(text) => setSurname(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="เบอร์โทรศัพท์"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              style={styles.input}
              keyboardType="phone-pad" // Set keyboard type to phone number
            />

            <TextInput
              placeholder="ยี่ห้อรถ เช่น Honda Yamaha zuzuki"
              value={brand}
              onChangeText={(text) => setBrand(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="สีรถ เช่น แดง น้ำเงิน ดำ เหลือง"
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
    backgroundColor: "#f5f5f5", // เปลี่ยนสีพื้นหลังตามที่คุณต้องการ
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "5%", // Use percentage-based margin
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 24,
    marginBottom: -10,
    marginTop: -5, // Adjusted margin
  },
  picker: {
    width: "80%",
    marginBottom: "5%", // Use percentage-based margin
    marginTop: -5,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#0782F9",
    borderWidth: 2,
    marginBottom: "5%", // Use percentage-based margin
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  registerButton: {
    backgroundColor: "#0782F9",
    padding: 20,
    borderRadius: 10,
    marginBottom: "5%", // Use percentage-based margin
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AssignScreen;
