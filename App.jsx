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
import {SplashScreen} from './src/Screens/AuthScreens/splashScreen';

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
        <AuthStack />
      </NavigationContainer>
    </SplashScreen>
  );
}

export default App;
