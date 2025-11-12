// carwash/app/(drawer)/_layout.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useSegments, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function MenuButton({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={styles.menuButton}
    >
      <Ionicons name="menu" size={28} color="#000" />
    </TouchableOpacity>
  );
}

export default function DrawerLayout() {
  const pathname = usePathname();

  // ✅ Route замаас хамаарч гарчгийг өөрчлөх
  const getHeaderTitle = () => {
    if (pathname?.includes('AddCarScreen')) return 'Машин нэмэх';
    if (pathname?.includes('cars')) return 'Миний машинууд';
    if (pathname?.includes('profile')) return 'Хувийн мэдээлэл';
    if (pathname?.includes('index')) return 'Газрын зураг';
    if (pathname?.includes('wash')) return 'Угаалгын газрууд';
    return '';
  };

  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerLeft: () => {
          if (pathname.includes('cars/add') || pathname.includes('wash/detail'))
            return null;
          return <MenuButton navigation={navigation} />;
        },
        headerShown: !pathname.includes('wash/detail'),
        headerShown: !pathname.includes('cars/add'),
        headerTitle: getHeaderTitle(),
        headerTransparent: true,
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Газрын зураг',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="cars"
        options={{
          drawerLabel: 'Машинууд',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="wash"
        options={{
          drawerLabel: 'Угаалгийн газрууд',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="water-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RewardsScreen"
        options={{
          drawerLabel: 'Урамшуулал',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Хувийн мэдээлэл',
          headerTransparent: false, // ← нэм

          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 10,
  },
});
