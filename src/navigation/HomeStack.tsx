import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
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
import Landholding from '../screens/home/Landholding & Usage Mapping/Landholding';
import Housing from '../screens/home/Housing/Housing';
import HousingFarmhouse from '../screens/home/Housing/HousingFarmhouse';
import CommunityInfrastructure from '../screens/home/Community Infrastructure/CommunityInfrastructure';
import BusinessCommercial from '../screens/home/Business & Commercial Establishments/BusinessCommercial';
import OtherPersonal from '../screens/home/Other Personal and Household Items/OtherPersonal';
import Forestry from '../screens/home/Forestry & Timber/Forestry';
import Mobility from '../screens/home/Mobility/Mobility';
import Energy from '../screens/home/Energy & Fuel/Energy';
import Water from '../screens/home/Water/Water';
import Profile from '../screens/Profile/Profile';
import MapScreen from '../screens/login/MapScreen';
import { useTranslation } from 'react-i18next';
import '../i18next'
const Stack = createStackNavigator();

const HomeStack = () => {
  const navigation = useNavigation();
  const {fontScale} = useWindowDimensions();
  const {t} = useTranslation()
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        keyboardHandlingEnabled: true,
      }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Profile'} />,
        }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* Food Stacks */}
      <Stack.Screen
        name="food"
        component={Food}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('food')} />,
        }}
      />
      <Stack.Screen
        name="total_land"
        component={TotalLand}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('total_land')} />,
        }}
      />
      <Stack.Screen
        name="production"
        component={Production}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('production')} />,
        }}
      />
      <Stack.Screen
        name="consumption"
        component={Consumption}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('consumption')} />,
        }}
      />
      <Stack.Screen
        name="consumptionItem"
        component={ConsumptionItem}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('consumption')} />,
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
          header: () => <StackHeader title={t('cultivation')} />,
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
          header: () => <StackHeader title={t('poultry')} />,
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
          header: () => <StackHeader title={t('fishery')} />,
        }}
      />
      <Stack.Screen
        name="pond"
        component={Pond}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('Pond Fishery')} />,
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
          header: () => <StackHeader title={t('River Fishery')} />,
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
          header: () => <StackHeader title={t('tree shrub grassland')} />,
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
          header: () => <StackHeader title={t('hunting')} />,
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
          header: () => <StackHeader title={t('storage')} />,
        }}
      />
      <Stack.Screen
        name="sellingChannel"
        component={SellingChannel}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('sellingChannel')} />,
        }}
      />
      {/* Demographic  */}
      <Stack.Screen
        name="demographic"
        component={DemographicInfo}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('demographic')} />,
        }}
      />
      {/* Landholding & Usage mapping */}
      <Stack.Screen
        name="landholding"
        component={Landholding}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('landholding')} />,
        }}
      />
      {/* Housing */}
      <Stack.Screen
        name="housing"
        component={Housing}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Housing For Family'} />,
        }}
      />
      <Stack.Screen
        name="housingFarmhouse"
        component={HousingFarmhouse}
        options={{
          headerShown: true,
          header: () => <StackHeader title={'Housing For Farmhouse'} />,
        }}
      />
      {/* Water */}
      <Stack.Screen
        name="water"
        component={Water}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('water')} />,
        }}
      />
      {/* Energy */}
      <Stack.Screen
        name="energy"
        component={Energy}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('energy')} />,
        }}
      />
      {/* Mobility */}
      <Stack.Screen
        name="mobility"
        component={Mobility}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('mobility')} />,
        }}
      />
      {/* Forestry */}
      <Stack.Screen
        name="forestry"
        component={Forestry}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('forestry')} />,
        }}
      />
      {/* Other Personal */}
      <Stack.Screen
        name="otherPersonal"
        component={OtherPersonal}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('other personal')} />,
        }}
      />
      {/* Business & Commercial */}
      <Stack.Screen
        name="businessCommercial"
        component={BusinessCommercial}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('business')} />,
        }}
      />
      {/* Community Infrastructure */}
      <Stack.Screen
        name="communityInfrastructure"
        component={CommunityInfrastructure}
        options={{
          headerShown: true,
          header: () => <StackHeader title={t('community')} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
