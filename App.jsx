/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import AuthStack from './src/Navigation/AuthStack';
import {NavigationContainer} from '@react-navigation/native';
import CultivationLand from './src/Screens/CultivationScreens/CultivationLand';
import CultivationTwice from './src/Screens/CultivationScreens/CultivationTwice';
import CultivationThrice from './src/Screens/CultivationScreens/CultivationThrice';
import LandForSea from './src/Screens/CultivationScreens/LandForSea';
import RegisterSuccessfull from './src/Screens/AuthScreens/RegisterSuccessfull';
import {SplashScreen} from './src/Screens/AuthScreens/splashScreen';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/Store/store';
import {CheckToken} from './src/Helper/CheckToken';
import {getUser} from './src/Redux/AuthSlice';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasToken = CheckToken();

  const dispatch = useDispatch();

  useEffect(() => {
    if (hasToken !== undefined) {
      setIsLoggedIn(hasToken);
      dispatch(getUser())
        .unwrap()
        .then(() => setIsAppReady(true))
        .catch(err => console.log(err));
    }
  }, [hasToken]);

  return (
    <SplashScreen isAppReady={isAppReady}>
      <NavigationContainer>
        <AuthStack isLoggedIn={isLoggedIn} />
        {/* <RegisterSuccessfull /> */}
        {/* <CultivationLand /> */}
        {/* <CultivationThrice/> */}
        {/* <LandForSea/> */}
        {/* <CultivationTwice/> */}
      </NavigationContainer>
    </SplashScreen>
  );
}

export default App;
