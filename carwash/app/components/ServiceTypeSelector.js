import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import carTypes from '../../data/carTypes';

export default function ServiceTypeSelector({
  serviceTypes,
  activeServiceType,
  onSelect,
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {serviceTypes.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={{
            width: 200,
            backgroundColor:
              activeServiceType === service.id ? '#e7f8ff' : '#f8f9fa',
            borderRadius: 12,
            padding: 12,
            alignItems: 'center', // child Text-уудыг center-д байлгах
            justifyContent: 'center',
            marginRight: 10,
          }}
          onPress={() => onSelect(service.id)}
        >
          <Text style={{ fontSize: 24, textAlign: 'center' }}>
            {service.icon}
          </Text>
          <Text style={{ fontWeight: '600', textAlign: 'center' }}>
            {service.name}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: '#666',
              textAlign: 'center',
            }}
          >
            {service.description}
          </Text>
          <Text
            style={{
              fontWeight: '700',
              color: '#007bff',
              textAlign: 'center',
            }}
          >
            {service.price}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
