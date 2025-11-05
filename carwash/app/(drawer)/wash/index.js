// app/(drawer)/wash/index.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { api } from '../../../src/api/client';
import { API_PATHS } from '../../../src/config/constants';
import { listCompanies } from '../../../src/api/companies';

export default function CarWashesScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchCompanies = async () => {
    try {
      setError('');
      const { results } = await listCompanies({ search: searchText }); // ← API layer
      const mapped = (results ?? []).map((c) => ({
        id: String(c.id ?? c.pk ?? c.uuid),
        name: c.name ?? 'Нэргүй',
        location: c.location ?? c.address ?? '',
        rating: c.avg_rating ?? c.rating ?? 0,
        logoUrl: c.logo_url ?? c.logo ?? null,
      }));
      setItems(mapped);
    } catch {
      setError('Өгөгдөл татах үед алдаа гарлаа.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompanies();
  }, []);

  const filteredData = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        (it.location || '').toLowerCase().includes(q)
    );
  }, [items, searchText]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() =>
        navigation.navigate('CarWashDetail', { carWashId: item.id })
      }
    >
      <BlurView intensity={80} tint="light" style={styles.card}>
        <Image
          source={
            item.logoUrl
              ? { uri: item.logoUrl }
              : require('../../../src/assets/logos/shine.jpg')
          }
          style={styles.logo}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>
            {item.location || 'Байршил мэдээлэлгүй'}
          </Text>
          <Text style={styles.rating}>
            ⭐ {item.rating?.toFixed ? item.rating.toFixed(1) : item.rating}
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#64748B' }}>Ачаалж байна…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!error && (
        <TouchableOpacity onPress={fetchCompanies}>
          <Text style={{ color: '#ef4444', marginBottom: 8 }}>
            {error} — Дахин оролдох
          </Text>
        </TouchableOpacity>
      )}

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
        {[
          { id: 'all', name: 'Бүгд' },
          { id: '24/7', name: '24/7' },
          { id: 'best', name: 'Шилдэг' },
          { id: 'nearby', name: 'Ойр орчим' },
        ].map((cat) => (
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ padding: 16, color: '#64748B' }}>Мэдээлэл алга</Text>
        }
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
  cardWrapper: { marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
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
