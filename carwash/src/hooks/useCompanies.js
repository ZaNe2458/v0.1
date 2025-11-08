import { useState, useCallback } from 'react';
import { listCompanies } from '../api/companies';

/**
 * Газруудын мэдээллийг татах, газрын зургийн маркерийг тохируулах hook.
 * MapView ref дамжуулбал fitToCoordinates хийнэ.
 */
export function useCompanies(mapRef) {
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const { results } = await listCompanies();
      const normalized = (results ?? [])
        .map((c) => ({
          id: String(c.id),
          name: c.name,
          address: c.location ?? c.address ?? '',
          email: c.contact_email ?? '',
          phone: c.contact_phone ?? '',
          latitude: Number(c.latitude) || null,
          longitude: Number(c.longitude) || null,
          logoUrl: c.logo_url ?? c.logo ?? null,
          hours: c.hours ?? c.open_hours ?? '',
        }))
        .filter((x) => x.latitude && x.longitude);
      setCompanies(normalized);

      // газрын зураг дээр бүх координатыг багтаах
      if (normalized.length && mapRef?.current) {
        const coords = normalized.map((m) => ({
          latitude: m.latitude,
          longitude: m.longitude,
        }));
        requestAnimationFrame(() =>
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 80, bottom: 80, left: 40, right: 40 },
            animated: true,
          })
        );
      }
    } catch {
      setError('Угаалгын газруудыг татахад алдаа гарлаа.');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [mapRef]);

  // автоматаар татах
  useState(() => {
    refetch();
  }, []);

  return { companies, loadingCompanies, error, refetch };
}
