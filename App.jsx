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
import {CheckToken} from './src/Helper/CheckToken';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasToken = CheckToken();

  useEffect(() => {
    if (hasToken !== undefined) {
      setIsLoggedIn(hasToken);
      setIsAppReady(true);
    }
  }, [hasToken]);

  return (
    <SplashScreen isAppReady={isAppReady}>
      <Provider store={store}>
        <NavigationContainer>
          <AuthStack isLoggedIn={isLoggedIn} />
          {/* <RegisterSuccessfull /> */}
          {/* <CultivationLand /> */}
          {/* <CultivationThrice/> */}
          {/* <LandForSea/> */}
          {/* <CultivationTwice/> */}
        </NavigationContainer>
      </Provider>
    </SplashScreen>
  );
}

export default App;
