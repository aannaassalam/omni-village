import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {WithSplashScreen} from './screens/onboarding/Splash';
import {useDispatch, useSelector} from 'react-redux';
import LoginStack from './navigation/LoginStack';
import DrawerNavigation from './navigation/DrawerNavigation';

const Config = ({token}:{token:any}) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const authState = useSelector((state:any)=>state.authState)
  const dispatch =useDispatch()
  useEffect(() => {
    setIsAppReady(true);
  }, [token]);
  return (
    <WithSplashScreen isAppReady={isAppReady}>
      <NavigationContainer>
       {authState?.isLoggedIn?<DrawerNavigation/>:<LoginStack/>}
      </NavigationContainer>
    </WithSplashScreen>
  );
};

export default Config;
