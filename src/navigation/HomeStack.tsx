import {createStackNavigator} from '@react-navigation/stack';
import {
  useNavigation,
} from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';
import Home from '../screens/home/Home';
const Stack = createStackNavigator();

const HomeStack = () => {
  const navigation = useNavigation();
  const {fontScale} = useWindowDimensions();
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="home" component={Home} />
    </Stack.Navigator>
  );
};

export default HomeStack;
