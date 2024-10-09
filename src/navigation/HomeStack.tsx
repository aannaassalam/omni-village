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
import PoultryImportantInfo from '../screens/home/Food/Production/Poultry/PoultryImportantInfo';
import PoultryProductionInfo from '../screens/home/Food/Production/Poultry/PoultryProductionInfo';
import PoultryHarvestedProduct from '../screens/home/Food/Production/Poultry/PoultryHarvestedProduct';
import HuntingInfo from '../screens/home/Food/Production/Hunting/HuntingInfo';
import Utilisation from '../screens/home/Food/Production/Cultivation/Utilisation';
import CultivationImportantInfo from '../screens/home/Food/Production/Cultivation/CultivationImportantInfo';
import Pond from '../screens/home/Food/Production/Fishery/Pond/Pond';
import PondInfo from '../screens/home/Food/Production/Fishery/Pond/PondInfo';
import River from '../screens/home/Food/Production/Fishery/River/River';
import RiverInfo from '../screens/home/Food/Production/Fishery/River/RiverInfo';
import ConsumptionItem from '../screens/home/Food/Consumption/ConsumptionItem';
import ConsumptionInfo from '../screens/home/Food/Consumption/ConsumptionInfo';
import DemographicInfo from '../screens/home/DemographicInfo/DemographicInfo';
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
      {/* Food Stacks */}
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
        name="consumptionItem"
        component={ConsumptionItem}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Consumption'} />,
        }}
      />
      <Stack.Screen
        name="consumptionInfo"
        component={ConsumptionInfo}
        options={{
          headerShown: true,
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
        name="utilisation"
        component={Utilisation}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="cultivationImportantInfo"
        component={CultivationImportantInfo}
        options={{
          headerShown: true,
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
        name="poultryImportantinfo"
        component={PoultryImportantInfo}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="poultryProductioninfo"
        component={PoultryProductionInfo}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="poultryHarvestedProduct"
        component={PoultryHarvestedProduct}
        options={{
          headerShown: true,
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
        name="pond"
        component={Pond}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Pond'} />,
        }}
      />
      <Stack.Screen
        name="pondInfo"
        component={PondInfo}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="river"
        component={River}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'River'} />,
        }}
      />
      <Stack.Screen
        name="riverInfo"
        component={RiverInfo}
        options={{
          headerShown: true,
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
        name="huntingInfo"
        component={HuntingInfo}
        options={{
          headerShown: true,
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
      {/* Demographic  */}
      <Stack.Screen
        name="demographic"
        component={DemographicInfo}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Demographic Info'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
