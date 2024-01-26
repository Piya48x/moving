import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const handRegister = async () => {
    console.log({
      email,
      password,
      confirmPassword,
    });
    if (email && password && confirmPassword) {
      try {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password,
          confirmPassword
        );
        const user = auth.currentUser;
        console.log("Registered with: ", user.email);
        console.log("Register successful");
        alert("สมัครสมาชิกเสร็จสมบูณ์แล้ว");

        navigation.navigate('UserSelectionCS'); 
      } catch (err) {
        console.log("Registration error:", err.message);
        alert("อีเมลนี้ถูกใช้งานแล้ว!");
      }
    } else {
      alert("กรุณากรอกอีเมล, รหัสผ่าน และยืนยันรหัสผ่าน");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Feather
            name="mail"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather
            name="lock"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Feather
            name="lock"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={toggleShowConfirmPassword}>
            <Feather
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handRegister}>
          <Text style={styles.buttonText}>Register</Text>
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
    backgroundColor: "#ffffff",
    padding: 16,
    marginTop: -250
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  formContainer: {
    width: "100%",
   
  },
  input: {
    height: 40,
    borderColor: "#0782F9",
    borderWidth: 0,
    borderRadius: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    flex: 1,
  },
  button: {
    backgroundColor: "#0782F9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#0782F9",
    marginTop: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
});

export default RegisterScreen;
