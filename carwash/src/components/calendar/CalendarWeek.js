import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './calendar.styles';
import { WEEKDAYS, buildMonthCells } from '../../utils/dates';

export default function CalendarWeek({ date, onChange }) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const selected = date.getDate();
  const rows = buildMonthCells(y, m);

  return (
    <View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={styles.weekLabel}>
            {w}
          </Text>
        ))}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={styles.gridRow}>
          {row.map((val, j) =>
            val ? (
              <TouchableOpacity
                key={j}
                onPress={() => onChange(new Date(y, m, val))}
                style={[
                  styles.dayCell,
                  val === selected && styles.dayCellActive,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    val === selected && styles.dayTextActive,
                  ]}
                >
                  {val}
                </Text>
              </TouchableOpacity>
            ) : (
              <View key={j} style={styles.dayCellPad} />
            )
          )}
        </View>
      ))}
    </View>
  );
}
