import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from 'expo-router';

export default function CarsScreen() {
  const [cars, setCars] = useState([
    {
      id: 1,
      plate: '2111-УБА',
      type: 'Жижиг тэрэг',
      model: 'Prius 30',
      image: require('../assets/images/sedan.png'),
    },
    {
      id: 2,
      plate: '1111-УБА',
      type: 'Том оврын жийп',
      model: 'Land Cruiser 300',
      image: require('../assets/images/jeep_b.png'),
    },
  ]);

  const navigation = useNavigation();

  const removeCar = (id) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.model}>{item.model}</Text>
        <Text>{item.plate}</Text>
      </View>
      <TouchableOpacity onPress={() => removeCar(item.id)}>
        <Text style={{ fontSize: 20 }}>❌</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cars}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCarScreen')}
      >
        <Text style={styles.addText}>➕ Машин нэмэх</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  image: { width: 60, height: 40, marginRight: 10 },
  type: { fontWeight: 'bold' },
  model: { fontSize: 16 },
  addButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  addText: { fontSize: 16 },
});
