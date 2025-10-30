import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

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
];

export default function CarWashDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { carWashId } = route.params;

  const carWash = carWashes.find((c) => c.id === carWashId);

  if (!carWash) return <Text>Угаалгын газар олдсонгүй</Text>;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn}>
        <Text style={{ color: '#5c6bc0', fontWeight: 'bold' }}>← Буцах</Text>
      </TouchableOpacity>

      <Image source={carWash.logo} style={styles.mainImage} />

      <View style={styles.headerContainer}>
        <Image source={carWash.logo} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{carWash.name}</Text>
          <Text style={styles.location}>{carWash.location}</Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>⭐ Үнэлгээ: {carWash.rating}</Text>
      </View>

      <Text style={styles.description}>
        Манай авто угаалга нь хамгийн сүүлийн үеийн тоног төхөөрөмжөөр
        тоноглогдсон бөгөөд таны машинд мэргэжлийн цэвэрлэгээ үйлчилгээ үзүүлнэ.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Цаг захиалах</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginBottom: 20,
  },
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
