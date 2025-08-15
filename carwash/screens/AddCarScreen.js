import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useState } from 'react';

const BRANDS = ['Toyota', 'Nissan', 'Subaru', 'BMW', 'Chevrolet'];
const MODELS = ['Aqua', 'Corolla', 'Camry', 'Prius 10', 'Prius 20', 'Prius 30', 'Prius 40', 'Premio'];

export default function AddCarScreen() {
    const [plate, setPlate] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    const filteredModels = MODELS.filter(m =>
        m.toLowerCase().includes(modelSearch.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Brand сонго</Text>
            <View style={styles.brandContainer}>
                {BRANDS.map((brand) => (
                    <TouchableOpacity
                        key={brand}
                        style={[
                            styles.brandBox,
                            selectedBrand === brand && styles.selectedBrand
                        ]}
                        onPress={() => setSelectedBrand(brand)}
                    >
                        <Text>{brand}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Машины дугаар оруулах</Text>
            <TextInput
                placeholder="7777 УБА"
                style={styles.input}
                value={plate}
                onChangeText={setPlate}
            />

            <Text style={styles.label}>Машины марк</Text>
            <TextInput
                placeholder="Хайх..."
                style={styles.input}
                value={modelSearch}
                onChangeText={setModelSearch}
            />

            <FlatList
                data={filteredModels}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.modelItem,
                            selectedModel === item && styles.selectedModelItem
                        ]}
                        onPress={() => setSelectedModel(item)}
                    >
                        <Text>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                style={{ maxHeight: 200 }}
            />

            <TouchableOpacity style={styles.addBtn}>
                <Text style={{ color: '#fff' }}>Машин нэмэх</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    label: { marginTop: 12, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 12
    },
    brandContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    brandBox: {
        padding: 8,
        backgroundColor: '#eee',
        borderRadius: 6,
        marginRight: 8,
        marginTop: 8
    },
    selectedBrand: {
        backgroundColor: '#d0e6ff'
    },
    modelItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    selectedModelItem: {
        backgroundColor: '#e0e0ff'
    },
    addBtn: {
        marginTop: 20,
        backgroundColor: '#5c6bc0',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center'
    }
});
