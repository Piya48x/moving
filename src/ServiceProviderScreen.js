import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterVehicleTypeScreen = () => {
    const navigation = useNavigation()

    const AssignData = () => {
        // นำทางไปยังหน้าลูกค้าทั่วไป
        navigation.navigate('AssignScreen');
      };

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>เลือกลงทะเบียนประเภทรถที่คุณมี</Text>
        <View style={styles.centerContent}>
          <TouchableOpacity style={styles.registerButton} onPress={AssignData}>
            <Text style={styles.buttonText}>ลงทะเบียน</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5', // เปลี่ยนสีพื้นหลังตามที่คุณต้องการ
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    registerButton: {
      backgroundColor: '#0782F9', // สีของปุ่มลงทะเบียน
      padding: 50, // ปรับขนาดของปุ่มตามที่คุณต้องการ
      width: 240,
      borderRadius: 10, // ปรับขนาดขอบปุ่ม
      textAlign: 'center',
      marginTop: -180
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18, // ปรับขนาดตัวอักษรของข้อความบนปุ่ม
      textAlign: 'center',
    },
    headerText: {
      fontSize: 24,
      marginBottom: 20,
      marginTop: 20,
    },
  });
  

export default RegisterVehicleTypeScreen;
