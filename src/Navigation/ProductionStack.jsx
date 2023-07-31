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
    </Stack.Navigator>
  );
}
