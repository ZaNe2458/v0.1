import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export default function CalendarHeader({
  date,
  onPrev,
  onNext,
  onToggleMonth,
}) {
  return (
    <View style={styles.calHeader}>
      <TouchableOpacity onPress={onToggleMonth}>
        <Text style={styles.calHeaderTitle}>
          {date.getFullYear()}.{String(date.getMonth() + 1).padStart(2, '0')}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <Text onPress={onPrev} style={styles.navArrow}>
          {'‹'}
        </Text>
        <Text onPress={onNext} style={styles.navArrow}>
          {'›'}
        </Text>
      </View>
    </View>
  );
}
