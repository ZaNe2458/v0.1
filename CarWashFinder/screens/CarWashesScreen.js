import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const carWashes = [
    {
        id: '1',
        name: 'Цэвэр Угаалга',
        location: 'БЗД, 13-р хороолол',
        rating: 4.5,
        logo: require('../assets/logos/shine.jpg'),
    },
    {
        id: '2',
        name: 'Shine Wash',
        location: 'СБД, 5-р хороо',
        rating: 4.7,
        logo: require('../assets/logos/shine.jpg'),
    },
    {
        id: '3',
        name: 'Smart Car Wash',
        location: 'ХУД, 19-р хороо',
        rating: 4.3,
        logo: require('../assets/logos/shine.jpg'),
    },
];

export default function CarWashesScreen() {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigation.navigate('CarWashDetail', { carWash: item })}
        >
            <BlurView intensity={80} tint="light" style={styles.card}>
                <Image source={item.logo} style={styles.logo} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.location}>{item.location}</Text>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                </View>
            </BlurView>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🚘 Угаалгын газрууд</Text>
            <FlatList
                data={carWashes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#e6eaf0' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    cardWrapper: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: 12,
        marginRight: 16,
    },
    textContainer: { flex: 1 },
    name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    location: { color: '#555' },
    rating: { marginTop: 4, fontWeight: '600' },
});
