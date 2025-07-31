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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetHandle } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

const carTypes = [
  { id: 'small', name: 'Жижиг тэрэг', icon: '🚗' },
  { id: 'medium', name: 'Дунд оврын', icon: '🚙' },
  { id: 'jeep', name: 'Жийп', icon: '🚐' },
  { id: 'bigJeep', name: 'Том оврын жийп', icon: '🚛' },
  { id: 'van', name: 'Транзит', icon: '🚚' },
  { id: 'moto', name: 'Мотоцикл', icon: '🏍️' },
];

export default function App() {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['60%'], []);
  const [selectedCarWash, setSelectedCarWash] = useState(null);
  const [activeCarType, setActiveCarType] = useState('small');

  const handleMarkerPress = (location) => {
    setSelectedCarWash(location);
    bottomSheetModalRef.current?.present();
  };

  const handleSheetDismiss = () => {
    setSelectedCarWash(null);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
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

        <BottomSheetModal 
          ref={bottomSheetModalRef} 
          index={0} 
          snapPoints={snapPoints}
          onDismiss={handleSheetDismiss}
          handleComponent={() => <BottomSheetHandle />}
        >
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

                {/* Car types selection */}
                {carTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.carTypeBox,
                      activeCarType === type.id && styles.activeBox,
                    ]}
                    onPress={() => setActiveCarType(type.id)}
                  >
                    <Text style={styles.carIcon}>{type.icon}</Text>
                    <Text style={styles.carTypeText}>{type.name}</Text>
                    <Text style={styles.arrow}>{'>'}</Text>
                  </TouchableOpacity>
                ))}

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
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
  sheetContent: {
    padding: 20,
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
  carTypeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  activeBox: {
    backgroundColor: '#b9ff3c',
  },
  carIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 40,
    textAlign: 'center',
  },
  carTypeText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
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
