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
  if (Array.isArray(data)) return { results: data };
  return data || { results: [] };
}

export async function getCompany(id) {
  const { data } = await get(API_PATHS.COMPANIES.DETAIL(id));
  return data;
}

export async function createCompany(payload) {
  const { data } = await post(API_PATHS.COMPANIES.LIST, payload);
  return data;
}

export async function updateCompany(id, payload) {
  const { data } = await patch(API_PATHS.COMPANIES.DETAIL(id), payload);
  return data;
}

export async function deleteCompany(id) {
  const { data } = await del(API_PATHS.COMPANIES.DETAIL(id));
  return data;
}
