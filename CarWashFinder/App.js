import React, { useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const carWashLocations = [
  {
    id: '1',
    name: 'Shine Car Wash',
    latitude: 47.9185,
    longitude: 106.917,
    phone: '7575 8580',
    email: 'info@ubrobotic.com',
    address: 'District Bayanzurkh, UB tower office, Ulaanbaatar',
    hours: '08:00 - 23:00',
    images: [
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: '2',
    name: 'Premium Auto Wash',
    latitude: 47.9225,
    longitude: 106.920,
    phone: '8888 9999',
    email: 'contact@premiumwash.mn',
    address: 'Khan-Uul District, Peace Avenue, Ulaanbaatar',
    hours: '07:00 - 22:00',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

const serviceTypes = [
  { 
    id: 'premium', 
    name: 'Бүгэн угаалга', 
    icon: '⭐', 
    price: '45000₮',
    description: 'Гадна талаар бүрэн угаах, доторх засах ухаантай'
  },
  { 
    id: 'exterior', 
    name: 'Гадна угаалга', 
    icon: '🚗', 
    price: '25000₮',
    description: 'Машины гадна талбар бүрэн угаах'
  },
  { 
    id: 'interior', 
    name: 'Салон цэвэрлэгээ', 
    icon: '🧽', 
    price: '35000₮',
    description: 'Доторх бүрэн цэвэрлэх, үнэрлэгээ'
  }
];

const workers = [
  { id: 1, name: 'Баяр', rating: 4.9, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'Болд', rating: 4.8, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Батаа', rating: 4.7, image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'Батбаяр', rating: 4.9, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' }
];

export default function App() {
  const [selectedCarWash, setSelectedCarWash] = useState(null);
  const [activeServiceType, setActiveServiceType] = useState('premium');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMarkerPress = (location) => {
    setSelectedCarWash(location);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCarWash(null);
  };

  const handleServiceTypeSelect = (serviceId) => {
    console.log('Service selected:', serviceId);
    console.log('Previous service:', activeServiceType);
    setActiveServiceType(serviceId);
    console.log('New service should be:', serviceId);
  };

  const handleWorkerSelect = (workerId) => {
    console.log('Worker selected:', workerId);
    setSelectedWorker(workerId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 47.9185,
          longitude: 106.917,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {carWashLocations.map((loc) => (
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
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.sheetContent} contentContainerStyle={{ paddingBottom: 40 }}>
              {selectedCarWash && (
                <>
                  {/* Header */}
                  <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{selectedCarWash.name}</Text>
                      <Text style={styles.detailText}>📞 {selectedCarWash.phone}</Text>
                      <Text style={styles.detailText}>📧 {selectedCarWash.email}</Text>
                      <Text style={styles.detailText}>🕗 {selectedCarWash.hours}</Text>
                      <Text style={styles.detailText}>📍 {selectedCarWash.address}</Text>
                    </View>
                    <View style={styles.logoContainer}>
                      <Text style={styles.logoText}>🚗</Text>
                    </View>
                  </View>

                  {/* Service types header */}
                  <Text style={styles.sectionTitle}>Угаалгын төрөл</Text>
                  <Text style={styles.debugText}>Сонгосон: {activeServiceType}</Text>
                  
                  {/* Service types selection */}
                  <View style={styles.serviceTypeGrid}>
                    {serviceTypes.map((service) => (
                      <TouchableOpacity
                        key={service.id}
                        style={[
                          styles.serviceTypeCard,
                          activeServiceType === service.id && styles.activeServiceCard,
                        ]}
                        onPress={() => handleServiceTypeSelect(service.id)}
                      >
                        <Text style={styles.serviceIcon}>{service.icon}</Text>
                        <Text style={[
                          styles.serviceName,
                          activeServiceType === service.id && styles.activeServiceText
                        ]}>{service.name}</Text>
                        <Text style={[
                          styles.serviceDescription,
                          activeServiceType === service.id && styles.activeServiceText
                        ]}>{service.description}</Text>
                        <Text style={[
                          styles.servicePrice,
                          activeServiceType === service.id && styles.activeServicePrice
                        ]}>{service.price}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Appointment date */}
                  <View style={styles.appointmentSection}>
                    <Text style={styles.sectionTitle}>Цаг авах</Text>
                    <View style={styles.dateTimeRow}>
                      <Text style={styles.dateText}>Jun 10, 2025</Text>
                      <Text style={styles.timeText}>9:40 AM</Text>
                    </View>
                  </View>

                  {/* Workers section */}
                  <Text style={styles.sectionTitle}>Ажилчид</Text>
                  <Text style={styles.workerStatus}>Active</Text>
                  
                  <View style={styles.workersGrid}>
                    {workers.map((worker) => (
                      <TouchableOpacity
                        key={worker.id}
                        style={[
                          styles.workerCard,
                          selectedWorker === worker.id && styles.selectedWorkerCard
                        ]}
                        onPress={() => handleWorkerSelect(worker.id)}
                      >
                        <Image source={{ uri: worker.image }} style={styles.workerImage} />
                        <Text style={styles.workerName}>{worker.name}</Text>
                        <View style={styles.ratingContainer}>
                          <Text style={styles.ratingText}>⭐ {worker.rating}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Book button */}
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Захиалга батлахдаа хүлээх</Text>
                  </TouchableOpacity>

                  {/* Image gallery */}
                  {selectedCarWash.images && selectedCarWash.images.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.imageGallery}
                      contentContainerStyle={{ paddingRight: 20 }}
                    >
                      {selectedCarWash.images.map((uri, index) => (
                        <Image
                          key={index}
                          source={{ uri }}
                          style={styles.galleryImage}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  )}

                  {/* Bottom large image */}
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80' }}
                    style={styles.bottomImage}
                    resizeMode="cover"
                  />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '70%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  sheetContent: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  serviceTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  serviceTypeCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  activeServiceCard: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  serviceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 14,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007bff',
  },
  activeServiceText: {
    color: 'white',
  },
  activeServicePrice: {
    color: 'white',
    fontWeight: '800',
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  appointmentSection: {
    marginBottom: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  workerStatus: {
    fontSize: 14,
    color: '#28a745',
    marginBottom: 12,
  },
  workersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  workerCard: {
    width: (Dimensions.get('window').width - 60) / 4,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedWorkerCard: {
    backgroundColor: '#ffc107',
    borderWidth: 3,
    borderColor: '#ff8c00',
    transform: [{ scale: 1.05 }],
    shadowColor: '#ffc107',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  workerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#6c5ce7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageGallery: {
    marginTop: 20,
  },
  galleryImage: {
    width: 120,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
  },
  bottomImage: {
    width: '100%',
    height: 140,
    marginTop: 20,
    borderRadius: 12,
  },
});
