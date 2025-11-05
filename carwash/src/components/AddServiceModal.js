import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function AddServiceModal({
  visible,
  onClose,
  services,
  checked,
  onToggle,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxHeight: '80%',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
            Нэмэлт угаалга сонгох
          </Text>
          <ScrollView>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => onToggle(service.id)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderColor: '#eee',
                  paddingVertical: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: '#007bff',
                      marginRight: 10,
                      backgroundColor: checked[service.id]
                        ? '#007bff'
                        : 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {checked[service.id] && (
                      <Text style={{ color: 'white' }}>✓</Text>
                    )}
                  </View>
                  <View>
                    <Text style={{ fontWeight: '600' }}>{service.name}</Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      {service.description}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontWeight: '600', color: '#007bff' }}>
                  {service.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: '#007bff',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
            onPress={onClose}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Хадгалах
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
