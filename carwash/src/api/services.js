// src/api/services.js
import { get } from './client';
import { API_PATHS } from '../config/constants';

/** @param {{ company?: number|string, search?: string }} params */
export async function listServices(params = {}) {
  const { data } = await get(API_PATHS.SERVICES.LIST, {
    company: params.company, // backend талд company filter байгаа
    search: params.search,
  });
  // массив эсвэл {results:[]} аль ч тохиолдолд normalize
  return Array.isArray(data) ? data : (data?.results ?? []);
}
