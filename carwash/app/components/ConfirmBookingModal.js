import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function ConfirmBookingModal({
  visible,
  onClose,
  selectedCarType,
  activeServiceType,
  checkedServices,
  additionalServices,
  selectedWorker,
}) {
  const selectedAddServices = additionalServices.filter(
    (s) => checkedServices[s.id]
  );

  const carTypePrice = selectedCarType === 'sedan' ? 15000 : 20000;
  const serviceTypePrice = activeServiceType === 'premium' ? 25000 : 18000;
  const addServicesPrice = selectedAddServices.reduce(
    (sum, s) => sum + s.price,
    0
  );
  const totalPrice = carTypePrice + serviceTypePrice + addServicesPrice;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Захиалгын мэдээлэл</Text>
          <ScrollView style={{ marginTop: 10 }}>
            <Text style={styles.item}>🚗 Машины төрөл: {selectedCarType}</Text>
            <Text style={styles.item}>
              🧼 Угаалгын төрөл: {activeServiceType}
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              Нэмэлт үйлчилгээ:
            </Text>
            {selectedAddServices.length > 0 ? (
              selectedAddServices.map((s) => (
                <Text key={s.id} style={styles.item}>
                  • {s.name} ({s.price}₮)
                </Text>
              ))
            ) : (
              <Text style={styles.item}>- Сонгоогүй -</Text>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              🧑‍🔧 Сонгосон ажилчин:
            </Text>
            {selectedWorker ? (
              <Text style={styles.item}>{selectedWorker.name}</Text>
            ) : (
              <Text style={styles.item}>- Сонгоогүй -</Text>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
              💰 Нийт үнэ:
            </Text>
            <Text style={styles.total}>{totalPrice.toLocaleString()}₮</Text>
          </ScrollView>

          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: '#333' }}>Буцах</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                alert('Захиалга амжилттай илгээгдлээ!');
                onClose();
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                Баталгаажуулах
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  item: { fontSize: 16, marginVertical: 4, color: '#444' },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#000' },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    textAlign: 'right',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
