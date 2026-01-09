import { useRef, useEffect, useState } from 'react';
import { Colors } from '../../theme';
import { TextStyles, Insets } from '../../styles';
import { ContribuentiListRow } from './ContribuentiListRow';
import type { ContribuenteListData } from './ContribuentiListRow';

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

  // Section header style (from Flokk: TextStyles.T1, accent1Dark, bottomLeft, marginBottom: Insets.l + 4)
  const sectionHeaderStyle: React.CSSProperties = {
    ...TextStyles.t1,
    color: Colors.accent1Dark,
    display: 'flex',
    alignItems: 'flex-end',  // bottomLeft alignment
    height: 48,              // Give header height for bottomLeft to work
    marginBottom: Insets.l + 4,  // 28px from Flokk
    paddingLeft: Insets.m,
  };

  // Build list items (section headers + rows, but NOT column header)
  const renderListItems = () => {
    const items: React.ReactNode[] = [];

    if (searchMode) {
      // Search mode: single header "RISULTATI RICERCA (n)"
      items.push(
        <div key="search-header" style={sectionHeaderStyle}>
          RISULTATI RICERCA ({all.length})
        </div>
      );

      // All results
      all.forEach((contribuente) => {
        items.push(
          <ContribuentiListRow
            key={contribuente.id}
            contribuente={contribuente}
            parentWidth={containerWidth}
            isSelected={selectedId === contribuente.id}
            isChecked={checkedIds.has(contribuente.id)}
            onSelect={() => onSelect(contribuente)}
            onCheckedChange={(checked) => onCheckedChange(contribuente.id, checked)}
            onStarToggle={() => onStarToggle(contribuente.id)}
          />
        );
      });
    } else {
      // Normal mode: separate headers for favorites and others

      // Favorites section (only if there are favorites)
      if (favCount > 0) {
        items.push(
          <div key="fav-header" style={sectionHeaderStyle}>
            PREFERITI ({favCount})
          </div>
        );

        starred.forEach((contribuente) => {
          items.push(
            <ContribuentiListRow
              key={contribuente.id}
              contribuente={contribuente}
              parentWidth={containerWidth}
              isSelected={selectedId === contribuente.id}
              isChecked={checkedIds.has(contribuente.id)}
              onSelect={() => onSelect(contribuente)}
              onCheckedChange={(checked) => onCheckedChange(contribuente.id, checked)}
              onStarToggle={() => onStarToggle(contribuente.id)}
            />
          );
        });
      }

      // Others section (only if there are non-favorites)
      if (notStarred.length > 0) {
        // Only show "ALTRI CONTRIBUENTI" header if we also have favorites
        if (favCount > 0) {
          items.push(
            <div key="other-header" style={sectionHeaderStyle}>
              ALTRI CONTRIBUENTI ({notStarred.length})
            </div>
          );
        } else {
          // No favorites: show "TUTTI I CONTRIBUENTI"
          items.push(
            <div key="all-header" style={sectionHeaderStyle}>
              TUTTI I CONTRIBUENTI ({notStarred.length})
            </div>
          );
        }

        notStarred.forEach((contribuente) => {
          items.push(
            <ContribuentiListRow
              key={contribuente.id}
              contribuente={contribuente}
              parentWidth={containerWidth}
              isSelected={selectedId === contribuente.id}
              isChecked={checkedIds.has(contribuente.id)}
              onSelect={() => onSelect(contribuente)}
              onCheckedChange={(checked) => onCheckedChange(contribuente.id, checked)}
              onStarToggle={() => onStarToggle(contribuente.id)}
            />
          );
        });
      }
    }

    return items;
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

      {/* Scrollable list with section headers */}
      <div
        style={{
          flex: 1,
          minHeight: 0,  // Critical for flex scroll
          overflow: 'auto',
        }}
      >
        {renderListItems()}
      </div>
    </div>
  );
}
