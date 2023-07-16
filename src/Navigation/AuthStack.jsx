import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Login from '../Screens/AuthScreens/Login'
import LoginWithOtp from '../Screens/AuthScreens/LoginWithOtp'
import Register from '../Screens/AuthScreens/Register'
import LoginSuccessfull from '../Screens/AuthScreens/LoginSuccessfull'

const Stack = createStackNavigator()

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='login' component={Login}/>
        <Stack.Screen name='loginotp' component={LoginWithOtp}/>
        <Stack.Screen name='register' component={Register}/>
        <Stack.Screen name='loginsuccess' component={LoginSuccessfull}/>
    </Stack.Navigator>
  )
}
