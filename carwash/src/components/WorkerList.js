import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';

export default function WorkerList({ workers, selectedWorker, onSelect }) {
  const width = (Dimensions.get('window').width - 60) / 3;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {workers.map((worker) => (
        <TouchableOpacity
          key={worker.id}
          style={{
            width,
            height: 150,
            alignItems: 'center',
            padding: 8,
            borderRadius: 8,
            backgroundColor:
              selectedWorker === worker.id ? '#fff3cd' : '#f8f9fa',
            borderWidth: selectedWorker === worker.id ? 2 : 0,
            borderColor:
              selectedWorker === worker.id ? '#ffc107' : 'transparent',
            marginRight: 10,
          }}
          onPress={() => onSelect(worker.id)}
        >
          <Image
            source={{ uri: worker.image }}
            style={{ width: 70, height: 70, borderRadius: 25, marginBottom: 6 }}
          />
          <Text style={{ fontWeight: '500' }}>{worker.name}</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            ⭐ {worker.rating}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
