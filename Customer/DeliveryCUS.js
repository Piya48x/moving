import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firestore";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

const DeliveryCUS = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const orderSummary = route.params?.orderSummary || null;

  useEffect(() => {
    if (orderSummary) {
      // Save order summary data to Firebase
      saveOrderSummaryToFirebase(orderSummary);
      // Show notification and play haptic feedback
      showNotificationAndHapticFeedback();
      // Play applause sound
    }
  }, [orderSummary]);

  // Function to save order summary to Firebase
  const saveOrderSummaryToFirebase = async (orderSummary) => {
    try {
      const ordersCollection = collection(db, "orders");
      await addDoc(ordersCollection, orderSummary);
      console.log("Order summary saved to Firebase:", orderSummary);
    } catch (error) {
      console.error("Error saving order summary to Firebase:", error.message);
    }
  };

  // Function to show notification and play haptic feedback
  const showNotificationAndHapticFeedback = async () => {
    // Display a notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Order Completed!",
        body: "การขนส่งได้เสร็จสิ้นลงแล้ว!",
      },
      trigger: null, // Trigger immediately
    });

    // Play haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const playApplauseSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/013.mp3")
      );
      await sound.playAsync();

      // Stop the sound after 10 seconds
      setTimeout(async () => {
        await sound.stopAsync();
      }, 15000); // 10000 milliseconds = 10 seconds
    } catch (error) {
      console.error("Error playing applause sound:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="bounce" style={styles.icon}>
        <LottieView
          source={require("../assets/Animation - 1704610948855.json")}
          autoPlay
          loop={true}
          style={styles.lottie}
        />
      </Animatable.View>

      <TouchableOpacity onPress={playApplauseSound}>
        <Animatable.View animation="fadeIn" delay={500}>
          <LottieView
            source={require("../assets/03.json")}
            autoPlay
            loop={true}
            style={styles.lottie1}
          />
        </Animatable.View>
      </TouchableOpacity>
      <TouchableOpacity
       
      >
        <Animatable.Text animation="fadeIn" style={styles.heading}>
          การขนส่งได้เสร็จสิ้นลงแล้ว!
        </Animatable.Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // Animation has finished, navigate to another screen
          navigation.navigate("CustomerScreen");
        }}
      >
        <View style={styles.completeButton}>
          <Animatable.Text animation="fadeIn" style={styles.completeButtonText}>
            เสร็จสิ้น
          </Animatable.Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginTop: -18,
  },
  icon: {
    marginTop: -90,
  },
  lottie: {
    width: 350,
    height: 350,
  },
  lottie1: {
    width: 500,
    height: 500,
    marginBottom: -205,
    marginTop: -180,
  },
  // Style for the "เสร็จสิ้น" button
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 70,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DeliveryCUS;
