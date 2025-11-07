// carwash/app/components/ServiceTypeSelector.js
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';

export default function ServiceTypeSelector({
  serviceTypes,
  activeServiceType,
  onSelect,
  items = [],
  onPickItem,
}) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {serviceTypes.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={{
              minWidth: 120,
              backgroundColor:
                activeServiceType === service.id ? '#e7f8ff' : '#f8f9fa',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
              borderWidth: activeServiceType === service.id ? 1 : 0,
              borderColor: '#38bdf8',
            }}
            onPress={() => onSelect(service.id)}
          >
            {!!service.icon && (
              <Text style={{ fontSize: 22, marginBottom: 6 }}>
                {service.icon}
              </Text>
            )}
            <Text style={{ fontWeight: '600', textAlign: 'center' }}>
              {service.name}
            </Text>
            {!!service.description && (
              <Text
                style={{ fontSize: 11, color: '#666', textAlign: 'center' }}
              >
                {service.description}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {!!items?.length && (
        <View style={{ marginTop: 10 }}>
          {items.map((it) => (
            <TouchableOpacity
              key={it.id}
              onPress={() => onPickItem && onPickItem(it.id)}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: '#eef2f7',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontWeight: '600' }}>{it.name}</Text>
                {!!it.description && (
                  <Text style={{ fontSize: 12, color: '#667085' }}>
                    {it.description}
                  </Text>
                )}
                {!!it.duration && (
                  <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                    {it.duration} мин
                  </Text>
                )}
              </View>
              <Text style={{ fontWeight: '700', color: '#007bff' }}>
                {it.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
