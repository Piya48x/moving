import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomerScreen from "./CustomerScreen";
import BookingHistoryScreen from "./Profiles/BookingHistoryScreen";
import ProfileScreen from "./Profiles/ProfileScreen";
import SettingsScreen from "./Profiles/SettingsScreen";
import DrawerContent from "./Profiles/DrawerContent";

const MainCustomer = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0085E6",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen name="เลือกจุดรับ-ส่ง" component={CustomerScreen} />
      {/* <Drawer.Screen name="โปรไฟล์" component={ProfileScreen} />
      <Drawer.Screen name="ประวัติการจอง" component={BookingHistoryScreen} />
      <Drawer.Screen name="ตั้งค่า" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
};

export default MainCustomer;
