import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import TotalLand from '../Screens/CultivationScreens/TotalLand';

const Stack = createStackNavigator();

export default function Productionstack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="totalLand" component={TotalLand} />
    </Stack.Navigator>
  );
}
