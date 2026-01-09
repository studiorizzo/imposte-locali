import { useState, useMemo } from 'react';
import { Colors } from '../../theme';
import { Insets, TextStyles } from '../../styles';
import { ContribuentiListWithHeaders } from './ContribuentiListWithHeaders';
import { BulkContribuenteEditBar } from './BulkContribuenteEditBar';
import type { ContribuenteListData } from './ContribuentiListRow';

interface ContribuentiPageProps {
  searchQuery?: string;
  onContribuenteSelect?: (contribuente: ContribuenteListData) => void;
}

// Empty state placeholder
function EmptyState({ isSearching }: { isSearching: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Insets.xl,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: Insets.l }}>
        {isSearching ? '🔍' : '👥'}
      </div>
      <h2 style={{ ...TextStyles.t1, fontSize: '18px', color: Colors.txt, marginBottom: Insets.m }}>
        {isSearching ? 'NESSUN RISULTATO' : 'NESSUN CONTRIBUENTE'}
      </h2>
      <p style={{ ...TextStyles.body1, color: Colors.grey, maxWidth: 400 }}>
        {isSearching
          ? 'Non abbiamo trovato contribuenti corrispondenti alla tua ricerca.'
          : 'Non ci sono ancora contribuenti. Crea il primo contribuente per iniziare.'}
      </p>
    </div>
  );
}

export function ContribuentiPage({
  searchQuery = '',
  onContribuenteSelect,
}: ContribuentiPageProps) {
  // Mock data for now - this would come from a real data source
  const [contribuenti, setContribuenti] = useState<ContribuenteListData[]>([
    {
      id: '1',
      cognomeDenominazione: 'Rossi',
      nome: 'Mario',
      status: 'Attivo',
      telefono: '333 1234567',
      email: 'mario.rossi@email.com',
      isStarred: true,
    },
    {
      id: '2',
      cognomeDenominazione: 'Bianchi',
      nome: 'Anna',
      status: 'Attivo',
      telefono: '339 9876543',
      email: 'anna.bianchi@email.com',
      isStarred: true,
    },
    {
      id: '3',
      cognomeDenominazione: 'Verdi',
      nome: 'Luigi',
      status: 'In attesa',
      telefono: '347 5551234',
      email: 'luigi.verdi@email.com',
      isStarred: false,
    },
    {
      id: '4',
      cognomeDenominazione: 'Studio Legale Associato',
      nome: '',
      status: 'Attivo',
      telefono: '02 12345678',
      email: 'info@studiolegale.it',
      isStarred: false,
    },
    {
      id: '5',
      cognomeDenominazione: 'Neri',
      nome: 'Francesca',
      status: 'Sospeso',
      telefono: '340 1112233',
      email: 'francesca.neri@email.com',
      isStarred: false,
    },
    {
      id: '6',
      cognomeDenominazione: 'Immobiliare Roma SRL',
      nome: '',
      status: 'Attivo',
      telefono: '06 98765432',
      email: 'info@immobiliareroma.it',
      isStarred: true,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // Filter by search query
  const filteredContribuenti = useMemo(() => {
    if (!searchQuery.trim()) {
      return contribuenti;
    }

    const query = searchQuery.toLowerCase();
    return contribuenti.filter((c) => {
      const fullName = c.nome
        ? `${c.cognomeDenominazione} ${c.nome}`
        : c.cognomeDenominazione;
      return (
        fullName.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.telefono?.includes(query)
      );
    });
  }, [contribuenti, searchQuery]);

  const searchMode = searchQuery.trim().length > 0;
  const isEmpty = filteredContribuenti.length === 0;

  // Handlers
  const handleSelect = (contribuente: ContribuenteListData) => {
    setSelectedId(selectedId === contribuente.id ? null : contribuente.id);
    onContribuenteSelect?.(contribuente);
  };

  const handleCheckedChange = (id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleStarToggle = (id: string) => {
    setContribuenti((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isStarred: !c.isStarred } : c
      )
    );
  };

  const handleSelectAll = () => {
    setCheckedIds(new Set(filteredContribuenti.map((c) => c.id)));
  };

  const handleSelectNone = () => {
    setCheckedIds(new Set());
  };

  const handleDelete = () => {
    if (checkedIds.size === 0) return;

    // Confirm deletion
    const count = checkedIds.size;
    if (window.confirm(`Eliminare ${count} contribuent${count === 1 ? 'e' : 'i'}?`)) {
      setContribuenti((prev) => prev.filter((c) => !checkedIds.has(c.id)));
      setCheckedIds(new Set());
      if (selectedId && checkedIds.has(selectedId)) {
        setSelectedId(null);
      }
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: Colors.bg1,  // Light green background like Flokk
        position: 'relative',
        // Flokk ContactsPage: .padding(left: Insets.lGutter, right: Insets.mGutter)
        paddingLeft: Insets.lGutter,
        paddingRight: Insets.mGutter,
        // Flokk ContactsPage: VSpace(Insets.sm) at top
        paddingTop: Insets.sm,
      }}
    >
      {/* Bulk edit bar (floating at top) */}
      <BulkContribuenteEditBar
        checkedCount={checkedIds.size}
        totalCount={filteredContribuenti.length}
        onSelectAll={handleSelectAll}
        onSelectNone={handleSelectNone}
        onDelete={handleDelete}
      />

      {/* Content */}
      {isEmpty ? (
        <EmptyState isSearching={searchMode} />
      ) : (
        <ContribuentiListWithHeaders
          contribuenti={filteredContribuenti}
          searchMode={searchMode}
          selectedId={selectedId}
          checkedIds={checkedIds}
          onSelect={handleSelect}
          onCheckedChange={handleCheckedChange}
          onStarToggle={handleStarToggle}
        />
      )}
    </div>
  );
}
