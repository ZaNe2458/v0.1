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

      const res = await getCompany(carWashId);
      const data = res?.data ?? res;

      setItem({
        id: String(data.id),
        name: data.name,
        description: data.description ?? 'Тайлбар байхгүй.',
        location: data.location ?? 'Байршил мэдээлэлгүй',
        contactEmail: data.contact_email ?? '',
        contactPhone: data.contact_phone ?? '',
        latitude: Number(data.latitude) || null,
        longitude: Number(data.longitude) || null,
        logoUrl: data.logo_url ?? null,
      });
    } catch (e) {
      console.error('Fetch company failed:', e);
      setError('Өгөгдөл татах үед алдаа гарлаа.');
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [carWashId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#64748B' }}>Ачаалж байна…</Text>
      </View>
    );

  if (!item)
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Буцах</Text>
        </TouchableOpacity>
        <Text style={{ marginBottom: 12 }}>
          {error || 'Угаалгын газар олдсонгүй.'}
        </Text>
      </View>
    );

  const mainImgSource =
    !logoFailed && item.logoUrl
      ? { uri: item.logoUrl }
      : require('../../../src/assets/logos/shine.jpg');

  /** 🔹 Цаг захиалах товч → газрын зураг руу очих */
  const handleBookPress = () => {
    navigation.navigate('(drawer)', {
      screen: 'index', // газрын зураг дэлгэц
      params: { focusCompanyId: item.id },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Буцах</Text>
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
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📞 {item.contactPhone || 'Утасны мэдээлэлгүй'}
        </Text>
        <Text style={styles.infoText}>
          📧 {item.contactEmail || 'Имэйл байхгүй'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleBookPress}>
        <Text style={styles.buttonText}>Цаг захиалах</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  container: { flex: 1, padding: 16, paddingTop: 60 },
  backBtn: { marginBottom: 20 },
  backText: { color: '#5c6bc0', fontWeight: 'bold' },
  mainImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: { width: 64, height: 64, borderRadius: 12, marginRight: 16 },
  titleContainer: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  location: { color: '#555' },
  description: { marginBottom: 16, color: '#333' },
  infoBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoText: { color: '#333', marginBottom: 4 },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
