import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import Consumption from '../Screens/Consumption/Consumption';
import ConsumptionInput from '../Screens/Consumption/ConsumptionInput';

const Stack = createStackNavigator();

export default function ConsumptionStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="consumption" component={Consumption} />
            <Stack.Screen name="consumptionInput" component={ConsumptionInput} />
        </Stack.Navigator>
    );
}
