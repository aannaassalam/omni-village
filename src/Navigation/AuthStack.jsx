import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {useUser} from '../Hooks/useUser';
import Home from '../Screens/AuthScreens/Home';
import Login from '../Screens/AuthScreens/Login';
import LoginSuccessfull from '../Screens/AuthScreens/LoginSuccessfull';
import LoginWithOtp from '../Screens/AuthScreens/LoginWithOtp';
import MapScreen from '../Screens/AuthScreens/MapScreen';
import Register from '../Screens/AuthScreens/Register';
import RegisterDetails from '../Screens/AuthScreens/RegisterDetails';
import RegisterSuccessfull from '../Screens/AuthScreens/RegisterSuccessfull';
import RegisterWithOtp from '../Screens/AuthScreens/RegisterWithOtp';
import StartupScreen from '../Screens/AuthScreens/StartupScreen';
import ConsumptionStack from './ConsumptionStack';
import Productionstack from './ProductionStack';

const Stack = createStackNavigator();

export default function AuthStack({user}) {
  const renderScreen = useCallback(() => {
    if (!user) {
      return 'startup';
    } else if (user?.first_name === '-') {
      return 'registerdetails';
    } else {
      // return 'registerdetails';
      return 'home';
    }
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={renderScreen()}>
      <Stack.Screen name="registerdetails" component={RegisterDetails} />
      <Stack.Screen name="startup" component={StartupScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="loginotp" component={LoginWithOtp} />
      <Stack.Screen name="registerotp" component={RegisterWithOtp} />
      <Stack.Screen name="loginsuccess" component={LoginSuccessfull} />
      <Stack.Screen name="registersuccess" component={RegisterSuccessfull} />
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="ProductionStack" component={Productionstack} />
      <Stack.Screen name="ConsumptionStack" component={ConsumptionStack} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
}
