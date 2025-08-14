import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CarWashDetailScreen({ route }) {
    const { carWash } = route.params;

    return (
        <ScrollView style={styles.container}>
            {/* Угаалгын газрын зураг */}
            <Image source={require('../assets/logos/shine.jpg')} style={styles.mainImage} />

            {/* Лого болон нэр */}
            <View style={styles.headerContainer}>
                <Image source={carWash.logo} style={styles.logo} />
                <View style={styles.titleContainer}>
                    <Text style={styles.name}>{carWash.name}</Text>
                    <Text style={styles.location}>{carWash.location}</Text>
                </View>
            </View>

            {/* Үнэлгээ */}
            <Text style={styles.rating}>⭐ Үнэлгээ: {carWash.rating}</Text>

            {/* Тайлбар */}
            <Text style={styles.description}>
                Манай авто угаалга нь хамгийн сүүлийн үеийн тоног төхөөрөмжөөр тоноглогдсон бөгөөд таны машинд мэргэжлийн цэвэрлэгээ үйлчилгээ үзүүлнэ. Бид хурдан, найдвартай, тав тухтай үйлчилгээ санал болгодог.
            </Text>

            {/* Захиалга товч */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Цаг захиалах</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    mainImage: { width: '100%', height: 200, resizeMode: 'cover' },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -40,
        marginHorizontal: 16,
        padding: 12,
        backgroundColor: '#ffffffcc',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    logo: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },
    titleContainer: { flex: 1 },
    name: { fontSize: 20, fontWeight: 'bold' },
    location: { color: '#666' },
    rating: {
        marginTop: 12,
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    description: {
        marginTop: 16,
        marginHorizontal: 16,
        fontSize: 16,
        lineHeight: 22,
        color: '#444',
    },
    button: {
        marginTop: 24,
        backgroundColor: '#007bff',
        paddingVertical: 14,
        marginHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
