import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

const promotionsData = [
  {
    id: '1',
    name: 'Shine car wash /5+1/',
    type: 'loyalty',
    progress: 3,
    total: 5,
    logo: require('../../src/assets/logos/shine.jpg'),
  },
  {
    id: '2',
    name: 'Shine car wash',
    type: 'discount',
    details: [
      { service: 'Мотор угаах', discount: '50%', duration: '2 хоног' },
      { service: 'Дрилл өнгөлгөө', discount: '50%', duration: '2 хоног' },
    ],
    logo: require('../../src/assets/logos/shine.jpg'),
  },
  {
    id: '3',
    name: 'CleanX car wash /3+1/',
    type: 'loyalty',
    progress: 1,
    total: 3,
    logo: require('../../src/assets/logos/shine.jpg'),
  },
  {
    id: '4',
    name: 'Sparkle car wash',
    type: 'discount',
    details: [
      { service: 'Дотоод угаалга', discount: '30%', duration: '3 хоног' },
      { service: 'Гадна өнгөлгөө', discount: '20%', duration: '1 хоног' },
    ],
    logo: require('../../src/assets/logos/shine.jpg'),
  },
];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PromotionsScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const remaining =
      item.type === 'loyalty' ? item.total - item.progress : null;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => item.type === 'discount' && toggleExpand(item.id)}
      >
        <View style={styles.headerRow}>
          <Image source={item.logo} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>

            {item.type === 'loyalty' && (
              <Text
                style={[
                  styles.subText,
                  remaining === 1 && { color: '#2e7d32', fontWeight: '600' },
                ]}
              >
                Урамшуулалд {remaining} үлдлээ
              </Text>
            )}

            {item.type === 'discount' && (
              <Text
                style={[styles.subText, { color: '#999', fontWeight: '600' }]}
              >
                Хямдралтай үйлчилгээ
              </Text>
            )}
          </View>

          {item.type === 'discount' && (
            <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
          )}
        </View>

        {item.type === 'loyalty' && (
          <View style={styles.progressRow}>
            {Array.from({ length: item.total }).map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.circle,
                  {
                    backgroundColor:
                      idx < item.progress ? '#4caf50' : '#e0e0e0',
                  },
                ]}
              />
            ))}
          </View>
        )}

        {item.type === 'discount' && isExpanded && (
          <View style={styles.details}>
            {item.details.map((d, idx) => (
              <View key={idx} style={styles.detailRow}>
                <Text style={styles.service}>{d.service}</Text>
                <Text style={styles.discount}>{d.discount}</Text>
                <Text style={styles.duration}>{d.duration}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={promotionsData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingTop: 100, paddingHorizontal: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logo: { width: 40, height: 40, marginRight: 12, borderRadius: 20 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  arrow: { fontSize: 16, fontWeight: '600', marginLeft: 8, color: '#666' },
  subText: { fontSize: 12, color: '#555', marginTop: 2 },
  progressRow: { flexDirection: 'row', marginTop: 4 },
  circle: { width: 16, height: 16, borderRadius: 8, marginRight: 4 },
  details: { marginTop: 8 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  service: { flex: 1, color: '#333' },
  discount: { width: 50, textAlign: 'center', color: '#999' },
  duration: { width: 70, textAlign: 'right', color: '#999', fontSize: 12 },
});
