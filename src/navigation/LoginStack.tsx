import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';
import {useLayoutEffect} from 'react';
import Login from '../screens/login/Login';
import DetailSlider from '../screens/onboarding/DetailSlider';
import SignUp from '../screens/login/SignUp';
import StackHeader from '../Components/CustomHeader/StackHeader';
import MapScreen from '../screens/login/MapScreen';
import VerifyOtp from '../screens/login/VerifyOtp';
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
      <Stack.Screen
        name="signup"
        component={SignUp}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Sign up'} />,
        }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verifyOtp"
        component={VerifyOtp}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Verify OTP'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginStack;
