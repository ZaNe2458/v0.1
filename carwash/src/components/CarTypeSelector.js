import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';

export default function CarTypeSelector({
  carTypes,
  selectedCarType,
  onSelect,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {carTypes.map((carType) => (
        <TouchableOpacity
          key={carType.id}
          style={{
            width: '30%',
            alignItems: 'center',
            marginBottom: 16,
            padding: 10,
            borderRadius: 12,
            backgroundColor:
              selectedCarType === carType.id ? '#007bff' : '#f0f0f0',
          }}
          onPress={() => onSelect(carType.id)}
        >
          <Image
            source={carType.image}
            style={{ width: 70, height: 70, resizeMode: 'contain' }}
          />
          <Text
            style={{
              color: selectedCarType === carType.id ? '#fff' : '#333',
              fontWeight: '600',
            }}
          >
            {carType.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
