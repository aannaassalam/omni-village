import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {useUser} from '../Hooks/useUser';
import FoodHome from '../Screens/AuthScreens/FoodHome';
import Login from '../Screens/AuthScreens/Login';
import LoginSuccessfull from '../Screens/AuthScreens/LoginSuccessfull';
import LoginWithOtp from '../Screens/AuthScreens/LoginWithOtp';
import MapScreen from '../Screens/AuthScreens/MapScreen';
import Register from '../Screens/AuthScreens/Register';
import RegisterDetails from '../Screens/AuthScreens/RegisterDetails';
import RegisterSuccessfull from '../Screens/AuthScreens/RegisterSuccessfull';
import RegisterWithOtp from '../Screens/AuthScreens/RegisterWithOtp';
import StartupScreen from '../Screens/AuthScreens/StartupScreen';
import ConsumptionStack from './ConsumptionStack';
import Productionstack from './ProductionStack';
import Home from '../Screens/Home';
import Demographic from '../Screens/DemographicInfo/Demographic';
import LandholdingUsage from '../Screens/Landholding & Usage Mapping/LandholdingUsage';
import RegisterFieldOfficer from '../Screens/AuthScreens/RegisterFieldOfficer';
import RegisterDetailsFieldOfficer from '../Screens/AuthScreens/RegisterDetailsFieldOfficer';
import RegisterFieldOfficerOtp from '../Screens/AuthScreens/RegisterFieldOfficerOtp';
import { storage } from '../Helper/Storage';
import DemographicOccupation from '../Screens/DemographicInfo/DemographiOccupation';
import DemographicAspiration from '../Screens/DemographicInfo/DemographicAspiration';
import DemographicDisease from '../Screens/DemographicInfo/DemographicDisease';
import DemographicHabits from '../Screens/DemographicInfo/DemographicHabits';
import DemographicUnfulfilled from '../Screens/DemographicInfo/DemographicUnfulfilled';
import DemographicWishes from '../Screens/DemographicInfo/DemographicWishes';
import Members from '../Screens/DemographicInfo/Members';
import LandholdingLandRequirement from '../Screens/Landholding & Usage Mapping/LandholdingLandRequirement';
import LandholdingTotalLand from '../Screens/Landholding & Usage Mapping/LandholdingTotalLand';
import LandSpecification from '../Screens/Landholding & Usage Mapping/LandSpecification';
import LandSpecificationQuestioner from '../Screens/Landholding & Usage Mapping/LandSpecificationQuestioner';
import Housing from '../Screens/Housing/Housing';
import HousingDetails from '../Screens/Housing/HousingDetails';
import HousePhoto from '../Screens/Housing/HousePhoto';
import HouseSpecificationQuestioner from '../Screens/Housing/HouseSpecificationQuestioner';
import HouseholdRequirement from '../Screens/Housing/HouseholdRequirement';
import HousingRequirement from '../Screens/Housing/HousingRequirement';

const Stack = createStackNavigator();

export default function AuthStack({user}) {
  const type = storage.getString('type');
  const renderScreen = useCallback(() => {
    if (!user) {
      return 'startup';
    } else if (type==="villager"&&user?.first_name === '-') {
      return 'registerdetails';
    } else if (type === "officer" && user?.first_name === '-'){
      return 'registerDetailsFieldOfficer';
    }else {
      // return 'registerdetails';
      return 'home';
    }
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={renderScreen()}>
      <Stack.Screen name="registerdetails" component={RegisterDetails} />
      <Stack.Screen name="registerFieldOfficer" component={RegisterFieldOfficer} />
      <Stack.Screen name="registerDetailsFieldOfficer" component={RegisterDetailsFieldOfficer} />
      <Stack.Screen name="startup" component={StartupScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="loginotp" component={LoginWithOtp} />
      <Stack.Screen name="registerotp" component={RegisterWithOtp} />
      <Stack.Screen name="registerFieldOfficerOtp" component={RegisterFieldOfficerOtp} />
      <Stack.Screen name="loginsuccess" component={LoginSuccessfull} />
      <Stack.Screen name="registersuccess" component={RegisterSuccessfull} />
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="foodHome" component={FoodHome} />
      <Stack.Screen name="ProductionStack" component={Productionstack} />
      <Stack.Screen name="ConsumptionStack" component={ConsumptionStack} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="members" component={Members} />
      <Stack.Screen name="demographic" component={Demographic} />
      <Stack.Screen name="demographicOccupation" component={DemographicOccupation} />
      <Stack.Screen name="demographicAspiration" component={DemographicAspiration} />
      <Stack.Screen name="demographicDisease" component={DemographicDisease} />
      <Stack.Screen name="demographicHabits" component={DemographicHabits} />
      <Stack.Screen name="demographicUnfulfilled" component={DemographicUnfulfilled} />
      <Stack.Screen name="demographicWishes" component={DemographicWishes} />
      <Stack.Screen name='landholdingTotalLand' component={LandholdingTotalLand} />
      <Stack.Screen name='landSpecificationQuestioner' component={LandSpecificationQuestioner} />
      <Stack.Screen name='landholdingUsage' component={LandholdingUsage}/>
      <Stack.Screen name='landSpecification' component={LandSpecification} />
      <Stack.Screen name='landholdingLandRequirement' component={LandholdingLandRequirement} />
      <Stack.Screen name='housing' component={Housing} />
      <Stack.Screen name='houseSpecificationQuestioner' component={HouseSpecificationQuestioner} />
      <Stack.Screen name='housingDetails' component={HousingDetails} />
      <Stack.Screen name='housingPhoto' component={HousePhoto} />
      <Stack.Screen name='householdRequirement' component={HouseholdRequirement} />
      <Stack.Screen name='housingRequirement' component={HousingRequirement} />
    </Stack.Navigator>
  );
}
