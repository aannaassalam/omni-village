import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import Login from '../Screens/AuthScreens/Login';
import LoginWithOtp from '../Screens/AuthScreens/LoginWithOtp';
import Register from '../Screens/AuthScreens/Register';
import LoginSuccessfull from '../Screens/AuthScreens/LoginSuccessfull';
import RegisterSuccessfull from '../Screens/AuthScreens/RegisterSuccessfull';
import StartupScreen from '../Screens/AuthScreens/StartupScreen';
import RegisterDetails from '../Screens/AuthScreens/RegisterDetails';
import RegisterWithOtp from '../Screens/AuthScreens/RegisterWithOtp';
import Home from '../Screens/AuthScreens/Home';
import {CheckToken} from '../Helper/CheckToken';
import {storage} from '../Helper/Storage';
import {useSelector} from 'react-redux';
import Productionstack from './ProductionStack';
import CountryCheck from '../Screens/AuthScreens/CountryCheck';
import ConsumptionStack from './ConsumptionStack';
import MapScreen from '../Screens/AuthScreens/MapScreen';

const Stack = createStackNavigator();

export default function AuthStack({isLoggedIn}) {
  const [isToken, setIsToken] = useState(false);
  const token = storage.getString('token');

  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    if (token !== undefined && token !== null) {
      setIsToken(true);
    } else {
      setIsToken(false);
    }
  }, [token]);

  const renderScreen = useCallback(() => {
    if (user?.first_name === '-') {
      return 'registerdetails';
    } else if (token === undefined || token === null) {
      return 'startup';
    } else {
      // return 'registerdetails';
      return 'home';
    }
  }, [token, user]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={renderScreen()}>
      {/* // initialRouteName={'MapScreen'}> */}
      <Stack.Screen name="registerdetails" component={RegisterDetails} />
      <Stack.Screen name="startup" component={StartupScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="loginotp" component={LoginWithOtp} />
      <Stack.Screen name="registerotp" component={RegisterWithOtp} />
      <Stack.Screen name="countryCheck" component={CountryCheck} />
      <Stack.Screen name="loginsuccess" component={LoginSuccessfull} />
      <Stack.Screen name="registersuccess" component={RegisterSuccessfull} />
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="ProductionStack" component={Productionstack} />
      <Stack.Screen name="ConsumptionStack" component={ConsumptionStack} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
}
