import { useSearchParams } from 'expo-router';

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const carWashes = [
  {
    id: '1',
    name: 'Цэвэр Угаалга',
    location: 'БЗД, 13-р хороолол',
    rating: 4.5,
    logo: require('../assets/logos/shine.jpg'),
  },
  {
    id: '2',
    name: 'Shine Wash',
    location: 'СБД, 5-р хороо',
    rating: 4.7,
    logo: require('../assets/logos/shine.jpg'),
  },
  {
    id: '3',
    name: 'Smart Car Wash',
    location: 'ХУД, 19-р хороо',
    rating: 4.3,
    logo: require('../assets/logos/shine.jpg'),
  },
];

export default function CarWashDetailScreen() {
  const { carWashId } = useSearchParams();
  const carWash = carWashes.find((c) => c.id === carWashId);

  if (!carWash) return <Text>Угаалгын газар олдсонгүй</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('../assets/logos/shine.jpg')}
        style={styles.mainImage}
      />

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
