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
import Poultry from '../screens/home/Food/Production/Poultry/Poultry';
import Fishery from '../screens/home/Food/Production/Fishery/Fishery';
import Trees from '../screens/home/Food/Production/Trees/Trees';
import Hunting from '../screens/home/Food/Production/Hunting/Hunting';
import Storage from '../screens/home/Food/Production/Storage/Storage';
import SellingChannel from '../screens/home/Food/Production/SellingChannel/SellingChannel';
import TreesImportantInfo from '../screens/home/Food/Production/Trees/TreesImportantInfo';
import Harvestedproducts from '../screens/home/Food/Production/Trees/Harvestedproducts';
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
      <Stack.Screen
        name="poultry"
        component={Poultry}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Poultry'} />,
        }}
      />
      <Stack.Screen
        name="fishery"
        component={Fishery}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Fishery'} />,
        }}
      />
      <Stack.Screen
        name="trees"
        component={Trees}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Trees,shrubs & grassland'} />,
        }}
      />
      <Stack.Screen
        name="treesImportantinfo"
        component={TreesImportantInfo}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="treesHarvestedProduct"
        component={Harvestedproducts}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="hunting"
        component={Hunting}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Hunting'} />,
        }}
      />
      <Stack.Screen
        name="storage"
        component={Storage}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Storage'} />,
        }}
      />
      <Stack.Screen
        name="sellingChannel"
        component={SellingChannel}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Selling Channel'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
