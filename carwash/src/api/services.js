import { api } from './client';
import { buildQuery } from './query';

export async function listServices({ company, limit = 100 } = {}) {
  const qs = buildQuery({ limit });
  let res = await api(`/api/services/${qs}`);

  if (res.status === 404 || res.status === 405) {
    res = await api(`/api/companies/${company}/services/`);
  }

  if (!res.ok) throw new Error('SERVICES_FAILED');

  const data = await res.json();
  const list = Array.isArray(data) ? data : (data.results ?? []);

  if (company) {
    const filtered = list.filter(
      (s) =>
        String(s.company_id ?? s.company?.id ?? s.company) === String(company)
    );
    return filtered;
  }

  return list;
}
