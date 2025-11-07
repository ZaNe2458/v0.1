// src/api/bookings.js
import { api } from './client';

export async function createBooking(body) {
  const res = await api('/api/bookings/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.errors?.detail ||
      Object.values(data?.errors || {})?.[0] ||
      'Захиалга үүсгэхэд алдаа гарлаа.';
    throw new Error(String(msg));
  }
  return data;
}
