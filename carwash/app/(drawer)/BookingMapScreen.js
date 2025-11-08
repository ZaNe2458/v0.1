import React, { useRef, useState, useMemo } from 'react';
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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';

import { styles } from '../../src/components/calendar/calendar.styles';
import CalendarHeader from '../../src/components/calendar/CalendarHeader';
import CalendarMonth from '../../src/components/calendar/CalendarMonth';
import CalendarWeek from '../../src/components/calendar/CalendarWeek';

import ServicePicker from '../../src/components/booking/ServicePicker';
import WorkerPicker from '../../src/components/booking/WorkerPicker';
import ExtraServicesModal from '../../src/components/booking/ExtraServicesModal';

import CarTypeSelector from '../../src/components/CarTypeSelector';
import carTypes from '../../data/carTypes';

import { useCompanies } from '../../src/hooks/useCompanies';
import { useCompanyData } from '../../src/hooks/useCompanyData';
import { useTimeSlots } from '../../src/hooks/useTimeSlots';
import { createBooking } from '../../src/api/bookings';
import { UB_COORD } from '../../src/constants/coords';
import { fmtPrice } from '../../src/utils/format';

export default function BookingMapScreen() {
  const mapRef = useRef(null);
  const { companies, loadingCompanies, error, refetch } = useCompanies(mapRef);
  const { services, employees, loading, loadCompanyData } = useCompanyData();
  const { timeSlots } = useTimeSlots();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState('sedan');
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [checkedServices, setCheckedServices] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showMonth, setShowMonth] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const canBook = !!(activeServiceId && selectedWorker && selectedTime);
  const bookingAt = useMemo(() => {
    if (!selectedTime) return null;
    const [hh, mm] = selectedTime.split(':').map(Number);
    const d = new Date(bookingDate);
    d.setHours(hh, mm, 0, 0);
    return d;
  }, [bookingDate, selectedTime]);

  const handleMarkerPress = (company) => {
    setSelectedCompany(company);
    setModalVisible(true);
    loadCompanyData(company.id);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCompany(null);
    setSelectedTime(null);
  };

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
              style={{ position: 'absolute', top: 60, left: 16, zIndex: 10 }}
            >
              <Text style={styles.errorPill}>{error} (дахин оролдох)</Text>
            </TouchableOpacity>
          )}

          <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={UB_COORD}>
            {companies.map((c) => (
              <Marker
                key={c.id}
                coordinate={{ latitude: c.latitude, longitude: c.longitude }}
                title={c.name}
                description={c.address}
                onPress={() => handleMarkerPress(c)}
              />
            ))}
          </MapView>
        </>
      )}

      {/* === MODAL === */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          {/* === 1️⃣ ДЭЭД ТАЛЫН MAP-БҮС ДЭЭР ДАРВАЛ ХААНА === */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCloseModal}
            style={styles.mapTouchZone}
          />

          <View style={styles.modalContent}>
            {/* === 2️⃣ BARUUN DEED BULAND ✕ BUTTON === */}
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
                  <CalendarHeader
                    date={bookingDate}
                    onPrev={() =>
                      setBookingDate(
                        new Date(
                          bookingDate.getFullYear(),
                          bookingDate.getMonth() - 1,
                          1
                        )
                      )
                    }
                    onNext={() =>
                      setBookingDate(
                        new Date(
                          bookingDate.getFullYear(),
                          bookingDate.getMonth() + 1,
                          1
                        )
                      )
                    }
                    onToggleMonth={() => setShowMonth((v) => !v)}
                  />

                  {showMonth ? (
                    <CalendarMonth
                      date={bookingDate}
                      onChange={(d) => setBookingDate(d)}
                    />
                  ) : (
                    <CalendarWeek
                      date={bookingDate}
                      onChange={(d) => setBookingDate(d)}
                    />
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
