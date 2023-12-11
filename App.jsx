/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {storage} from './src/Helper/Storage';
import {useUser} from './src/Hooks/useUser';
import AuthStack from './src/Navigation/AuthStack';
import {SplashScreen} from './src/Screens/AuthScreens/splashScreen';
import './src/i18next';

function App() {
  const {data: user, error, isLoading} = useUser();

  useEffect(() => {
    if (error) {
      console.log(error, 'error');
      storage.clearAll();
    }
  }, [error]);

  return (
    <SplashScreen isAppReady={!isLoading}>
      <NavigationContainer>
        <AuthStack user={user} />
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
