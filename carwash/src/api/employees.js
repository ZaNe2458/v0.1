import { api } from './client';
import { buildQuery } from './query';

export async function listEmployees({ company, limit = 100 } = {}) {
  const qs = buildQuery({ company, limit });
  let res = await api(`/api/employees/${qs}`);

  if (res.status === 404 || res.status === 405) {
    res = await api(`/api/companies/${company}/employees/`);
  }

  if (!res.ok) throw new Error('EMPLOYEES_FAILED');

  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}
