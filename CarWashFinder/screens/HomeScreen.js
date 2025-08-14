import React, { useRef, useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';

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
    Platform
} from 'react-native';

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
    { id: 'sedan', name: 'Седан', icon: '🚗' },
    { id: 'suv', name: 'Жийп', icon: '🚙' },
    { id: 'truck', name: 'Ачааны', icon: '🚚' },
    { id: 'van', name: 'Транзит', icon: '🚐' },
    { id: 'motorcycle', name: 'Мотор', icon: '🏍️' },
    { id: 'bus', name: 'Автобус', icon: '🚌' }
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
    },
    {
        id: 'interiors',
        name: 'Салон цэвэрлэгээ',
        icon: '🧽',
        price: '35000₮',
        description: 'Доторх бүрэн цэвэрлэх, үнэрлэгээ'
    }
];

const additionalServices = [
    { id: '1', name: 'Дрилл өнгөлгөө', description: 'Дрилл өнгөлгөө угаах, өнгөлөх', price: '25000₮' },
    { id: '2', name: 'Суудлын бүрээс', description: 'Дэрэн хөвөнг цэвэрлэх угаах, угаалг', price: '25000₮' },
    { id: '3', name: 'Мотор угаах', description: 'Мотор хэсгийг угаах, шүрших', price: '25000₮' },
    { id: '4', name: 'Скоч арилгах', description: 'Скоч, наалт арилгах', price: '25000₮' },
    { id: '5', name: 'Гэрэл өнгөлгөө', description: 'Гэрлийн гадаргуу өнгөлөх', price: '25000₮' },
    { id: '6', name: 'Борооны дусал арилгах', description: 'Шилэн дээрх толбо арилгах', price: '25000₮' },
];

const workers = [
    { id: 1, name: 'Баяр', rating: 4.9, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { id: 2, name: 'Болд', rating: 4.8, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
    { id: 3, name: 'Батаа', rating: 4.7, image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' },
    { id: 4, name: 'Батбаяр', rating: 4.9, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
    { id: 5, name: 'Сүх', rating: 4.6, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
];


export default function App() {

    const [selectedCarWash, setSelectedCarWash] = useState(null);
    const [activeServiceType, setActiveServiceType] = useState('premium');
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCarType, setSelectedCarType] = useState('sedan');
    const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
    const [checkedServices, setCheckedServices] = useState({});
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = () => {
        setShowPicker(true);
    };

    const handleMarkerPress = (location) => {
        setSelectedCarWash(location);
        setModalVisible(true);
    };
    const handleCarTypeSelect = (carTypeId) => {

        // Show alert to confirm button press is working
        const carTypeName = carTypes.find(ct => ct.id === carTypeId)?.name || carTypeId;


        setSelectedCarType(carTypeId);

    };
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedCarWash(null);
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
                                    {/* car wash types */}
                                    <Text style={styles.sectionTitle}>Машины төрөл</Text>
                                    <View style={styles.carTypeGrid}>
                                        {carTypes.map((carType) => (
                                            <TouchableOpacity
                                                key={carType.id}
                                                style={[
                                                    styles.carTypeButton,
                                                    selectedCarType === carType.id && styles.activeCarTypeButton,
                                                ]}
                                                onPress={() => handleCarTypeSelect(carType.id)}
                                            >
                                                <Text style={styles.carTypeIcon}>{carType.icon}</Text>
                                                <Text style={[
                                                    styles.carTypeName,
                                                    selectedCarType === carType.id && styles.activeCarTypeText
                                                ]}>{carType.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {/* Service types header */}
                                    <Text style={styles.sectionTitle}>Угаалгын төрөл</Text>

                                    {/* Service types selection */}
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.serviceTypeScroll}
                                        contentContainerStyle={styles.serviceTypeGrid}
                                    >
                                        {serviceTypes.map((service) => (
                                            <TouchableOpacity
                                                key={service.id}
                                                style={[
                                                    styles.serviceTypeCard,
                                                    activeServiceType === service.id && styles.activeServiceCard,
                                                ]}
                                                onPress={() => setActiveServiceType(service.id)}
                                            >
                                                <Text style={styles.serviceIcon}>{service.icon}</Text>
                                                <Text style={styles.serviceName}>{service.name}</Text>
                                                <Text style={styles.serviceDescription}>{service.description}</Text>
                                                <Text style={styles.servicePrice}>{service.price}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    <TouchableOpacity
                                        style={{
                                            marginTop: 10,
                                            backgroundColor: '#eee',
                                            padding: 10,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => setAddServiceModalVisible(true)}
                                    >
                                        <Text style={{ fontSize: 16, fontWeight: '600' }}>➕ Нэмэлт угаалга сонгох</Text>
                                    </TouchableOpacity>
                                    <Modal
                                        visible={addServiceModalVisible}
                                        animationType="slide"
                                        transparent
                                        onRequestClose={() => setAddServiceModalVisible(false)}
                                    >
                                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: 'white',
                                                borderRadius: 12,
                                                padding: 20,
                                                width: '90%',
                                                maxHeight: '80%',
                                            }}>
                                                <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Нэмэлт угаалга сонгох</Text>

                                                <ScrollView>
                                                    {additionalServices.map((service) => (
                                                        <TouchableOpacity
                                                            key={service.id}
                                                            onPress={() =>
                                                                setCheckedServices((prev) => ({
                                                                    ...prev,
                                                                    [service.id]: !prev[service.id],
                                                                }))
                                                            }
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
                                                                        backgroundColor: checkedServices[service.id] ? '#007bff' : 'white',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    {checkedServices[service.id] && (
                                                                        <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>
                                                                    )}
                                                                </View>

                                                                <View>
                                                                    <Text style={{ fontWeight: '600' }}>{service.name}</Text>
                                                                    <Text style={{ fontSize: 12, color: '#666' }}>{service.description}</Text>
                                                                </View>
                                                            </View>

                                                            <Text style={{ fontWeight: '600', color: '#007bff' }}>{service.price}</Text>
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
                                                    onPress={() => setAddServiceModalVisible(false)}
                                                >
                                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Хадгалах</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>

                                    {/* Appointment date */}
                                    <View style={styles.appointmentSection}>
                                        <Text style={styles.sectionTitle}>Цаг авах</Text>

                                        <TouchableOpacity onPress={showMode}>
                                            <View style={styles.dateTimeRow}>
                                                <Text style={styles.dateText}>
                                                    {date.toLocaleDateString()}
                                                </Text>
                                                <Text style={styles.timeText}>
                                                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        {showPicker && (
                                            <DateTimePicker
                                                value={date}
                                                mode="datetime"
                                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                                onChange={onChange}
                                            />
                                        )}
                                    </View>


                                    {/* Workers section */}
                                    <Text style={styles.sectionTitle}>Ажилчид</Text>
                                    <Text style={styles.workerStatus}>Active</Text>

                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.serviceTypeScroll}
                                        contentContainerStyle={styles.serviceTypeGrid}
                                    >
                                        {workers.map((worker) => (
                                            <TouchableOpacity
                                                key={worker.id}
                                                style={[
                                                    styles.workerCard,
                                                    selectedWorker === worker.id && styles.selectedWorkerCard
                                                ]}
                                                onPress={() => setSelectedWorker(worker.id)}
                                            >
                                                <Image source={{ uri: worker.image }} style={styles.workerImage} />
                                                <Text style={styles.workerName}>{worker.name}</Text>
                                                <View style={styles.ratingContainer}>
                                                    <Text style={styles.ratingText}>⭐ {worker.rating}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    {/* Book button */}
                                    <TouchableOpacity style={styles.bookButton}>
                                        <Text style={styles.bookButtonText}>Захиалга баталгаажуулах</Text>
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
                            )
                            }
                        </ScrollView >
                    </View >
                </View >
            </Modal >
        </View >
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
    carTypeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    carTypeButton: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e9ecef',
    },
    activeCarTypeButton: {
        backgroundColor: '#ff6b35',
        borderColor: '#ff6b35',
        borderWidth: 3,
        transform: [{ scale: 1.05 }],
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
    carTypeIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    carTypeName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    activeCarTypeText: {
        color: 'white',
        fontWeight: '700',
    },
    serviceTypeGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
        paddingRight: 150,
    },

    serviceTypeCard: {
        width: 120,
        flex: 1,
        minWidth: '30%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    activeServiceCard: {
        backgroundColor: '#e7f8ff',
        borderColor: '#007bff',
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
    appointmentSection: {
        marginBottom: 20,
    },
    appointmentSection: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dateTimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
    },
    dateText: {
        fontSize: 16,
    },
    timeText: {
        fontSize: 16,
        fontWeight: '600',
    },

    workerStatus: {
        fontSize: 14,
        color: '#28a745',
        marginBottom: 12,
    },
    workersGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
        paddingRight: 50,
    },
    workerCard: {
        width: (Dimensions.get('window').width - 60) / 3,
        height: 150,
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    selectedWorkerCard: {
        backgroundColor: '#fff3cd',
        borderWidth: 2,
        borderColor: '#ffc107',
    },
    workerImage: {
        width: 70,
        height: 70,
        borderRadius: 25,
        marginBottom: 6,
    },
    workerName: {
        fontSize: 14,
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
