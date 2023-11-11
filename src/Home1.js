import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";

const Home1 = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth); // ทำการออกจากระบบ
      console.log("Logout successful"); // ล็อกออกจากระบบสำเร็จ
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error); // พิมพ์ข้อผิดพลาด (ถ้ามี)
    }
  };

  // const handleLogin = async ()=>{
  //   if(email && password){
  //     try{
  //       await signOut();
  //       await then(() => {
  //         navigation.replace('Login')
  //       })

  //     }catch(err){
  //       console.log('got error: ', alert(err.message));
  //     }
  //   }
  // }

  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import { auth } from '../config/firebase'
// import { useNavigation } from '@react-navigation/native'
// import { signOut } from 'firebase/auth'

// const Home1 = () => {

//   const navigation = useNavigation()

//   const handleSignOut = async ()=>{
//     if(email && password){
//       try{
//         await signOut();
//         await then(userCredentials =>{
//           const user = userCredentials.user;
//           console.log('Logged in with: ', user.email)
// ;        })

//       }catch(err){
//         console.log('got error: ', err.message);
//       }
//     }
//   }

//   return (
//     <View style={styles.contaier}>
//       <Text>Email: {auth.currentUser?.email} </Text>
//       <TouchableOpacity
//       onPress={handleSignOut}
//         style={styles.button}
//       >
//          <Text style={styles.buttonText}>Sign out</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default Home1

// const styles = StyleSheet.create({
//   contaier: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   button: {
//     textAlign: 'center',
//     color: 'white',
//     fontWeight: '700',
//     fontSize: 16,
//     backgroundColor: '#0782F9',
//     width: '60%',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 40,

//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: '700',
//     fontSize: 16,
//   },
// })
