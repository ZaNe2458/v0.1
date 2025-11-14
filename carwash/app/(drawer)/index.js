import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import MapView, { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import { styles } from '../../src/components/styles';
import CalendarMonth from '../../src/components/calendar/CalendarMonth';
import ServicePicker from '../../src/components/booking/ServicePicker';
import WorkerPicker from '../../src/components/booking/WorkerPicker';
import CarTypeSelector from '../../src/components/CarTypeSelector';
import carTypes from '../../data/carTypes';

import { useCompanies } from '../../src/hooks/useCompanies';
import { useCompanyData } from '../../src/hooks/useCompanyData';
import { useTimeSlots } from '../../src/hooks/useTimeSlots';
import { createBooking } from '../../src/api/bookings';
import { UB_COORD } from '../../src/constants/coords';
import { fmtPrice } from '../../src/utils/format';

import { BlurView } from 'expo-blur';

export default function BookingMapScreen() {
  const route = useRoute();
  const focusCompanyId = route.params?.focusCompanyId;

  const mapRef = useRef(null);
  const { companies, loadingCompanies, error, refetch } = useCompanies(mapRef);
  const { services, employees, loading, loadCompanyData } = useCompanyData();
  const { timeSlots } = useTimeSlots();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState('sedan');
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showMonth, setShowMonth] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canBook = !!(activeServiceId && selectedWorker && selectedTime);

  const bookingAt = useMemo(() => {
    if (!selectedTime) return null;
    const [hh, mm] = selectedTime.split(':').map(Number);
    const d = new Date(bookingDate);
    d.setHours(hh, mm, 0, 0);
    return d;
  }, [bookingDate, selectedTime]);

  const focusCompany = (company, animateMs = 800) => {
    if (!company?.latitude || !company?.longitude) return;
    mapRef.current?.animateToRegion(
      {
        latitude: company.latitude,
        longitude: company.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      animateMs
    );
  };

  const openCompanyDetails = (company) => {
    setSelectedCompany(company);
    setModalVisible(true);
    loadCompanyData(company.id);
  };

  const handleMarkerPress = (company) => {
    focusCompany(company, 500);
    openCompanyDetails(company);
  };

  const handleSearchSelect = (company) => {
    setSearchQuery(company.name || '');
    focusCompany(company, 600);
    openCompanyDetails(company);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCompany(null);
    setSelectedTime(null);
  };

  useEffect(() => {
    if (focusCompanyId && companies.length > 0) {
      const target = companies.find((c) => c.id === String(focusCompanyId));
      if (target) {
        focusCompany(target, 1000);
        openCompanyDetails(target);
      }
    }
  }, [focusCompanyId, companies]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCompanies = useMemo(() => {
    if (!normalizedQuery) return companies;
    return companies.filter((c) => {
      const name = c.name?.toLowerCase() || '';
      const address = c.address?.toLowerCase() || '';
      return (
        name.includes(normalizedQuery) || address.includes(normalizedQuery)
      );
    });
  }, [companies, normalizedQuery]);

  const searchSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return filteredCompanies.slice(0, 5);
  }, [filteredCompanies, normalizedQuery]);

  const handleBook = async () => {
    try {
      if (!canBook) return;
      setBookingLoading(true);
      const iso = bookingAt.toISOString();
      const payload = {
        service: Number(activeServiceId),
        employee: Number(selectedWorker.id || selectedWorker),
        booking_time: iso,
        notes: '',
      };
      await createBooking(payload);
      Alert.alert('Амжилттай', 'Захиалга үүслээ.');
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Алдаа', e?.message || 'Серверийн алдаа.');
    } finally {
      setBookingLoading(false);
    }
  };

  const selectedService = useMemo(() => {
    if (!activeServiceId) return null;
    return (
      services.find((s) => String(s.id) === String(activeServiceId)) || null
    );
  }, [services, activeServiceId]);

  const selectedWorkerInfo = useMemo(() => {
    if (!selectedWorker) return null;
    if (typeof selectedWorker === 'object') return selectedWorker;
    return (
      employees.find((e) => String(e.id) === String(selectedWorker)) || null
    );
  }, [selectedWorker, employees]);

  const selectedCarTypeInfo = useMemo(
    () => carTypes.find((c) => c.id === selectedCarType) || null,
    [selectedCarType]
  );

  const bookingDateStr = `${bookingDate.getFullYear()}-${String(
    bookingDate.getMonth() + 1
  ).padStart(2, '0')}-${String(bookingDate.getDate()).padStart(2, '0')}`;

  const bookingSummary = [
    { label: 'Угаалгын газар', value: selectedCompany?.name ?? 'Сонгогдоогүй' },
    {
      label: 'Машины төрөл',
      value: selectedCarTypeInfo?.name ?? 'Сонгогдоогүй',
    },
    {
      label: 'Үйлчилгээ',
      value: selectedService
        ? `${selectedService.name}${
            selectedService.price ? ` • ${fmtPrice(selectedService.price)}` : ''
          }`
        : 'Сонгогдоогүй',
    },
    {
      label: 'Ажилчин',
      value: selectedWorkerInfo?.fullName ?? 'Сонгогдоогүй',
    },
    {
      label: 'Цаг',
      value: bookingAt ? `${bookingDateStr} • ${selectedTime}` : 'Сонгогдоогүй',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      {loadingCompanies ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: '#64748B' }}>
            Газруудыг ачаалж байна…
          </Text>
        </View>
      ) : (
        <>
          {!!error && (
            <TouchableOpacity
              onPress={refetch}
              style={{ position: 'absolute', top: 140, left: 16, zIndex: 10 }}
            >
              <Text style={styles.errorPill}>{error} (дахин оролдох)</Text>
            </TouchableOpacity>
          )}

          <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={UB_COORD}>
            {filteredCompanies.map((c) => (
              <Marker
                key={c.id}
                coordinate={{ latitude: c.latitude, longitude: c.longitude }}
                title={c.name}
                description={c.address}
                onPress={() => handleMarkerPress(c)}
              />
            ))}
          </MapView>
          <BlurView pointerEvents="box-none" style={styles.searchWrapper}>
            <View pointerEvents="box-none">
              <View style={styles.searchBox}>
                <Feather name="search" size={18} color="#64748B" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Угаалгын газар хайх..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {!!searchQuery && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={styles.searchClear}
                  >
                    <Feather name="x" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
              {normalizedQuery.length > 0 && (
                <View style={styles.searchSuggestions}>
                  {searchSuggestions.length ? (
                    searchSuggestions.map((company) => (
                      <TouchableOpacity
                        key={company.id}
                        style={styles.suggestionItem}
                        onPress={() => handleSearchSelect(company)}
                      >
                        <Text style={styles.suggestionTitle}>
                          {company.name}
                        </Text>
                        {!!company.address && (
                          <Text style={styles.suggestionSubtitle}>
                            {company.address}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.searchEmpty}>
                      Тохирох газар олдсонгүй
                    </Text>
                  )}
                </View>
              )}
            </View>
          </BlurView>
        </>
      )}

      {/* === Modal хэсэг === */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCloseModal}
            style={styles.mapTouchZone}
          />

          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeBtn}
            >
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>

            {selectedCompany && (
              <ScrollView
                contentContainerStyle={{ padding: 20, paddingTop: 40 }}
              >
                <View style={styles.header}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{selectedCompany.name}</Text>
                    {!!selectedCompany.phone && (
                      <Text style={styles.detail}>
                        📞 {selectedCompany.phone}
                      </Text>
                    )}
                    {!!selectedCompany.email && (
                      <Text style={styles.detail}>
                        📧 {selectedCompany.email}
                      </Text>
                    )}
                    {!!selectedCompany.address && (
                      <Text style={styles.detail}>
                        📍 {selectedCompany.address}
                      </Text>
                    )}
                  </View>
                  <Image
                    source={
                      selectedCompany.logoUrl
                        ? { uri: selectedCompany.logoUrl }
                        : require('../../src/assets/logos/shine.jpg')
                    }
                    style={styles.logo}
                  />
                </View>

                <Text style={styles.section}>Машины төрөл</Text>
                <CarTypeSelector
                  carTypes={carTypes}
                  selectedCarType={selectedCarType}
                  onSelect={setSelectedCarType}
                />

                <Text style={styles.section}>Үйлчилгээ</Text>
                <ServicePicker
                  services={services}
                  activeServiceId={activeServiceId}
                  onSelect={setActiveServiceId}
                  fmtPrice={fmtPrice}
                />

                <Text style={[styles.section, { marginTop: 12 }]}>Ажилчид</Text>
                <WorkerPicker
                  workers={employees}
                  selectedWorker={selectedWorker}
                  onSelect={setSelectedWorker}
                  loading={loading.employees}
                />

                <Text style={[styles.section, { marginTop: 12 }]}>
                  Цаг захиалах
                </Text>

                <View style={styles.slotCard}>
                  {/* Он сар сонгох хэсэг */}
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: '#EEF2FF',
                      marginBottom: 8,
                    }}
                    onPress={() => setShowMonth((v) => !v)}
                  >
                    <Text style={{ color: '#1E3A8A', fontWeight: '600' }}>
                      {bookingDate.getFullYear()} оны{' '}
                      {bookingDate.getMonth() + 1} сар ▼
                    </Text>
                  </TouchableOpacity>

                  {showMonth && (
                    <View
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 10,
                        marginBottom: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                      }}
                    >
                      <CalendarMonth
                        date={bookingDate}
                        onChange={(d) => {
                          setBookingDate(d);
                          setShowMonth(false);
                        }}
                      />
                    </View>
                  )}

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.slotRow}
                  >
                    {timeSlots.map((t) => {
                      const active = selectedTime === t;
                      return (
                        <TouchableOpacity
                          key={t}
                          onPress={() => setSelectedTime(t)}
                          style={[
                            styles.slotChip,
                            active && styles.slotChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotChipText,
                              active && styles.slotChipTextActive,
                            ]}
                          >
                            {t}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Захиалгын мэдээлэл</Text>
                  {bookingSummary.map((item) => (
                    <View key={item.label} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{item.label}</Text>
                      <Text style={styles.summaryValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.bookBtn,
                    { opacity: canBook && !bookingLoading ? 1 : 0.6 },
                  ]}
                  disabled={!canBook || bookingLoading}
                  onPress={handleBook}
                >
                  <Text style={styles.bookText}>
                    {bookingLoading
                      ? 'Илгээж байна…'
                      : 'Захиалга баталгаажуулах'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
