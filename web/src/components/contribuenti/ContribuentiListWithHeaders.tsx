import { useRef, useEffect, useState } from 'react';
import { Colors } from '../../theme';
import { TextStyles, Insets } from '../../styles';
import { ContribuentiListRow } from './ContribuentiListRow';
import type { ContribuenteListData } from './ContribuentiListRow';
import { StyledListView } from '../scrolling';

interface ContribuentiListWithHeadersProps {
  contribuenti: ContribuenteListData[];
  searchMode?: boolean;
  selectedId?: string | null;
  checkedIds: Set<string>;
  onSelect: (contribuente: ContribuenteListData) => void;
  onCheckedChange: (id: string, checked: boolean) => void;
  onStarToggle: (id: string) => void;
}

export function ContribuentiListWithHeaders({
  contribuenti,
  searchMode = false,
  selectedId,
  checkedIds,
  onSelect,
  onCheckedChange,
  onStarToggle,
}: ContribuentiListWithHeadersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track container width for responsive columns
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Sort: starred first, then alphabetically
  const getSortedContribuenti = () => {
    const starred = contribuenti.filter(c => c.isStarred);
    const notStarred = contribuenti.filter(c => !c.isStarred);

    // Sort each group alphabetically by name
    const sortByName = (a: ContribuenteListData, b: ContribuenteListData) => {
      const nameA = a.nome
        ? `${a.cognomeDenominazione} ${a.nome}`
        : a.cognomeDenominazione;
      const nameB = b.nome
        ? `${b.cognomeDenominazione} ${b.nome}`
        : b.cognomeDenominazione;
      return nameA.localeCompare(nameB, 'it');
    };

    starred.sort(sortByName);
    notStarred.sort(sortByName);

    return { starred, notStarred, all: [...starred, ...notStarred] };
  };

  const { starred, notStarred, all } = getSortedContribuenti();
  const favCount = starred.length;

  // Section header style (from Flokk: TextStyles.T1, accent1Dark, bottomLeft, margin bottom inside 78px box)
  // In Flokk, itemExtent=78 constrains all items. marginBottom is inside the box, text aligned bottom-left.
  const sectionHeaderStyle: React.CSSProperties = {
    ...TextStyles.t1,
    color: Colors.accent1Dark,
    display: 'flex',
    alignItems: 'flex-end',  // bottomLeft alignment
    height: 78,              // Match itemExtent for proper scroll calculation
    paddingBottom: Insets.l + 4,  // 28px padding at bottom (was margin in Flokk)
    paddingLeft: Insets.m,
    boxSizing: 'border-box',
  };

  // Calculate item count - from Flokk contacts_list_with_headers.dart
  // itemCount = contacts.length + 1 (one header)
  // If not searchMode and has both favorites and non-favorites: add another header
  let itemCount = all.length + 1;
  if (!searchMode && favCount !== 0 && favCount !== all.length) {
    itemCount += 1;
  }

  // itemBuilder - from Flokk contacts_list_with_headers.dart
  const itemBuilder = (i: number): React.ReactNode => {
    // Inject 1 or 2 header rows into the results
    const isFirstHeader = i === 0;
    const isSecondHeader = i === favCount + 1 && favCount !== 0;

    if (isFirstHeader || (isSecondHeader && !searchMode)) {
      let headerText = 'RISULTATI RICERCA';
      let count = all.length;

      if (!searchMode) {
        const isFavorite = i === 0 && favCount > 0;
        headerText = isFavorite ? 'PREFERITI' : 'ALTRI CONTRIBUENTI';
        count = isFavorite ? favCount : all.length - favCount;
      }

      // Header text - from Flokk
      return (
        <div style={sectionHeaderStyle}>
          {headerText} ({count})
        </div>
      );
    }

    // Regular Row - from Flokk
    let offset = 1;
    if (!searchMode && i > favCount && favCount !== 0) {
      offset++;
    }
    const contribuente = all[i - offset];

    return (
      <ContribuentiListRow
        contribuente={contribuente}
        parentWidth={containerWidth}
        isSelected={selectedId === contribuente.id}
        isChecked={checkedIds.has(contribuente.id)}
        onSelect={() => onSelect(contribuente)}
        onCheckedChange={(checked) => onCheckedChange(contribuente.id, checked)}
        onStarToggle={() => onStarToggle(contribuente.id)}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,  // Critical for flex scroll - allows shrinking below content height
        backgroundColor: Colors.bg1,  // Light green background like Flokk
      }}
    >
      {/* Column header row - OUTSIDE scrollable list (from Flokk) */}
      {/* Transparent bg on bg1 = grey text on light green */}
      <div style={{ paddingRight: Insets.lGutter - Insets.sm }}>
        <ContribuentiListRow
          contribuente={null}
          parentWidth={containerWidth}
        />
      </div>

      {/* Scrollable list with section headers - from Flokk: StyledListView.expanded() */}
      <StyledListView
        itemExtent={78}
        itemCount={itemCount}
        itemBuilder={itemBuilder}
      />
    </div>
  );
}
