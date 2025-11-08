import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function ExtraServicesModal({
  visible,
  onClose,
  services = [],
  checked = {},
  onToggle = () => {},
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Нэмэлт угаалга</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingVertical: 6 }}>
            {services.map((s) => {
              const id = String(s.id);
              const active = !!checked[id];
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => onToggle(id)}
                  style={[styles.row, active && styles.rowActive]}
                >
                  <Text style={styles.check}>{active ? '☑︎' : '☐'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>
                      {s.name || s.title || 'Үйлчилгээ'}
                    </Text>
                    {!!s.description && (
                      <Text style={styles.desc} numberOfLines={1}>
                        {s.description}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.price}>
                    {new Intl.NumberFormat('mn-MN').format(
                      Number(s.price ?? s.base_price ?? 0)
                    )}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>Хаах</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '80%',
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { fontWeight: '700', fontSize: 16 },
  close: { fontWeight: '700', fontSize: 18 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  rowActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  check: { width: 22, textAlign: 'center', fontSize: 16 },
  name: { fontWeight: '600', color: '#111827' },
  desc: { fontSize: 12, color: '#6B7280' },
  price: { fontWeight: '700', color: '#111827', marginLeft: 8 },
  doneBtn: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  doneText: { color: '#fff', fontWeight: '600' },
});
