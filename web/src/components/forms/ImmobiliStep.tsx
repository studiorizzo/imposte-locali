import { useState, useMemo, useEffect } from 'react';
import { Input, Select, Checkbox, Card, CardHeader, CardContent, CardFooter, Button, Autocomplete, Modal } from '../ui';
import { AliquotePanel } from './AliquotePanel';
import { ListaImmobili } from './ListaImmobili';
import type { DatiImmobile, FattispeciePrincipale, CategoriaCatastale, Comune, Prospetto, TipologiaContribuente } from '@lib';
import { COEFFICIENTI, ALIQUOTE_MINISTERO, CATEGORIE_PER_FATTISPECIE, FATTISPECIE_LABELS, COMUNI, DATA_INIZIO_DEFAULT, DATA_FINE_DEFAULT, verificaUnicita } from '@lib';
import { useProspetto } from '../../hooks';

interface ImmobiliStepProps {
  immobili: DatiImmobile[];
  onAddImmobile: (immobile: DatiImmobile) => void;
  onRemoveImmobile: (id: string) => void;
  tipologiaContribuente: TipologiaContribuente;
}

// Lista fattispecie per il select
const FATTISPECIE_OPTIONS: { value: FattispeciePrincipale; label: string }[] = [
  { value: 'abitazione_principale_lusso', label: FATTISPECIE_LABELS.abitazione_principale_lusso },
  { value: 'pertinenze', label: FATTISPECIE_LABELS.pertinenze },
  { value: 'fabbricati_rurali_strumentali', label: FATTISPECIE_LABELS.fabbricati_rurali_strumentali },
  { value: 'fabbricati_gruppo_d', label: FATTISPECIE_LABELS.fabbricati_gruppo_d },
  { value: 'terreni_agricoli', label: FATTISPECIE_LABELS.terreni_agricoli },
  { value: 'aree_fabbricabili', label: FATTISPECIE_LABELS.aree_fabbricabili },
  { value: 'altri_fabbricati', label: FATTISPECIE_LABELS.altri_fabbricati },
];

const CATEGORIE_OPTIONS = Object.keys(COEFFICIENTI).map((cat) => ({
  value: cat,
  label: cat,
}));

// Restituisce le categorie valide per una fattispecie
const getCategoriePerFattispecie = (fattispecie: FattispeciePrincipale) => {
  const categorie = CATEGORIE_PER_FATTISPECIE[fattispecie];
  if (categorie === null) {
    // altri_fabbricati accetta tutte le categorie
    return CATEGORIE_OPTIONS;
  }
  return CATEGORIE_OPTIONS.filter(opt => categorie.includes(opt.value as CategoriaCatastale));
};

// Restituisce l'aliquota ministeriale per una fattispecie
const getDefaultAliquota = (fattispecie: FattispeciePrincipale): number => {
  return ALIQUOTE_MINISTERO[fattispecie];
};

// Cerca l'aliquota nel prospetto comunale per una fattispecie
const getAliquotaDaProspetto = (prospetto: Prospetto | null, fattispecie: FattispeciePrincipale): number | null => {
  if (!prospetto || !fattispecie) return null;

  // Per le pertinenze, cerca abitazione_principale_lusso (stessa aliquota)
  const fattispcieDaCercare = fattispecie === 'pertinenze' ? 'abitazione_principale_lusso' : fattispecie;

  const aliquotaBase = prospetto.aliquote_base.find(a => a.fattispecie_principale === fattispcieDaCercare);
  if (!aliquotaBase || typeof aliquotaBase.aliquota !== 'string') return null;

  const match = aliquotaBase.aliquota.match(/(\d+)[,.](\d+)/);
  if (!match) return null;

  return parseFloat(`${match[1]}.${match[2]}`);
};

const createEmptyImmobile = (): DatiImmobile => ({
  id: crypto.randomUUID(),
  comune: {
    comune: '',
    regione: '',
    provincia: '',
    sigla_provincia: '',
    codice_catastale: '',
    codice_comune: '',
    abitanti: 0,
    label: '',
  },
  fattispecie_principale: '' as FattispeciePrincipale,
  categoria: '' as CategoriaCatastale,
  renditaCatastale: 0,
  percentualePossesso: 100,
  dataInizio: DATA_INIZIO_DEFAULT,
  dataFine: DATA_FINE_DEFAULT,
  aliquotaAcconto: 0,
  aliquotaSaldo: 0,
  riduzioni: {
    storicoArtistico: false,
    inagibileInabitabile: false,
    comodatoParenti: false,
    canoneCorordato: false,
  },
  esenzioni: {
    terrenoCdIap: false,
    beneMerce: false,
    occupatoAbusivamente: false,
    collabente: false,
  },
});

// Verifica se categoria è abitativa (gruppo A escluso A/10)
const isCategoriaAbitativa = (categoria: CategoriaCatastale): boolean => {
  return categoria?.startsWith('A/') && categoria !== 'A/10';
};

// Verifica se un immobile qualifica per riduzione residente estero
const isImmobileResidenteEstero = (imm: DatiImmobile): boolean => {
  return imm.fattispecie_principale === 'altri_fabbricati' &&
    isCategoriaAbitativa(imm.categoria) &&
    imm.comune.abitanti > 0 && imm.comune.abitanti < 5000 &&
    imm.immobileNonLocatoNonComodato === true &&
    imm.immobileUltimaResidenza === true;
};

// Verifica se un immobile qualifica per assimilazione forze armate (abitazione principale)
const isAbitazionePrincipaleForzeArmate = (imm: DatiImmobile): boolean => {
  return imm.fattispecie_principale === 'abitazione_principale_lusso' &&
    imm.immobileNonLocatoForzeArmate === true;
};

// Verifica se esiste già una pertinenza forze armate per una categoria specifica
const isPertinenzaForzeArmateCategoria = (imm: DatiImmobile, categoria: CategoriaCatastale): boolean => {
  return imm.fattispecie_principale === 'pertinenze' &&
    imm.categoria === categoria &&
    imm.immobileNonLocatoForzeArmate === true;
};

// Testo condizioni residente estero (art. 1, c. 48-48bis, L. 178/2020 mod. 2026)
const CONDIZIONI_RESIDENTE_ESTERO = `Per fruire della riduzione/esenzione IMU per residente all'estero (art. 1, c. 48-48bis, L. 178/2020), devono sussistere le seguenti condizioni:

• Persona fisica trasferita all'estero dopo almeno 5 anni di residenza in Italia
• Immobile a uso abitativo posseduto a titolo di proprietà
• Immobile non locato né concesso in comodato d'uso
• Immobile ubicato nel comune di ultima residenza (< 5.000 abitanti)
• Beneficio concesso per una sola unità immobiliare a uso abitativo

Se queste condizioni non sono soddisfatte, l'immobile sarà soggetto ad IMU ordinaria.`;

// Testo condizioni forze armate (art. 1, c. 741, lett. c, n. 5, L. 160/2019)
const CONDIZIONI_FORZE_ARMATE = `Per fruire dell'assimilazione ad abitazione principale (art. 1, c. 741, lett. c, n. 5, L. 160/2019), devono sussistere le seguenti condizioni:

• Immobile non concesso in locazione
• Assimilazione applicabile ad un solo immobile

Non sono richieste le condizioni della dimora abituale e della residenza anagrafica.

Se queste condizioni non sono soddisfatte, l'immobile sarà soggetto ad IMU ordinaria.`;

export function ImmobiliStep({ immobili, onAddImmobile, onRemoveImmobile, tipologiaContribuente }: ImmobiliStepProps) {
  const [immobile, setImmobile] = useState<DatiImmobile>(createEmptyImmobile());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aliquotaPersonalizzataSelezionata, setAliquotaPersonalizzataSelezionata] = useState<string | null>(null);
  const [erroreUnicita, setErroreUnicita] = useState<string | null>(null);
  const [showModalCondizioni, setShowModalCondizioni] = useState(false);
  const [showModalCondizioniForzeArmate, setShowModalCondizioniForzeArmate] = useState(false);
  const [campoInDeselezione, setCampoInDeselezione] = useState<'immobileNonLocatoNonComodato' | 'immobileUltimaResidenza' | 'immobileNonLocatoForzeArmate' | null>(null);

  // Filtra fattispecie in base alla tipologia contribuente
  // Residente estero non può avere abitazione principale né pertinenze
  const fattspecieOptions = useMemo(() => {
    if (tipologiaContribuente === 'persona_fisica_residente_estero') {
      return FATTISPECIE_OPTIONS.filter(
        opt => opt.value !== 'abitazione_principale_lusso' && opt.value !== 'pertinenze'
      );
    }
    return FATTISPECIE_OPTIONS;
  }, [tipologiaContribuente]);

  // Verifica se esiste già un immobile residente estero nella lista
  const esisteGiaImmobileResidenteEstero = useMemo(() => {
    return immobili.some(isImmobileResidenteEstero);
  }, [immobili]);

  // Verifica se mostrare sezione condizioni residente estero
  // NON mostrare se esiste già un immobile che fruisce della riduzione
  const showCondizioniResidenteEstero = useMemo(() => {
    return tipologiaContribuente === 'persona_fisica_residente_estero' &&
      immobile.comune.abitanti > 0 && immobile.comune.abitanti < 5000 &&
      immobile.fattispecie_principale === 'altri_fabbricati' &&
      isCategoriaAbitativa(immobile.categoria) &&
      !esisteGiaImmobileResidenteEstero;
  }, [tipologiaContribuente, immobile.comune.abitanti, immobile.fattispecie_principale, immobile.categoria, esisteGiaImmobileResidenteEstero]);

  // Imposta i flag di default quando le condizioni sono soddisfatte
  useEffect(() => {
    if (showCondizioniResidenteEstero && immobile.immobileNonLocatoNonComodato === undefined) {
      setImmobile(prev => ({
        ...prev,
        immobileNonLocatoNonComodato: true,
        immobileUltimaResidenza: true,
      }));
    }
  }, [showCondizioniResidenteEstero, immobile.immobileNonLocatoNonComodato]);

  // Verifica se esiste già abitazione principale forze armate
  const esisteGiaAbitazionePrincipaleForzeArmate = useMemo(() => {
    return immobili.some(isAbitazionePrincipaleForzeArmate);
  }, [immobili]);

  // Verifica se esiste già una pertinenza forze armate della stessa categoria
  const esisteGiaPertinenzaForzeArmateStessaCategoria = useMemo(() => {
    if (immobile.fattispecie_principale !== 'pertinenze' || !immobile.categoria) {
      return false;
    }
    return immobili.some(imm => isPertinenzaForzeArmateCategoria(imm, immobile.categoria));
  }, [immobili, immobile.fattispecie_principale, immobile.categoria]);

  // Verifica se mostrare sezione condizioni forze armate
  // NON mostrare se:
  // - abitazione principale: esiste già un'abitazione principale con assimilazione
  // - pertinenze: esiste già una pertinenza della stessa categoria con assimilazione
  const showCondizioniForzeArmate = useMemo(() => {
    if (tipologiaContribuente !== 'persona_fisica_forze_armate') {
      return false;
    }
    if (immobile.fattispecie_principale === 'abitazione_principale_lusso') {
      return !esisteGiaAbitazionePrincipaleForzeArmate;
    }
    if (immobile.fattispecie_principale === 'pertinenze') {
      return !esisteGiaPertinenzaForzeArmateStessaCategoria;
    }
    return false;
  }, [tipologiaContribuente, immobile.fattispecie_principale, esisteGiaAbitazionePrincipaleForzeArmate, esisteGiaPertinenzaForzeArmateStessaCategoria]);

  // Imposta i flag di default per forze armate
  useEffect(() => {
    if (showCondizioniForzeArmate && immobile.immobileNonLocatoForzeArmate === undefined) {
      setImmobile(prev => ({
        ...prev,
        immobileNonLocatoForzeArmate: true,
      }));
    }
  }, [showCondizioniForzeArmate, immobile.immobileNonLocatoForzeArmate]);

  // Hook per caricare prospetto
  const comuneSelezionato = immobile.comune.codice_catastale ? immobile.comune : null;
  const { prospetto, delibera, loading: loadingProspetto, usaAliquoteMinisteriali } = useProspetto(comuneSelezionato);

  // Comuni options
  const comuniOptions = useMemo(() =>
    COMUNI.map(c => ({
      value: c.codice_catastale,
      label: c.label,
      comune: c.comune,
      regione: c.regione,
      provincia: c.provincia,
      sigla_provincia: c.sigla_provincia,
      codice_catastale: c.codice_catastale,
      codice_comune: c.codice_comune,
      abitanti: c.abitanti,
    })),
    []
  );

  // Calcola aliquota base (da prospetto o ministeriale)
  const aliquotaBase = useMemo(() => {
    if (!immobile.fattispecie_principale) return 0;
    const aliquotaDaProspetto = getAliquotaDaProspetto(prospetto, immobile.fattispecie_principale);
    return aliquotaDaProspetto !== null ? aliquotaDaProspetto : getDefaultAliquota(immobile.fattispecie_principale);
  }, [prospetto, immobile.fattispecie_principale]);

  // Aggiorna aliquote quando prospetto cambia (dopo caricamento asincrono)
  useEffect(() => {
    if (!immobile.fattispecie_principale || !prospetto) return;

    // Prospetto appena caricato: aggiorna le aliquote
    const aliquotaDaProspetto = getAliquotaDaProspetto(prospetto, immobile.fattispecie_principale);
    if (aliquotaDaProspetto !== null) {
      setImmobile(prev => ({
        ...prev,
        aliquotaAcconto: aliquotaDaProspetto,
        aliquotaSaldo: aliquotaDaProspetto,
      }));
      setAliquotaPersonalizzataSelezionata(null);
    }
  }, [prospetto]);

  const handleComuneChange = (option: (typeof comuniOptions)[number] | null) => {
    const emptyImmobile = createEmptyImmobile();

    if (option) {
      const comune: Comune = {
        comune: option.comune,
        regione: option.regione,
        provincia: option.provincia,
        sigla_provincia: option.sigla_provincia,
        codice_catastale: option.codice_catastale,
        codice_comune: option.codice_comune,
        abitanti: option.abitanti,
        label: option.label,
      };
      setImmobile({ ...emptyImmobile, comune });
    } else {
      setImmobile(emptyImmobile);
    }
    setAliquotaPersonalizzataSelezionata(null);
  };

  const handleChange = <K extends keyof DatiImmobile>(
    field: K,
    value: DatiImmobile[K]
  ) => {
    setImmobile((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'fattispecie_principale') {
        const newFattispecie = value as FattispeciePrincipale;
        // Usa aliquota dal prospetto se disponibile, altrimenti ministeriale
        const aliquotaDaProspetto = getAliquotaDaProspetto(prospetto, newFattispecie);
        const aliquota = aliquotaDaProspetto !== null ? aliquotaDaProspetto : getDefaultAliquota(newFattispecie);
        updated.aliquotaAcconto = aliquota;
        updated.aliquotaSaldo = aliquota;

        if (prev.categoria) {
          const categorieValide = getCategoriePerFattispecie(newFattispecie);
          if (!categorieValide.some(opt => opt.value === prev.categoria)) {
            updated.categoria = '' as CategoriaCatastale;
          }
        }

        // Reset flag fabbricato quando cambia fattispecie
        updated.riduzioni = {
          ...prev.riduzioni,
          storicoArtistico: false,
          inagibileInabitabile: false,
        };

        // Reset aliquota personalizzata quando cambia fattispecie
        setAliquotaPersonalizzataSelezionata(null);
      }

      // Reset aliquota personalizzata se cambia categoria
      if (field === 'categoria') {
        setAliquotaPersonalizzataSelezionata(null);
      }

      return updated;
    });
  };

  const handleRiduzioneChange = (key: keyof DatiImmobile['riduzioni'], value: boolean) => {
    setImmobile((prev) => ({
      ...prev,
      riduzioni: { ...prev.riduzioni, [key]: value },
    }));
  };

  const handleEsenzioneChange = (key: keyof DatiImmobile['esenzioni'], value: boolean) => {
    setImmobile((prev) => ({
      ...prev,
      esenzioni: { ...prev.esenzioni, [key]: value },
    }));
  };

  // Handler per i flag condizioni residente estero
  const handleCondizioneResidenteEsteroChange = (field: 'immobileNonLocatoNonComodato' | 'immobileUltimaResidenza', value: boolean) => {
    if (!value) {
      // Se l'utente tenta di deselezionare, mostra il modal di avviso
      // NON aggiornare il valore finché l'utente non conferma
      setCampoInDeselezione(field);
      setShowModalCondizioni(true);
    } else {
      // Se l'utente seleziona, aggiorna subito
      setImmobile(prev => ({ ...prev, [field]: value }));
    }
  };

  // Conferma deselezione dal modal
  const handleConfermaDeselezione = () => {
    if (campoInDeselezione) {
      setImmobile(prev => ({ ...prev, [campoInDeselezione]: false }));
    }
    setCampoInDeselezione(null);
    setShowModalCondizioni(false);
    setShowModalCondizioniForzeArmate(false);
  };

  // Annulla deselezione dal modal
  const handleAnnullaDeselezione = () => {
    setCampoInDeselezione(null);
    setShowModalCondizioni(false);
    setShowModalCondizioniForzeArmate(false);
  };

  // Handler per i flag condizioni forze armate
  const handleCondizioneForzeArmateChange = (value: boolean) => {
    if (!value) {
      // Se l'utente tenta di deselezionare, mostra il modal di avviso
      setCampoInDeselezione('immobileNonLocatoForzeArmate');
      setShowModalCondizioniForzeArmate(true);
    } else {
      setImmobile(prev => ({ ...prev, immobileNonLocatoForzeArmate: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica campi obbligatori
    const richiedeRendita = immobile.fattispecie_principale &&
      immobile.fattispecie_principale !== 'terreni_agricoli' &&
      immobile.fattispecie_principale !== 'aree_fabbricabili';

    if (richiedeRendita && !immobile.renditaCatastale) {
      setErroreUnicita('Rendita catastale non rivalutata campo richiesto.');
      return;
    }

    // Verifica regole di unicità
    const { valido, errore } = verificaUnicita(
      immobile.fattispecie_principale,
      immobile.categoria,
      immobile.dataInizio,
      immobile.dataFine,
      immobili
    );

    if (!valido) {
      setErroreUnicita(errore || null);
      return; // Blocca l'inserimento
    }

    setErroreUnicita(null);
    onAddImmobile(immobile);

    // Reset form mantenendo il comune
    const nuovoImmobile = createEmptyImmobile();
    nuovoImmobile.comune = immobile.comune;
    setImmobile(nuovoImmobile);
    setAliquotaPersonalizzataSelezionata(null);
  };

  const isTerreno = immobile.fattispecie_principale === 'terreni_agricoli';
  const isArea = immobile.fattispecie_principale === 'aree_fabbricabili';
  const isAbitazionePrincipale = immobile.fattispecie_principale === 'abitazione_principale_lusso';
  const showCategoria = immobile.fattispecie_principale && !isTerreno && !isArea;
  // Flag fabbricato: non visibili per terreni e aree
  const showFlagFabbricato = immobile.fattispecie_principale && !isTerreno && !isArea;
  // Flag inagibile: non visibile per abitazione principale
  const showFlagInagibile = !isAbitazionePrincipale;

  return (
    <div className="space-y-6">
      {/* Layout a due colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonna sinistra: Form Immobile */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Aggiungi Immobile</h2>
              <p className="text-sm text-gray-500 mt-1">
                Inserisci i dati catastali dell'immobile
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Comune e fonte aliquote */}
                <div className="space-y-2">
                  <Autocomplete
                    label="Comune"
                    placeholder="Cerca per codice catastale o nome comune..."
                    options={comuniOptions}
                    value={immobile.comune.codice_catastale ? comuniOptions.find(c => c.codice_catastale === immobile.comune.codice_catastale) || null : null}
                    onChange={handleComuneChange}
                    maxResults={15}
                  />
                  {/* Indicatore fonte aliquote */}
                  {comuneSelezionato && (
                    <div className="text-sm">
                      {loadingProspetto ? (
                        <span className="text-gray-500">Caricamento...</span>
                      ) : usaAliquoteMinisteriali ? (
                        <span className="text-amber-600">Aliquote ministeriali</span>
                      ) : delibera ? (
                        <a
                          href={delibera.link_prospetto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 inline-flex items-center gap-1"
                        >
                          Aliquote comunali - Anno {delibera.anno_riferimento}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Fattispecie e Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Tipologia"
                    placeholder="Seleziona tipologia"
                    value={immobile.fattispecie_principale}
                    onChange={(e) => handleChange('fattispecie_principale', e.target.value as FattispeciePrincipale)}
                    options={fattspecieOptions}
                  />
                  {showCategoria && (
                    <Select
                      label="Categoria Catastale"
                      placeholder="Seleziona categoria"
                      value={immobile.categoria}
                      onChange={(e) => handleChange('categoria', e.target.value as CategoriaCatastale)}
                      options={getCategoriePerFattispecie(immobile.fattispecie_principale)}
                    />
                  )}
                </div>

                {/* Flag fabbricato - visibili solo per fabbricati */}
                {showFlagFabbricato && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Checkbox
                      label="Fabbricato storico/artistico"
                      description="Art. 13, c. 3, D.L. 201/2011"
                      checked={immobile.riduzioni.storicoArtistico}
                      onChange={(e) => handleRiduzioneChange('storicoArtistico', e.target.checked)}
                    />
                    {showFlagInagibile && (
                      <Checkbox
                        label="Fabbricato inagibile/inabitabile"
                        description="Dichiarato non utilizzabile"
                        checked={immobile.riduzioni.inagibileInabitabile}
                        onChange={(e) => handleRiduzioneChange('inagibileInabitabile', e.target.checked)}
                      />
                    )}
                  </div>
                )}

                {/* Condizioni forze armate - visibili solo quando applicabili */}
                {showCondizioniForzeArmate && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-blue-900">Assimilazione abitazione principale</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Per beneficiare dell'assimilazione ad abitazione principale, devono sussistere le seguenti condizioni:
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mt-3">
                      <Checkbox
                        label="Immobile non concesso in locazione"
                        description="L'immobile non è affittato a terzi"
                        checked={immobile.immobileNonLocatoForzeArmate ?? true}
                        onChange={(e) => handleCondizioneForzeArmateChange(e.target.checked)}
                      />
                    </div>
                  </div>
                )}

                {/* Condizioni residente estero - visibili solo quando applicabili */}
                {showCondizioniResidenteEstero && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-blue-900">Riduzione residente estero</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Comune con meno di 5.000 abitanti. Per beneficiare della riduzione IMU, devono sussistere le seguenti condizioni:
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mt-3">
                      <Checkbox
                        label="Immobile non locato né concesso in comodato d'uso"
                        description="L'immobile non è affittato a terzi né concesso in comodato"
                        checked={immobile.immobileNonLocatoNonComodato ?? true}
                        onChange={(e) => handleCondizioneResidenteEsteroChange('immobileNonLocatoNonComodato', e.target.checked)}
                      />
                      <Checkbox
                        label="Immobile ubicato nel comune di ultima residenza"
                        description="L'immobile si trova nel comune di ultima residenza in Italia"
                        checked={immobile.immobileUltimaResidenza ?? true}
                        onChange={(e) => handleCondizioneResidenteEsteroChange('immobileUltimaResidenza', e.target.checked)}
                      />
                    </div>
                  </div>
                )}

                {/* Valori catastali */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showCategoria && (
                    <Input
                      label="Rendita catastale non rivalutata"
                      type="number"
                      value={immobile.renditaCatastale || ''}
                      onChange={(e) => handleChange('renditaCatastale', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                    />
                  )}
                  {isTerreno && (
                    <Input
                      label="Reddito Dominicale (€)"
                      type="number"
                      value={immobile.redditoDominicale || ''}
                      onChange={(e) => handleChange('redditoDominicale', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                    />
                  )}
                  {isArea && (
                    <Input
                      label="Valore Venale (€)"
                      type="number"
                      value={immobile.valoreVenale || ''}
                      onChange={(e) => handleChange('valoreVenale', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={1}
                      hint="Valore di mercato al 1° gennaio"
                    />
                  )}
                  <Input
                    label="% Possesso"
                    type="number"
                    value={immobile.percentualePossesso}
                    onChange={(e) => handleChange('percentualePossesso', parseFloat(e.target.value) || 0)}
                    min={0}
                    max={100}
                    step={0.01}
                  />
                </div>

                {/* Periodo di possesso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Data Inizio Possesso"
                    type="date"
                    value={immobile.dataInizio}
                    onChange={(e) => handleChange('dataInizio', e.target.value)}
                  />
                  <Input
                    label="Data Fine Possesso"
                    type="date"
                    value={immobile.dataFine}
                    onChange={(e) => handleChange('dataFine', e.target.value)}
                  />
                </div>

                {/* Toggle avanzate */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-700"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Riduzioni ed Esenzioni
                </button>

                {showAdvanced && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    {/* Riduzioni */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Riduzioni (50% base imponibile)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <Checkbox
                          label="Comodato a parenti"
                          description="Uso gratuito a parenti 1° grado"
                          checked={immobile.riduzioni.comodatoParenti}
                          onChange={(e) => handleRiduzioneChange('comodatoParenti', e.target.checked)}
                        />
                      </div>
                    </div>

                    {/* Riduzione Canone */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Riduzioni Aliquota (25%)</h4>
                      <Checkbox
                        label="Canone concordato"
                        description="Locazione a canone concordato (L. 431/1998)"
                        checked={immobile.riduzioni.canoneCorordato}
                        onChange={(e) => handleRiduzioneChange('canoneCorordato', e.target.checked)}
                      />
                    </div>

                    {/* Esenzioni */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Esenzioni</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {isTerreno && (
                          <Checkbox
                            label="Terreno CD/IAP"
                            description="Coltivatore diretto o IAP"
                            checked={immobile.esenzioni.terrenoCdIap}
                            onChange={(e) => handleEsenzioneChange('terrenoCdIap', e.target.checked)}
                          />
                        )}
                        <Checkbox
                          label="Bene merce"
                          description="Impresa costruzione (dal 2022)"
                          checked={immobile.esenzioni.beneMerce}
                          onChange={(e) => handleEsenzioneChange('beneMerce', e.target.checked)}
                        />
                        <Checkbox
                          label="Occupato abusivamente"
                          description="Con denuncia (dal 2023)"
                          checked={immobile.esenzioni.occupatoAbusivamente}
                          onChange={(e) => handleEsenzioneChange('occupatoAbusivamente', e.target.checked)}
                        />
                        <Checkbox
                          label="Fabbricato collabente"
                          description="Categoria F/2"
                          checked={immobile.esenzioni.collabente}
                          onChange={(e) => handleEsenzioneChange('collabente', e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end">
                <Button type="submit">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Aggiungi Immobile
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Colonna destra: Aliquote */}
        <AliquotePanel
          prospetto={prospetto}
          categoria={immobile.categoria}
          fattispecie={immobile.fattispecie_principale}
          aliquotaAcconto={immobile.aliquotaAcconto}
          aliquotaSaldo={immobile.aliquotaSaldo}
          aliquotaBase={aliquotaBase}
          onAliquotaAccontoChange={(value) => setImmobile(prev => ({ ...prev, aliquotaAcconto: value }))}
          onAliquotaSaldoChange={(value) => setImmobile(prev => ({ ...prev, aliquotaSaldo: value }))}
          aliquotaPersonalizzataSelezionata={aliquotaPersonalizzataSelezionata}
          onSelectAliquotaPersonalizzata={setAliquotaPersonalizzataSelezionata}
        />
      </div>

      {/* Lista immobili */}
      <ListaImmobili
        immobili={immobili}
        onRemove={onRemoveImmobile}
      />

      {/* Modal errore unicità */}
      <Modal
        aperto={!!erroreUnicita}
        onChiudi={() => setErroreUnicita(null)}
        titolo="Errore"
      >
        <div className="space-y-4">
          <p>{erroreUnicita}</p>
          <div className="flex justify-end">
            <Button onClick={() => setErroreUnicita(null)}>Chiudi</Button>
          </div>
        </div>
      </Modal>

      {/* Modal condizioni residente estero */}
      <Modal
        aperto={showModalCondizioni}
        onChiudi={handleAnnullaDeselezione}
        titolo="Condizioni riduzione residente estero"
      >
        <div className="space-y-4">
          <p className="text-gray-700 whitespace-pre-line">{CONDIZIONI_RESIDENTE_ESTERO}</p>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleAnnullaDeselezione}>
              Annulla
            </Button>
            <Button variant="danger" onClick={handleConfermaDeselezione}>
              Deseleziona
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal condizioni forze armate */}
      <Modal
        aperto={showModalCondizioniForzeArmate}
        onChiudi={handleAnnullaDeselezione}
        titolo="Condizioni assimilazione abitazione principale per il personale in servizio permanente appartenente a Forze armate, Forze di polizia, Vigili del fuoco, carriera prefettizia"
      >
        <div className="space-y-4">
          <p className="text-gray-700 whitespace-pre-line">{CONDIZIONI_FORZE_ARMATE}</p>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleAnnullaDeselezione}>
              Annulla
            </Button>
            <Button variant="danger" onClick={handleConfermaDeselezione}>
              Deseleziona
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
