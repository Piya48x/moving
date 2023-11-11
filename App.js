import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Login';
import Home1 from './src/Home1';
import UserSelectionScreen from './src/UserSelectionScreen';
import ServiceProviderScreen from './src/ServiceProviderScreen'
import AssignScreen from './src/AssignScreen'
import CustomerScreen from './src/CustomerScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0085E6'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
        
    >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }} // กำหนดชื่อของหน้า Login เป็น 'Login'
        />
        <Stack.Screen
          name="Home1"
          component={Home1}
          options={{ title: 'Home' }} // กำหนดชื่อของหน้า Home1 เป็น 'Home'
        />
        <Stack.Screen
          name="UserSelectionScreen"
          component={UserSelectionScreen}
          options={{ title: 'Service' }} // กำหนดชื่อของหน้า Home1 เป็น 'Home'
        />
        <Stack.Screen
          name="ServiceProviderScreen"
          component={ServiceProviderScreen}
          options={{ title: 'Service' }} // กำหนดชื่อของหน้า Home1 เป็น 'Home'
        />
        <Stack.Screen
          name="AssignScreen"
          component={AssignScreen}
          options={{ title: 'Service' }} // กำหนดชื่อของหน้า Home1 เป็น 'Home'
        />
        <Stack.Screen
          name="CustomerScreen"
          component={CustomerScreen}
          options={{ title: 'Customer' }} // กำหนดชื่อของหน้า Home1 เป็น 'Home'
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default App;
