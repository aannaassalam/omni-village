import {createStackNavigator} from '@react-navigation/stack';
import {
  useNavigation,
} from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';
import Home from '../screens/home/Home';
import TotalLand from '../screens/home/Food/TotalLand';
import StackHeader from '../Components/CustomHeader/StackHeader';
const Stack = createStackNavigator();

const HomeStack = () => {
  const navigation = useNavigation();
  const {fontScale} = useWindowDimensions();
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        keyboardHandlingEnabled: true
      }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="total_land" component={TotalLand} options={{
        headerShown: true,
        header: () => <StackHeader title={'Total Land'} />,
      }}/>
    </Stack.Navigator>
  );
};

export default HomeStack;
