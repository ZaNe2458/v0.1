// app/(drawer)/wash/CarWashDetail.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { api } from '../../../src/api/client';
import { API_PATHS } from '../../../src/config/constants';
import { getCompany } from '../../../src/api/companies';

export default function CarWashDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { carWashId } = route.params || {};

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [logoFailed, setLogoFailed] = useState(false);

  const fetchCompany = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const data = await getCompany(carWashId); // ← API layer
      setItem({
        id: String(data.id),
        name: data.name,
        location: data.location ?? data.address ?? '',
        rating: data.avg_rating ?? data.rating ?? 0,
        logoUrl: data.logo_url ?? data.logo ?? null,
        description: data.description ?? '',
      });
    } catch {
      setError('Өгөгдөл татах үед алдаа гарлаа.');
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [carWashId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  if (loading) {
    return (
      <View
        style={{ flex: 1, padding: 16, paddingTop: 60, alignItems: 'center' }}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#64748B' }}>Ачаалж байна…</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={{ flex: 1, padding: 16, paddingTop: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={{ color: '#5c6bc0', fontWeight: 'bold', marginBottom: 12 }}
          >
            ← Буцах
          </Text>
        </TouchableOpacity>
        <Text style={{ marginBottom: 12 }}>
          {error || 'Угаалгын газар олдсонгүй'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={fetchCompany}>
          <Text style={styles.buttonText}>Дахин оролдох</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mainImgSource =
    !logoFailed && item.logoUrl
      ? { uri: item.logoUrl }
      : require('../../../src/assets/logos/shine.jpg');

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#5c6bc0', fontWeight: 'bold' }}>← Буцах</Text>
      </TouchableOpacity>

      <Image
        source={mainImgSource}
        onError={() => setLogoFailed(true)}
        style={styles.mainImage}
      />

      <View style={styles.headerContainer}>
        <Image
          source={mainImgSource}
          onError={() => setLogoFailed(true)}
          style={styles.logo}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>
            {item.location || 'Байршил мэдээлэлгүй'}
          </Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>
          ⭐ Үнэлгээ:{' '}
          {item.rating?.toFixed ? item.rating.toFixed(1) : item.rating}
        </Text>
      </View>

      <Text style={styles.description}>
        {item.description || 'Тайлбар байхгүй.'}
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Цаг захиалах</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backBtn: { marginBottom: 20 },
  container: { flex: 1, padding: 16, paddingTop: 60 },
  mainImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: { width: 64, height: 64, borderRadius: 12, marginRight: 16 },
  titleContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  location: { color: '#555' },
  ratingContainer: { marginBottom: 16 },
  rating: { fontWeight: '600' },
  description: { marginBottom: 16, color: '#333' },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
