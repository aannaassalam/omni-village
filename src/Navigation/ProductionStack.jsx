import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import TotalLand from '../Screens/CultivationScreens/TotalLand';
import Production from '../Screens/CultivationScreens/Production';
import LandAllocation from '../Screens/CultivationScreens/LandAllocation';
import CultivationDashboard from '../Screens/CultivationScreens/CultivationDashboard';
import Season1 from '../Screens/CultivationScreens/Season1';
import CultivationTwice from '../Screens/CultivationScreens/CultivationTwice';
import CultivationThrice from '../Screens/CultivationScreens/CultivationThrice';
import CropDescription from '../Screens/CultivationScreens/CropDescription';
import TreesShrubsScreen from '../Screens/TreesAndShrubsScreens/TreesShrubsScreen';
import Type01 from '../Screens/TreesAndShrubsScreens/Type01';
import EditType from '../Screens/TreesAndShrubsScreens/EditType';
import Poultry from '../Screens/Poultry/Poultry';
import PoultryType from '../Screens/Poultry/PoultryType';
import Index from '../Screens/Fishery/Index';
import Fishery from '../Screens/Fishery/Fishery';
import SubArea from '../Screens/Fishery/SubArea';
import FishTypeInput from '../Screens/Fishery/FishTypeInput';
import Hunting from '../Screens/Hunting/Hunting';
import HuntingType from '../Screens/Hunting/HuntingType';
import Storage from '../Screens/Storage/Storage';
import SellingChannel from '../Screens/Selling Channel/SellingChannel';
import PoultryEdit from '../Screens/Poultry/PoultryEdit';
import FisheryRiver from '../Screens/Fishery/FisheryRiver';
import FisheryRiverInput from '../Screens/Fishery/FisheryRiverInput';
import Consumption from '../Screens/Consumption/Consumption';
import Succsessfull from '../Screens/Successfull';
import FisheryPond from '../Screens/Fishery/FisheryPond';
import FisheryRiver2 from '../Screens/Fishery/FisheryRiver2';
import Hunting2 from '../Screens/Hunting/Hunting2';

const Stack = createStackNavigator();

export default function Productionstack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="totalLand" component={TotalLand} />
      <Stack.Screen name="production" component={Production} />
      <Stack.Screen name="landAllocation" component={LandAllocation} />
      <Stack.Screen
        name="cultivationDashboard"
        component={CultivationDashboard}
      />
      <Stack.Screen name="cultivationTwice" component={CultivationTwice} />
      <Stack.Screen name="cultivationThrice" component={CultivationThrice} />
      <Stack.Screen name="season1" component={Season1} />
      <Stack.Screen name="cropDescription" component={CropDescription} />
      {/* Tress,shrubs and grassland */}
      <Stack.Screen name="treesShrubGrassland" component={TreesShrubsScreen} />
      <Stack.Screen name="type" component={Type01} />
      <Stack.Screen name="editType" component={EditType} />
      {/* poultry stack */}
      <Stack.Screen name="poultry" component={Poultry} />
      <Stack.Screen name="poultryType" component={PoultryType} />
      <Stack.Screen name="poultryEdit" component={PoultryEdit} />

      {/* fishery  */}
      <Stack.Screen name="fisheryIndex" component={Index} />
      {/* <Stack.Screen name="fishery" component={Fishery} /> */}
      <Stack.Screen name="fishery" component={FisheryPond} />
      <Stack.Screen name="subArea" component={SubArea} />
      <Stack.Screen name="fishTypeInput" component={FishTypeInput} />
      {/* <Stack.Screen name="fisheryRiver" component={FisheryRiver} /> */}
      <Stack.Screen name="fisheryRiver" component={FisheryRiver2} />
      <Stack.Screen name="fisheryRiverInput" component={FisheryRiverInput} />

      {/* hunting */}
      {/* <Stack.Screen name="hunting" component={Hunting} /> */}
      <Stack.Screen name="hunting" component={Hunting2} />
      <Stack.Screen name="huntingType" component={HuntingType} />
      {/* storage */}
      <Stack.Screen name="storage" component={Storage} />
      {/* SellingChannel */}
      <Stack.Screen name="sellingChannel" component={SellingChannel} />
      {/* successfull screen */}
      <Stack.Screen name="successfull" component={Succsessfull} />
    </Stack.Navigator>
  );
}
