// carwash/src/hooks/useCompanyData.js
import { useState, useCallback, useRef } from 'react';
import { listServices } from '../api/services';
import { listEmployees } from '../api/employees';

export function useCompanyData() {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState({ services: false, employees: false });
  const cacheRef = useRef({ services: new Map(), employees: new Map() });

  const loadCompanyData = useCallback(async (companyId) => {
    if (!companyId) return;

    const id = String(companyId);
    setLoading({ services: true, employees: true });

    try {
      // === Services ===
      const cachedS = cacheRef.current.services.get(id);
      if (cachedS) {
        setServices(cachedS);
      } else {
        const data = await listServices({ company: id });
        const list = Array.isArray(data) ? data : (data?.results ?? []);

        const normalized = list.map((s) => ({
          id: String(s.id),
          companyId: String(s.company_id ?? s.company?.id ?? id),
          name: s.name || s.title || 'Үйлчилгээ',
          description: s.description ?? '',
          price: Number(s.price ?? s.base_price ?? 0),
          duration: s.duration ?? s.minutes ?? '',
          isActive: s.is_active !== false,
        }));

        cacheRef.current.services.set(id, normalized);
        setServices(normalized);
      }

      // === Employees ===
      const cachedE = cacheRef.current.employees.get(id);
      if (cachedE) {
        setEmployees(cachedE);
      } else {
        const data = await listEmployees({ company: id });
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        const normalized = list.map((e) => ({
          id: String(e.id),
          companyId: String(e.company_id ?? e.company?.id ?? id),
          fullName:
            e.full_name ||
            [e.first_name, e.last_name].filter(Boolean).join(' ') ||
            e.name ||
            e.username ||
            'Ажилтан',
          role: e.role || e.position || 'Угаагч',
          rating: Number(e.rating ?? e.score ?? 0),
          phone: e.phone || e.contact_phone || '',
          avatarUrl: e.avatar_url || e.avatar || null,
        }));
        cacheRef.current.employees.set(id, normalized);
        setEmployees(normalized);
      }
    } catch (e) {
      console.error('useCompanyData error:', e);
    } finally {
      setLoading({ services: false, employees: false });
    }
  }, []);

  return { services, employees, loading, loadCompanyData };
}
