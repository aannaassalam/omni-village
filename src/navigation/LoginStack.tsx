import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';
import {useLayoutEffect} from 'react';
import Login from '../screens/login/Login';
import DetailSlider from '../screens/onboarding/DetailSlider';
const Stack = createStackNavigator();

const LoginStack = () => {
  const navigation = useNavigation();
  const {fontScale} = useWindowDimensions();
  return (
    <Stack.Navigator
      initialRouteName="detailSlider"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="detailSlider" component={DetailSlider} />
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
};

export default LoginStack;
