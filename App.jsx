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
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from './src/Store/store';
import {CheckToken} from './src/Helper/CheckToken';
import {getUser} from './src/Redux/AuthSlice';
import ToastManager from 'toastify-react-native';
import Toast from 'react-native-toast-message';
import {storage} from './src/Helper/Storage';
import './src/Translation';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasToken = CheckToken();

  const dispatch = useDispatch();

  // const user_details = useSelector((s)=>s.auth)

  // console.log(user_details,"user_details_app")

  useEffect(() => {
    if (hasToken !== undefined) {
      setIsLoggedIn(hasToken);
      dispatch(getUser())
        .unwrap()
        .then(() => {
          setIsAppReady(true);
        })
        .catch(err => {
          storage.delete('token');
          storage.delete('refresh_token');
          console.log(err);
        });
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
