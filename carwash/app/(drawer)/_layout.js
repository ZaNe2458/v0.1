import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Animated,
} from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function MenuButton({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={styles.menuButton}
    >
      <Ionicons name="menu" size={28} color="#000" />
    </TouchableOpacity>
  );
}

function ExpandableSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <View style={styles.searchWrapper}>
      {isOpen && (
        <TextInput
          style={styles.searchInput}
          placeholder="Хайх..."
          value={query}
          onChangeText={setQuery}
          autoFocus={true}
        />
      )}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.searchIconWrapper}
      >
        <Ionicons name="search" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={({ navigation }) => ({
          headerLeft: () => <MenuButton navigation={navigation} />,
          headerTitle: '',
          headerRight: () => <ExpandableSearch />,
          headerTransparent: true,
        })}
      />

      <Drawer.Screen
        name="CarsScreen"
        options={({ navigation }) => ({
          title: 'Машинууд',
          headerLeft: () => <MenuButton navigation={navigation} />,
          headerTransparent: true,
        })}
      />

      <Drawer.Screen
        name="CarWashesScreen"
        options={({ navigation }) => ({
          title: 'Угаалгын газар',
          headerLeft: () => <MenuButton navigation={navigation} />,
          headerTransparent: true,
        })}
      />

      <Drawer.Screen
        name="ProfileScreen"
        options={({ navigation }) => ({
          title: 'Хувийн мэдээлэл',
          headerLeft: () => <MenuButton navigation={navigation} />,
          headerTransparent: true,
        })}
      />

      <Drawer.Screen
        name="RewardsScreen"
        options={({ navigation }) => ({
          title: 'Урамшуулал',
          headerLeft: () => <MenuButton navigation={navigation} />,
          headerTransparent: true,
        })}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconWrapper: {
    padding: 8,
  },
  searchInput: {
    width: 200,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
});
