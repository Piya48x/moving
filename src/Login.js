import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // เพิ่มฟังก์ชันลืมรหัส
  const handleForgotPassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent to: ", email);
        alert("ส่งอีเมลรีเซ็ตรหัสผ่านเรียบร้อยแล้ว");
      } catch (err) {
        console.log("Password reset error:", err.message);
        alert("เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน");
      }
    } else {
      alert("โปรดป้อนอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน");
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("UserSelectionScreen");
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        console.log("Logged in with: ", user.email);
        alert("เข้าสู่ระบบเรียบร้อย");
      } catch (err) {
        console.log("Login error:", err.message);
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    }
  };

  const handRegister = async () => {
    if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        console.log("Registered with: ", user.email);
        console.log("Register successful");
        alert("สมัครสมาชิกเสร็จสมบูณ์แล้ว");
      } catch (err) {
        console.log("Registration error:", err.message);
        alert("อีเมลนี้ถูกใช้งานแล้ว!");
      }
    }
  };

  const logoImg = require("../image/b.jpg");

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={styles.container}
          enabled={true}
          behavior="padding"
        >
          <View>
            <Image
              source={logoImg}
              style={{ width: 380, height: 230, marginTop: -241 }}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="ios-person"
                size={24}
                color="black"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="อีเมล"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="ios-lock-closed"
                size={24}
                color="black"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="รหัสผ่าน"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.button}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handRegister}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>สมัครสมาชิก</Text>
            </TouchableOpacity>
            <Text
              onPress={handleForgotPassword}
              style={styles.forgotPasswordText}
            >
              ลืมรหัสผ่าน
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#0000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    borderColor: "#0782F9",

    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  scrollContainer: {
    flexGrow: 1, // ให้ ScrollView ขยายขนาดเต็มหน้าจอ
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    borderColor: "#0782F9",
  },

  buttonOutlineText: {
    textAlign: "center",
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  inputContainer: {
    width: "80%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#0782F9",
    marginTop: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  forgotPasswordText: {
    position: 'absolute',
    bottom: -200, // Position it at the bottom
    left: 170, // Position it at the left
    padding: 16, // Add some padding for better touch area
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
    textDecorationLine: 'underline', // Underline the text to indicate it's clickable
  }
  
});
