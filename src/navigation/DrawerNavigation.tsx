import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
// components
import CustomSideDrawer from '../Components/CustomSideDrawer/index';
import HomeStack from './HomeStack';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        drawerStyle: {width: '85%'},
      }}
      drawerContent={props => <CustomSideDrawer {...props} />}
      >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          headerShown: false,
          drawerItemStyle: {height: 0},
          drawerIcon: ({color}) => (
            <Ionicons name="timer-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
