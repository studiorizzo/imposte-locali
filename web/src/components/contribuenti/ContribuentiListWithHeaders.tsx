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

  // Header text style
  const headerStyle: React.CSSProperties = {
    ...TextStyles.t1,
    color: Colors.accent1Dark,
    padding: `${Insets.m}px ${Insets.m}px ${Insets.sm}px`,
  };

  // Build list items with headers
  const renderItems = () => {
    const items: React.ReactNode[] = [];

    // Column header row (Name, Status, Phone, Email)
    items.push(
      <ContribuentiListRow
        key="header"
        contribuente={null}
        parentWidth={containerWidth}
      />
    );

    if (searchMode) {
      // Search mode: single header "RISULTATI RICERCA (n)"
      items.push(
        <div key="search-header" style={headerStyle}>
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
          <div key="fav-header" style={headerStyle}>
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

      // Others section (only if there are non-favorites AND some favorites exist)
      if (notStarred.length > 0) {
        // Only show "ALTRI CONTRIBUENTI" header if we also have favorites
        if (favCount > 0) {
          items.push(
            <div key="other-header" style={headerStyle}>
              ALTRI CONTRIBUENTI ({notStarred.length})
            </div>
          );
        } else {
          // No favorites: show "TUTTI I CONTRIBUENTI"
          items.push(
            <div key="all-header" style={headerStyle}>
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
        overflow: 'auto',
        backgroundColor: Colors.surface,
      }}
    >
      {renderItems()}
    </div>
  );
}
