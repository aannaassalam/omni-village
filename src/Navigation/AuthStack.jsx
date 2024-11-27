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
import Water from '../Screens/Water/Water';
import CookingDrinking from '../Screens/Water/CookingDrinking';
import WaterHarvesting from '../Screens/Water/WaterHarvesting';
import WaterDisposal from '../Screens/Water/WaterDisposal';
import GeneralInformation from '../Screens/Water/GeneralInformation';
import OtherUsage from '../Screens/Water/OtherUsage';
import Cleaning from '../Screens/Water/Cleaning';
import Irrigation from '../Screens/Water/Irrigation';
import Sanitation from '../Screens/Water/Sanitation';
import EnergyFuel from '../Screens/EnergyFuel/EnergyFuel';
import Electricity from '../Screens/EnergyFuel/Electricity';
import Petrol from '../Screens/EnergyFuel/Petrol';
import NaturalGas from '../Screens/EnergyFuel/NaturalGas';
import OtherEnergy from '../Screens/EnergyFuel/OtherEnergy';
import EnergyGeneralInformation from '../Screens/EnergyFuel/EnergyGeneralInformation';
import Mobility from '../Screens/Mobility/Mobility';
import VehicleCount from '../Screens/Mobility/VehicleCount';
import VehicleDetails from '../Screens/Mobility/VehicleDetails';
import VehicleRequirement from '../Screens/Mobility/VehicleRequirement';
import Diesel from '../Screens/EnergyFuel/Diesel';
import ForestryOtherNeeds from '../Screens/ForestTimber/ForestryOtherNeeds';
import TimberNeeds from '../Screens/ForestTimber/TimberNeeds';
import ForestryGeneralInformation from '../Screens/ForestTimber/ForestryGeneralInformation';
import ForestTimber from '../Screens/ForestTimber/ForestTimber';
import OtherPersonalHousehold from '../Screens/OtherPersonalHouseholdItems/OtherPersonalHousehold';
import PersonalCareItem from '../Screens/OtherPersonalHouseholdItems/PersonalCareItems';
import CleaningProduct from '../Screens/OtherPersonalHouseholdItems/CleaningProduct';
import OfficeSupplies from '../Screens/OtherPersonalHouseholdItems/OfficeSupplies';
import Medicine from '../Screens/OtherPersonalHouseholdItems/Medicine';
import KitchenItems from '../Screens/OtherPersonalHouseholdItems/KitchenItems';
import OtherItems from '../Screens/OtherPersonalHouseholdItems/OtherItems';
import BusinessCommercial from '../Screens/BusinessCommercialEstablishment/BusinessCommercial';
import BusinessCount from '../Screens/BusinessCommercialEstablishment/BusinessCount';
import NewBusinessDetails from '../Screens/BusinessCommercialEstablishment/NewBusinessDetails';
import BusinessRequirement from '../Screens/BusinessCommercialEstablishment/BusinessRequirement';
import BusinessInvestment from '../Screens/BusinessCommercialEstablishment/BusinessInvestment';
import BusinessEmployee from '../Screens/BusinessCommercialEstablishment/BusinessEmployee';
import BusinessName from '../Screens/BusinessCommercialEstablishment/BusinessName';
import LoginWithOtpFieldOfficer from '../Screens/AuthScreens/LoginWithOtpFieldOfficer';
import LoginFieldOfficer from '../Screens/AuthScreens/LoginFieldOfficer';
import PendingScreen from '../Screens/AuthScreens/PendingScreen';
import Village from '../Screens/AuthScreens/Village';
import RejectScreen from '../Screens/AuthScreens/RejectScreen';
import LoginFieldOfficerSuccessfull from '../Screens/AuthScreens/LoginFieldOfficerSuccess';

const Stack = createStackNavigator();

export default function AuthStack({user, moderator}) {
  const type = storage.getString('type');
  console.log("moderatorrrr", moderator, type)
  const renderScreen = useCallback(() => {
    if(type==="officer"){
      // console.log("herererre")
      if(!moderator){
        // console.log("hereeeeeeee12")
        return 'startup';
      } else if (moderator?.first_name === '-'){
        // console.log("hereeeeeeee13")
        return 'registerDetailsFieldOfficer';
      } else if (moderator?.status === 0) {
        // console.log("hereeeeeeee16")
        return 'pending';
      } else if (moderator?.status === 2) {
        // console.log("hereeeeeeee16")
        return 'reject';
      } else if (moderator?.status === 1) {
        // console.log("hereeeeeeee14")
        return 'village'
      }else{
        return 'startup'
      }
    }else if(type==="villager"){
      // console.log("herereer3")
      if (!user) {
        return 'startup';
      } else if (user?.first_name === '-') {
        return 'registerdetails';
      } else {
        return 'home';
      }
    }
    else {
      console.log("hereerrererere9088")
      return 'startup'
    }
  }, [user, moderator, type]);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={renderScreen()}>
      <Stack.Screen name="registerdetails" component={RegisterDetails} />
      <Stack.Screen name="registerFieldOfficer" component={RegisterFieldOfficer} />
      <Stack.Screen name="registerDetailsFieldOfficer" component={RegisterDetailsFieldOfficer} />
      <Stack.Screen name="startup" component={StartupScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="loginotp" component={LoginWithOtp} />
      <Stack.Screen name="loginFieldOfficer" component={LoginFieldOfficer} />
      <Stack.Screen name="loginotpFieldOfficer" component={LoginWithOtpFieldOfficer} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="registerotp" component={RegisterWithOtp} />
      <Stack.Screen name="registerFieldOfficerOtp" component={RegisterFieldOfficerOtp} />
      <Stack.Screen name="loginsuccess" component={LoginSuccessfull} />
      <Stack.Screen name="loginfieldsuccess" component={LoginFieldOfficerSuccessfull} />
      <Stack.Screen name="registersuccess" component={RegisterSuccessfull} />
      <Stack.Screen name="pending" component={PendingScreen} />
      <Stack.Screen name="reject" component={RejectScreen} />
      <Stack.Screen name="village" component={Village} />
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
      <Stack.Screen name='water' component={Water} />
      <Stack.Screen name='cooking' component={CookingDrinking} />
      <Stack.Screen name='cleaning' component={Cleaning} />
      <Stack.Screen name='irrigation' component={Irrigation} />
      <Stack.Screen name='sanitation' component={Sanitation} />
      <Stack.Screen name='others' component={OtherUsage} />
      <Stack.Screen name='waterHarvesting' component={WaterHarvesting} />
      <Stack.Screen name='waterDisposal' component={WaterDisposal} />
      <Stack.Screen name='generalInfo' component={GeneralInformation} />
      <Stack.Screen name='energyFuel' component={EnergyFuel} />
      <Stack.Screen name='electricity' component={Electricity} />
      <Stack.Screen name='petrol' component={Petrol} />
      <Stack.Screen name='diesel' component={Diesel} />
      <Stack.Screen name='naturalGas' component={NaturalGas} />
      <Stack.Screen name='othersEnergy' component={OtherEnergy} />
      <Stack.Screen name='energyGeneralInformation' component={EnergyGeneralInformation} />
      <Stack.Screen name='mobility' component={Mobility} />
      <Stack.Screen name='vehicleCount' component={VehicleCount} />
      <Stack.Screen name='vehicleDetails' component={VehicleDetails} />
      <Stack.Screen name='vehicleRequirements' component={VehicleRequirement} />
      <Stack.Screen name='forestryTimber' component={ForestTimber} />
      <Stack.Screen name='forestryGeneralInformation' component={ForestryGeneralInformation} />
      <Stack.Screen name='timberNeeds' component={TimberNeeds} />
      <Stack.Screen name='forestryOtherNeeds' component={ForestryOtherNeeds} />
      <Stack.Screen name='otherPersonalHousehold' component={OtherPersonalHousehold} />
      <Stack.Screen name='personalCare' component={PersonalCareItem} />
      <Stack.Screen name='cleaningProduct' component={CleaningProduct} />
      <Stack.Screen name='officeSupplies' component={OfficeSupplies} />
      <Stack.Screen name='medicine' component={Medicine} />
      <Stack.Screen name='kitchenItems' component={KitchenItems} />
      <Stack.Screen name='otherItems' component={OtherItems} />
      <Stack.Screen name='businessCommercial' component={BusinessCommercial} />
      <Stack.Screen name='businessCount' component={BusinessCount} />
      <Stack.Screen name='businessName' component={BusinessName} />
      <Stack.Screen name='businessEmployee' component={BusinessEmployee} />
      <Stack.Screen name='businessInvestment' component={BusinessInvestment} />
      <Stack.Screen name='businessRequirement' component={BusinessRequirement} />
      <Stack.Screen name='newBusinessDetails' component={NewBusinessDetails} />
    </Stack.Navigator>
  );
}
