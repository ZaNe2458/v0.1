/** Валют, үнэ форматлах */
export const fmtPrice = (n) =>
  `₮ ${new Intl.NumberFormat('mn-MN').format(Number(n || 0))}`;
