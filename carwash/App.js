import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';

import CarWashDetailScreen from './screens/CarWashDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import CarsScreen from './screens/CarsScreen';
import CarWashesScreen from './screens/CarWashesScreen';
import RewardsScreen from './screens/RewardsScreen';
import HomeScreen from './screens/HomeScreen';
import AddCarScreen from './screens/AddCarScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MenuButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 8,
        borderRadius: 20,
        marginLeft: 10,
      }}
    >
      <Ionicons name="menu" size={22} color="#000" />
    </TouchableOpacity>
  );
}

function SearchButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        alert('Search clicked!');
      }}
      style={{
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 8,
        borderRadius: 20,
        marginRight: 10,
      }}
    >
      <Ionicons name="search" size={22} color="#000" />
    </TouchableOpacity>
  );
}

function DrawerRoutes() {
  return (
    <Drawer.Navigator
      initialRouteName="Газрын зураг"
      screenOptions={({ route }) => ({
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: '#000' },
        headerLeft: () => <MenuButton />,
        headerRight:
          route.name === 'Газрын зураг' ? () => <SearchButton /> : undefined,
      })}
    >
      <Drawer.Screen name="Газрын зураг" component={HomeScreen} />
      <Drawer.Screen name="Хувийн мэдээлэл" component={ProfileScreen} />
      <Drawer.Screen name="Машинууд" component={CarsScreen} />
      <Drawer.Screen name="Угаалгын газар" component={CarWashesScreen} />
      <Drawer.Screen name="Урамшуулал" component={RewardsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Main" component={DrawerRoutes} />
        <Stack.Screen name="AddCarScreen" component={AddCarScreen} />
        <Stack.Screen
          name="CarWashDetail"
          component={CarWashDetailScreen}
          options={{
            title: 'Угаалгын газар',
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
