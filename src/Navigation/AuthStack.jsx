import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Login from '../Screens/AuthScreens/Login';
import LoginWithOtp from '../Screens/AuthScreens/LoginWithOtp';
import Register from '../Screens/AuthScreens/Register';
import LoginSuccessfull from '../Screens/AuthScreens/LoginSuccessfull';
import RegisterSuccessfull from '../Screens/AuthScreens/RegisterSuccessfull';
import StartupScreen from '../Screens/AuthScreens/StartupScreen';
import RegisterDetails from '../Screens/AuthScreens/RegisterDetails';
import RegisterWithOtp from '../Screens/AuthScreens/RegisterWithOtp';
import Home from '../Screens/AuthScreens/Home';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="startup" component={StartupScreen} /> */}
      <Stack.Screen name="registerdetails" component={RegisterDetails} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="loginotp" component={LoginWithOtp} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="registerotp" component={RegisterWithOtp} />
     
      <Stack.Screen name="loginsuccess" component={LoginSuccessfull} />
      <Stack.Screen name="registersuccess" component={RegisterSuccessfull} />
      <Stack.Screen name="home" component={Home} />
    </Stack.Navigator>
  );
}
