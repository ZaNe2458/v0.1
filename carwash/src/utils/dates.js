export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/**
 * 7 баганатай календарийн сүлжээ үүсгэх.
 * @returns Array<Array<number|null>>
 */
export function buildMonthCells(year, month) {
  const firstDayJs = new Date(year, month, 1).getDay(); // 0..6 (Sun..Sat)
  const leadingPad = (firstDayJs + 6) % 7; // Monday-first alignment
  const dim = new Date(year, month + 1, 0).getDate();
  const trailingPad = (7 - ((leadingPad + dim) % 7)) % 7;

  const cells = [
    ...Array.from({ length: leadingPad }, () => null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
    ...Array.from({ length: trailingPad }, () => null),
  ];

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}
