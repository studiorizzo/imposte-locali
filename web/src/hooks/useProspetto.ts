import { useState, useEffect, useCallback } from 'react';
import type { Comune, Prospetto, ComuneDelibere, RisultatoLookup, Delibera } from '@lib';
import { getPercorsoDelibere, getPercorsoProspetto, lookupProspetto } from '@lib';

interface UseProspettoResult {
  prospetto: Prospetto | null;
  delibera: Delibera | null;
  loading: boolean;
  error: string | null;
  usaAliquoteMinisteriali: boolean;
}

// Cache per evitare fetch ripetuti
const delibereCache = new Map<string, ComuneDelibere[]>();
const prospettoCache = new Map<string, Prospetto>();

/**
 * Hook per caricare il prospetto aliquote di un comune
 */
export function useProspetto(comune: Comune | null, anno: number = 2026): UseProspettoResult {
  const [prospetto, setProspetto] = useState<Prospetto | null>(null);
  const [delibera, setDelibera] = useState<Delibera | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usaAliquoteMinisteriali, setUsaAliquoteMinisteriali] = useState(true);

  const fetchDelibere = useCallback(async (regione: string, sigla: string): Promise<ComuneDelibere[]> => {
    const percorso = getPercorsoDelibere(regione, sigla);
    const cacheKey = percorso;

    // Check cache
    if (delibereCache.has(cacheKey)) {
      return delibereCache.get(cacheKey)!;
    }

    // Fetch from server
    const url = `/imposte-locali/prospetti/${percorso}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        // Province without delibere - use ministerial rates
        return [];
      }
      throw new Error(`Errore caricamento delibere: ${response.status}`);
    }

    const data = await response.json();
    delibereCache.set(cacheKey, data);
    return data;
  }, []);

  const fetchProspetto = useCallback(async (regione: string, nomeProspetto: string): Promise<Prospetto> => {
    const percorso = getPercorsoProspetto(regione, nomeProspetto);
    const cacheKey = percorso;

    // Check cache
    if (prospettoCache.has(cacheKey)) {
      return prospettoCache.get(cacheKey)!;
    }

    // Fetch from server
    const url = `/imposte-locali/prospetti/${percorso}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Errore caricamento prospetto: ${response.status}`);
    }

    const data = await response.json();
    prospettoCache.set(cacheKey, data);
    return data;
  }, []);

  useEffect(() => {
    // Reset state when comune changes
    setProspetto(null);
    setDelibera(null);
    setError(null);
    setUsaAliquoteMinisteriali(true);

    // Skip if no comune selected
    if (!comune?.codice_catastale || !comune.regione || !comune.sigla_provincia) {
      setLoading(false);
      return;
    }

    const loadProspetto = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Load delibere for province
        const delibereProvince = await fetchDelibere(comune.regione, comune.sigla_provincia);

        if (delibereProvince.length === 0) {
          // No delibere for this province
          setUsaAliquoteMinisteriali(true);
          setLoading(false);
          return;
        }

        // 2. Find applicable delibera using lookup
        const risultato: RisultatoLookup = lookupProspetto(comune, delibereProvince, anno);

        if (risultato.usaAliquoteMinisteriali || !risultato.delibera) {
          setUsaAliquoteMinisteriali(true);
          setLoading(false);
          return;
        }

        setDelibera(risultato.delibera);

        // 3. Load prospetto if found
        if (risultato.percorsoProspetto) {
          try {
            const prospettoData = await fetchProspetto(comune.regione, risultato.delibera.nome_prospetto);
            setProspetto(prospettoData);
            setUsaAliquoteMinisteriali(false);
          } catch {
            // Prospetto file not yet extracted - use ministerial rates
            setUsaAliquoteMinisteriali(true);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        setUsaAliquoteMinisteriali(true);
      } finally {
        setLoading(false);
      }
    };

    loadProspetto();
  }, [comune?.codice_catastale, comune?.regione, comune?.sigla_provincia, anno, fetchDelibere, fetchProspetto]);

  return {
    prospetto,
    delibera,
    loading,
    error,
    usaAliquoteMinisteriali,
  };
}
