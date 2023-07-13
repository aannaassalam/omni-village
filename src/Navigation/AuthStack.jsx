import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Login from '../Screens/AuthScreens/Login';
import StartupScreen from '../Screens/AuthScreens/StartupScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="startup" component={StartupScreen} />
    </Stack.Navigator>
  );
}
