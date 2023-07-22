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
import {Provider} from 'react-redux';
import {store} from './src/Store/store';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 1000);
  }, []);

  return (

      <SplashScreen isAppReady={isAppReady}>
        <NavigationContainer>
        <Provider store={store}>
          <AuthStack />
          </Provider>
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
