// src/api/companies.js
import { get, post, patch, del } from './client';
import { API_PATHS } from '../config/constants';

/** Компанийн жагсаалт (pagination + search дэмжинэ)
 * @param {{ page?:number, search?:string }} params
 * @returns {Promise<{results:any[], next?:string, previous?:string, count?:number}>}
 */
export async function listCompanies(params = {}) {
  const { data } = await get(API_PATHS.COMPANIES.LIST, {
    page: params.page,
    search: params.search,
  });
  // Backend заримдаа массив, заримдаа {results:[]} буцаадаг тул normalize хийе
  if (Array.isArray(data)) return { results: data };
  return data || { results: [] };
}

/** Нэг компанийн дэлгэрэнгүй */
export async function getCompany(id) {
  const { data } = await get(API_PATHS.COMPANIES.DETAIL(id));
  return data;
}

/** Компанийн бүртгэл (шаардвал) */
export async function createCompany(payload) {
  // payload: {name, description, contact_email, contact_phone, location, ...}
  const { data } = await post(API_PATHS.COMPANIES.LIST, payload);
  return data;
}

/** Компанийн засвар (partial) */
export async function updateCompany(id, payload) {
  const { data } = await patch(API_PATHS.COMPANIES.DETAIL(id), payload);
  return data;
}

/** Компанийн устгал */
export async function deleteCompany(id) {
  const { data } = await del(API_PATHS.COMPANIES.DETAIL(id));
  return data;
}
