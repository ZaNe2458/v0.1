import { useMemo } from 'react';

/**
 * Цагийн слот үүсгэх (жишээ: 09:00, 09:30, ... 20:00)
 * start, end-г хүссэн үед тохируулж болно.
 */
export function useTimeSlots(start = 9, end = 20, stepMin = 30) {
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = start; h <= end; h++) {
      for (let m = 0; m < 60; m += stepMin) {
        if (h === end && m > 0) continue;
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }
    return slots;
  }, [start, end, stepMin]);

  return { timeSlots };
}
