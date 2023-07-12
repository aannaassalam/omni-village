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

function App() {
  return (
    <NavigationContainer>
      {/* <AuthStack /> */}
      <CultivationLand/>
    </NavigationContainer>
  );
}

export default App;
