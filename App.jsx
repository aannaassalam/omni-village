/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text} from 'react-native';
import AuthStack from './src/Navigation/AuthStack';
import {NavigationContainer} from '@react-navigation/native';
import CultivationLand from './src/Screens/CultivationScreens/CultivationLand';
import CultivationTwice from './src/Screens/CultivationScreens/CultivationTwice';
import CultivationThrice from './src/Screens/CultivationScreens/CultivationThrice';
import LandForSea from './src/Screens/CultivationScreens/LandForSea';

function App() {
  return (
    <NavigationContainer>
      <AuthStack />
      {/* <CultivationLand/> */}
      {/* <CultivationThrice/> */}
      {/* <LandForSea/> */}
      {/* <CultivationTwice/> */}
    </NavigationContainer>
  );
}

export default App;
