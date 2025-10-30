import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const carWashes = [
  {
    id: '1',
    name: 'Цэвэр Угаалга',
    location: 'БЗД, 13-р хороолол',
    rating: 4.5,
    logo: require('../../assets/logos/shine.jpg'),
  },
  {
    id: '2',
    name: 'Shine Wash',
    location: 'СБД, 5-р хороо',
    rating: 4.7,
    logo: require('../../assets/logos/shine.jpg'),
  },
  {
    id: '3',
    name: 'Smart Car Wash',
    location: 'ХУД, 19-р хороо',
    rating: 4.3,
    logo: require('../../assets/logos/shine.jpg'),
  },
  {
    id: '4',
    name: 'Smart Car Wash',
    location: 'ХУД, 19-р хороо',
    rating: 4.3,
    logo: require('../../assets/logos/shine.jpg'),
  },
  {
    id: '5',
    name: 'Smart Car Wash',
    location: 'ХУД, 19-р хороо',
    rating: 4.3,
    logo: require('../../assets/logos/shine.jpg'),
  },
];

const categories = [
  { id: 'all', name: 'Бүгд' },
  { id: '24/7', name: '24/7' },
  { id: 'best', name: 'Шилдэг' },
  { id: 'nearby', name: 'Ойр орчим' },
];

export default function CarWashesScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredData = carWashes.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() =>
        navigation.navigate('CarWashDetail', { carWashId: item.id })
      }
    >
      <BlurView intensity={80} tint="light" style={styles.card}>
        <Image source={item.logo} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Хайх..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.activeCategoryText,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e6eaf0',
    paddingTop: 100,
  },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 0,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryButton: { backgroundColor: '#007bff' },
  categoryText: { color: '#333', fontWeight: '600', fontSize: 14 },
  activeCategoryText: { color: '#fff' },

  cardWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
  },
  logo: { width: 64, height: 64, borderRadius: 12, marginRight: 16 },
  textContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  location: { color: '#555' },
  rating: { marginTop: 4, fontWeight: '600' },
});
