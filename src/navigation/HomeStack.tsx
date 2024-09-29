import {createStackNavigator} from '@react-navigation/stack';
import {
  useNavigation,
} from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';
import Home from '../screens/home/Home';
import TotalLand from '../screens/home/Food/Production/TotalLand';
import StackHeader from '../Components/CustomHeader/StackHeader';
import Food from '../screens/home/Food/Food';
import Production from '../screens/home/Food/Production/Production';
import Consumption from '../screens/home/Food/Consumption/Consumption';
import Cultivation from '../screens/home/Food/Production/Cultivation/Cultivation';
const Stack = createStackNavigator();

const HomeStack = () => {
  const navigation = useNavigation();
  const {fontScale} = useWindowDimensions();
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        keyboardHandlingEnabled: true,
      }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen
        name="food"
        component={Food}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Food'} />,
        }}
      />
      <Stack.Screen
        name="total_land"
        component={TotalLand}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Total Land'} />,
        }}
      />
      <Stack.Screen
        name="production"
        component={Production}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Production'} />,
        }}
      />
      <Stack.Screen
        name="consumption"
        component={Consumption}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Consumption'} />,
        }}
      />
      <Stack.Screen
        name="cultivation"
        component={Cultivation}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Cultivation'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
