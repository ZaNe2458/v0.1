// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CarWashDetailScreen from './screens/CarWashDetailScreen';

import ProfileScreen from './screens/ProfileScreen';
import CarsScreen from './screens/CarsScreen';
import CarWashesScreen from './screens/CarWashesScreen';
import RewardsScreen from './screens/RewardsScreen';
import HomeScreen from './screens/HomeScreen';
import AddCarScreen from './screens/AddCarScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Drawer-ийг тусад нь компонент болгоно
function DrawerRoutes() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Машинууд" component={CarsScreen} />
      <Drawer.Screen name="Угаалгын газар" component={CarWashesScreen} />
      <Drawer.Screen name="Урамшуулал" component={RewardsScreen} />
    </Drawer.Navigator>
  );
}

// Stack + Drawer layout
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={DrawerRoutes}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddCarScreen" component={AddCarScreen} />
        <Stack.Screen name="CarWashDetail" component={CarWashDetailScreen} options={{ title: 'Угаалгын газар' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
