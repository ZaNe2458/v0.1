import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function ServicePicker({
  services = [],
  activeServiceId,
  onSelect,
}) {
  if (!services.length) {
    return (
      <Text style={{ color: '#64748B' }}>
        Энэ газарт бүртгэлтэй үйлчилгээ алга.
      </Text>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 4 }}
    >
      {services.map((service) => {
        const active = String(service.id) === String(activeServiceId);
        return (
          <TouchableOpacity
            key={service.id}
            style={[styles.card, active && styles.cardActive]}
            onPress={() => onSelect(service.id)}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.icon}>{service.icon || '🧼'}</Text>
                {!!service.price && (
                  <Text style={[styles.price, active && styles.priceActive]}>
                    {service.price}
                  </Text>
                )}
              </View>
              <Text
                numberOfLines={1}
                style={[styles.name, active && styles.nameActive]}
              >
                {service.name || 'Үйлчилгээ'}
              </Text>
              {!!service.description && (
                <Text numberOfLines={1} style={styles.desc}>
                  {service.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    minWidth: 200,
  },
  cardActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563EB',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  nameActive: {
    color: '#1D4ED8',
  },
  desc: {
    fontSize: 12,
    color: '#6B7280',
  },
  price: {
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  priceActive: {
    color: '#1D4ED8',
  },
});
