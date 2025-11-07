import { api } from './client';
import { buildQuery } from './query';

// 1) /api/employees/?company=<id>
// 2) Хэрвээ дэмждэггүй бол fallback: /api/companies/<id>/employees/
export async function listEmployees({ company, limit = 200 } = {}) {
  const cid = Number(company); // тоо болгож илгээнэ
  let res = await api(`/api/employees/${buildQuery({ company: cid, limit })}`);

  if (res.status === 404 || res.status === 405) {
    res = await api(`/api/companies/${cid}/employees/`);
  }
  if (!res.ok) throw new Error('EMPLOYEES_FAILED');

  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data.results ?? []);

  // Backend filter хийхгүй байсан ч эндээс шүүж баталгаажуулна
  return arr.filter(
    (e) =>
      String(e.company) === String(cid) || // company: 7
      String(e.company_id) === String(cid) || // company_id: 7
      e.company?.id === cid // company: {id:7,...}
  );
}
