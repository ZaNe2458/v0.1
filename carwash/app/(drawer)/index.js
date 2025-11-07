import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import carTypes from '../../data/carTypes';
import WorkerList from '../../src/components/WorkerList';
import CarTypeSelector from '../../src/components/CarTypeSelector';
import ServiceTypeSelector from '../../src/components/ServiceTypeSelector';
import AddServiceModal from '../../src/components/AddServiceModal';
import ConfirmBookingModal from '../../src/components/ConfirmBookingModal';

import { listCompanies } from '../../src/api/companies';
import { listServices } from '../../src/api/services';
import { listEmployees } from '../../src/api/employees';

const UB_COORD = {
  latitude: 47.9185,
  longitude: 106.917,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function BookingMapScreen() {
  const mapRef = useRef(null);

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState('');

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [serviceCards, setServiceCards] = useState([]);
  const [servicesRaw, setServicesRaw] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  const [selectedCarType, setSelectedCarType] = useState('sedan');
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [checkedServices, setCheckedServices] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const fmt = (n) => new Intl.NumberFormat('mn-MN').format(Number(n || 0));
  const pickIcon = (name = '') => {
    const n = name.toLowerCase();
    if (/(premium|lux|full|бүрэн)/.test(n)) return '✨';
    if (/(express|fast|түргэн)/.test(n)) return '⚡';
    if (/(interior|дотор)/.test(n)) return '🧽';
    if (/(exterior|гада(н|а))/.test(n)) return '🚗';
    if (/(хамгаалалт|полир|coating)/.test(n)) return '🛡️';
    return '🧼';
  };

  const cacheRef = useRef({ services: new Map(), employees: new Map() });

  // Map
  const fetchCompanies = useCallback(async () => {
    try {
      setError('');
      setLoadingCompanies(true);
      const { results } = await listCompanies();
      const normalized = (results ?? [])
        .map((c) => ({
          id: String(c.id),
          name: c.name,
          address: c.location ?? c.address ?? '',
          email: c.contact_email ?? '',
          phone: c.contact_phone ?? '',
          latitude: Number(c.latitude) || null,
          longitude: Number(c.longitude) || null,
          logoUrl: c.logo_url ?? c.logo ?? null,
          hours: c.hours ?? c.open_hours ?? '',
        }))
        .filter((x) => x.latitude && x.longitude);

      setCompanies(normalized);

      if (normalized.length && mapRef.current) {
        const coords = normalized.map((m) => ({
          latitude: m.latitude,
          longitude: m.longitude,
        }));
        requestAnimationFrame(() =>
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 80, bottom: 80, left: 40, right: 40 },
            animated: true,
          })
        );
      }
    } catch {
      setError('Угаалгын газруудыг татахад алдаа гарлаа.');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (!selectedCompany?.id) return;

    const companyId = selectedCompany.id;

    setServiceCards([]);
    setServicesRaw([]);
    setActiveServiceId(null);
    setWorkers([]);
    setCheckedServices({});
    setLoadingServices(true);
    setLoadingWorkers(true);

    let cancelled = false;

    const loadServices = async () => {
      const cached = cacheRef.current.services.get(companyId);
      if (cached) {
        if (!cancelled) applyServices(cached);
      } else {
        const data = await listServices({ company: companyId });
        if (!cancelled) {
          cacheRef.current.services.set(companyId, data ?? []);
          applyServices(data ?? []);
        }
      }
      if (!cancelled) setLoadingServices(false);
    };

    const loadEmployees = async () => {
      const cachedEmp = cacheRef.current.employees.get(companyId);
      if (cachedEmp) {
        if (!cancelled) setWorkers(cachedEmp);
      } else {
        const emp = await listEmployees({ company: companyId });
        if (!cancelled) {
          cacheRef.current.employees.set(companyId, emp ?? []);
          setWorkers(emp ?? []);
        }
      }
      if (!cancelled) setLoadingWorkers(false);
    };

    const applyServices = (all) => {
      const normalized = (all ?? [])
        .filter((s) => s?.is_active !== false)
        .map((s) => ({
          id: String(s.id),
          name: s.name,
          description: s.description ?? '',
          price: Number(s.price) || 0,
          duration: s.duration ?? '',
        }));

      setServicesRaw(normalized);

      const cards = normalized.map((s) => ({
        id: s.id,
        name: s.name?.toUpperCase() || 'SERVICE',
        icon: pickIcon(s.name),
        description: s.description || 'Үйлчилгээ',
        price: `₮ ${fmt(s.price)}`,
      }));
      setServiceCards(cards);
      if (cards.length) setActiveServiceId(cards[0].id);
    };

    loadServices().catch(() => !cancelled && setLoadingServices(false));
    loadEmployees().catch(() => !cancelled && setLoadingWorkers(false));

    return () => {
      cancelled = true;
    };
  }, [selectedCompany?.id]);

  const handleMarkerPress = (company) => {
    setSelectedCompany(company);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCompany(null);
    setServiceCards([]);
    setServicesRaw([]);
    setWorkers([]);
    setActiveServiceId(null);
    setCheckedServices({});
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
              onPress={fetchCompanies}
              style={{ position: 'absolute', top: 60, left: 16, zIndex: 10 }}
            >
              <Text
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                {error} (дахин оролдох)
              </Text>
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

            {selectedCompany && (
              <ScrollView
                contentContainerStyle={{ padding: 20, paddingTop: 50 }}
              >
                <View style={styles.header}>
                  <View style={{ flex: 1, gap: 10 }}>
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
                    {!!selectedCompany.hours && (
                      <Text style={styles.detail}>
                        🕗 {selectedCompany.hours}
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

                <Text style={styles.section}>Угаалгын төрөл</Text>
                {loadingServices ? (
                  <Text style={{ color: '#64748B', marginBottom: 10 }}>
                    Үйлчилгээ татаж байна…
                  </Text>
                ) : serviceCards.length ? (
                  <ServiceTypeSelector
                    serviceTypes={serviceCards}
                    activeServiceType={activeServiceId}
                    onSelect={setActiveServiceId}
                  />
                ) : (
                  <Text style={{ color: '#64748B' }}>
                    Энэ газарт бүртгэлтэй үйлчилгээ алга.
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.addServiceBtn}
                  onPress={() => setAddServiceModalVisible(true)}
                >
                  <Text>➕ Нэмэлт угаалга сонгох</Text>
                </TouchableOpacity>
                <AddServiceModal
                  visible={addServiceModalVisible}
                  onClose={() => setAddServiceModalVisible(false)}
                  services={[]}
                  checked={checkedServices}
                  onToggle={(id) =>
                    setCheckedServices((p) => ({ ...p, [id]: !p[id] }))
                  }
                />

                <Text style={[styles.section, { marginTop: 10 }]}>Ажилчид</Text>
                {loadingWorkers ? (
                  <Text style={{ color: '#64748B', marginBottom: 10 }}>
                    Ажилчид ачаалж байна…
                  </Text>
                ) : workers.length ? (
                  <WorkerList
                    workers={workers}
                    selectedWorker={selectedWorker}
                    onSelect={setSelectedWorker}
                  />
                ) : (
                  <Text style={{ color: '#64748B', marginBottom: 10 }}>
                    Ажилчин бүртгэлгүй байна.
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => setConfirmVisible(true)}
                  disabled={!activeServiceId}
                >
                  <Text style={styles.bookText}>Захиалга баталгаажуулах</Text>
                </TouchableOpacity>

                <ConfirmBookingModal
                  visible={confirmVisible}
                  onClose={() => setConfirmVisible(false)}
                  selectedCarType={selectedCarType}
                  activeServiceType={activeServiceId}
                  checkedServices={checkedServices}
                  additionalServices={[]}
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
  section: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
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
