import React, { useState } from 'react';
import ConfirmBookingModal from '../../src/components/ConfirmBookingModal';

import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';

import { carWashList } from '../../data/carWashList';
import carTypes from '../../data/carTypes';
import { serviceTypes } from '../../data/serviceTypes';
import { workers } from '../../data/workers';
import { additionalServices } from '../../data/additionalServices';

import CarTypeSelector from '../../src/components/CarTypeSelector';
import ServiceTypeSelector from '../../src/components/ServiceTypeSelector';
import AddServiceModal from '../../src/components/AddServiceModal';
import WorkerList from '../../src/components/WorkerList';

export default function App() {
  const [selectedCarWash, setSelectedCarWash] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState('sedan');
  const [activeServiceType, setActiveServiceType] = useState('premium');
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [checkedServices, setCheckedServices] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleMarkerPress = (loc) => {
    setSelectedCarWash(loc);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCarWash(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 47.9185,
          longitude: 106.917,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {carWashList.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.name}
            onPress={() => handleMarkerPress(loc)}
          />
        ))}
      </MapView>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedCarWash && (
              <ScrollView
                contentContainerStyle={{ padding: 20, paddingTop: 50 }}
              >
                <View style={styles.header}>
                  <View style={{ flex: 1, gap: 10 }}>
                    <Text style={styles.title}>{selectedCarWash.name}</Text>
                    <Text style={styles.detail}>
                      📞 {selectedCarWash.phone}
                    </Text>
                    <Text style={styles.detail}>
                      📧 {selectedCarWash.email}
                    </Text>
                    <Text style={styles.detail}>
                      🕗 {selectedCarWash.hours}
                    </Text>
                    <Text style={styles.detail}>
                      📍 {selectedCarWash.address}
                    </Text>
                  </View>
                  <Image
                    source={selectedCarWash.images[0]}
                    style={styles.logo}
                  />
                </View>

                <Text style={styles.section}>Машины төрөл</Text>
                <CarTypeSelector
                  carTypes={carTypes}
                  selectedCarType={selectedCarType}
                  onSelect={setSelectedCarType}
                />

                <Text style={styles.section}>Угаалгын төрөл</Text>
                <ServiceTypeSelector
                  serviceTypes={serviceTypes}
                  activeServiceType={activeServiceType}
                  onSelect={setActiveServiceType}
                />

                <TouchableOpacity
                  style={styles.addServiceBtn}
                  onPress={() => setAddServiceModalVisible(true)}
                >
                  <Text>➕ Нэмэлт угаалга сонгох</Text>
                </TouchableOpacity>

                <AddServiceModal
                  visible={addServiceModalVisible}
                  onClose={() => setAddServiceModalVisible(false)}
                  services={additionalServices}
                  checked={checkedServices}
                  onToggle={(id) =>
                    setCheckedServices((p) => ({ ...p, [id]: !p[id] }))
                  }
                />

                <Text style={[styles.section, { marginTop: 10 }]}>Ажилчид</Text>
                <WorkerList
                  workers={workers}
                  selectedWorker={selectedWorker}
                  onSelect={setSelectedWorker}
                />

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => setConfirmVisible(true)}
                >
                  <Text style={styles.bookText}>Захиалга баталгаажуулах</Text>
                </TouchableOpacity>

                <ConfirmBookingModal
                  visible={confirmVisible}
                  onClose={() => setConfirmVisible(false)}
                  selectedCarType={selectedCarType}
                  activeServiceType={activeServiceType}
                  checkedServices={checkedServices}
                  additionalServices={additionalServices}
                  selectedWorker={selectedWorker}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '70%',
  },
  closeButton: { position: 'absolute', top: 15, right: 20, zIndex: 1 },
  closeButtonText: { fontSize: 18, fontWeight: 'bold' },
  header: { flexDirection: 'row', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  detail: { color: '#555', fontSize: 14 },
  logo: { width: 90, height: 90, borderRadius: 10 },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 10,
  },
  addServiceBtn: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  bookBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  bookText: { color: 'white', fontWeight: '600' },
});
