import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

export default function WorkerPicker({
  workers = [],
  selectedWorker,
  onSelect,
  loading = false,
}) {
  if (loading) {
    return (
      <Text style={{ color: '#64748B', marginBottom: 10 }}>
        Ажилчид ачаалж байна…
      </Text>
    );
  }
  if (!workers.length) {
    return (
      <Text style={{ color: '#64748B', marginBottom: 10 }}>
        Ажилчин бүртгэлгүй байна.
      </Text>
    );
  }

  const selId =
    typeof selectedWorker === 'object' ? selectedWorker?.id : selectedWorker;

  const renderItem = ({ item }) => {
    const active = String(item.id) === String(selId);
    return (
      <TouchableOpacity
        onPress={() => onSelect(item)}
        style={[styles.card, active && styles.cardActive]}
      >
        <Image
          source={
            item.avatarUrl
              ? { uri: item.avatarUrl }
              : require('../../assets/images/default-avatar.avif')
          }
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.name, active && styles.nameActive]}
            numberOfLines={1}
          >
            {item.fullName || item.name || 'Ажилтан'}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {item.role || 'Угаагч'}{' '}
            {Number.isFinite(item.rating) ? `• ⭐ ${item.rating}` : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={workers}
      keyExtractor={(it) => String(it.id)}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 6 }}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    minWidth: 220,
  },
  cardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
  },
  name: { fontWeight: '700', color: '#111827' },
  nameActive: { color: '#1D4ED8' },
  meta: { fontSize: 12, color: '#6B7280' },
});
