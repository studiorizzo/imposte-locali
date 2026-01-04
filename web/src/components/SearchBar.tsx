import { useState, useRef, useEffect, useCallback } from 'react';
import { Colors, Sizes, Insets, Animations, Shadows, Durations, Fonts } from '../theme';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onContribuenteSelect?: (contribuente: ContribuenteResult) => void;
  onSearchSubmit?: () => void;
  placeholder?: string;
  narrowMode?: boolean;
}

// Placeholder for search results - will integrate with actual data later
interface ContribuenteResult {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
}

/**
 * SearchBar component following Flokk's design patterns:
 * - closedHeight: topBarHeight - 5 = 55px
 * - borderRadius: 6px (Corners.s6)
 * - Opacity: 40% when inactive, 100% when active or has query
 * - Shadow: only when active or has query
 * - Expands on focus, closes on submit or Escape
 * - Ctrl+K keyboard shortcut to focus
 */
export function SearchBar({
  onSearch,
  onContribuenteSelect: _onContribuenteSelect,
  onSearchSubmit,
  placeholder = 'Cerca contribuenti...',
  narrowMode = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [resultsHeight, setResultsHeight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Height from Flokk: closedHeight = topBarHeight - 5 = 55px
  const closedHeight = Sizes.topBarHeight - 5;

  // Calculate open height (closedHeight + resultsHeight, max 600px)
  const openHeight = Math.min(closedHeight + resultsHeight, 600);

  // Is active = focused or has query
  const isActive = isOpen || query.length > 0;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);

    // TODO: Simulate search results - replace with actual search
    if (value.length > 0) {
      setResultsHeight(0); // For now, no results dropdown
    } else {
      setResultsHeight(0);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    setResultsHeight(0);
    inputRef.current?.focus();
  };

  // Cancel/close search
  const handleCancel = useCallback(() => {
    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  // Submit search
  const handleSubmit = useCallback(() => {
    onSearchSubmit?.();
    setIsOpen(false);
  }, [onSearchSubmit]);

  // Handle focus
  const handleFocus = () => {
    // Expand when we get focus (from Flokk: "Expand when we get focus")
    if (!query) {
      setIsOpen(true);
    }
  };

  // Handle blur
  const handleBlur = () => {
    // Close if no query
    if (!query) {
      setIsOpen(false);
    }
  };

  // Handle keyboard events on input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Global keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, query]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        width: '100%',
        // Flokk: SearchBar spans full content width, no maxWidth limit
      }}
    >
      {/* Search container - from Flokk _AnimatedSearchCard */}
      <div
        className="flex items-center w-full"
        style={{
          height: isOpen ? openHeight : closedHeight,
          // Background: bg1 when inactive, surface (white) when active
          backgroundColor: isActive ? Colors.surface : Colors.bg1,
          // BorderRadius: 6px (from Flokk BorderRadius.circular(6))
          borderRadius: Sizes.radiusSm,
          // Shadow: only when active (from Flokk: Shadows.m(theme.accent1Darker))
          boxShadow: isActive ? Shadows.searchBar : 'none',
          // Animations
          transition: `height ${Durations.fast}ms ease-out, background-color ${Durations.fast}ms ease-out, box-shadow ${Durations.fast}ms ease-out`,
          overflow: 'hidden',
        }}
      >
        {/* Inner row - from Flokk SearchQueryRow */}
        <div
          className="flex items-center w-full h-full"
          style={{
            paddingLeft: narrowMode ? Insets.m : Insets.l,
            paddingRight: Insets.m,
          }}
        >
          {/* Search Icon - only shown when not in narrowMode (from Flokk) */}
          {!narrowMode && (
            <>
              <button
                onClick={() => inputRef.current?.focus()}
                className="flex items-center justify-center shrink-0"
                style={{
                  color: Colors.accent1Darker,
                }}
                tabIndex={-1}
              >
                <SearchIcon size={Sizes.iconSizeMed} />
              </button>
              <div style={{ width: Insets.m }} />
            </>
          )}

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={narrowMode ? '' : placeholder}
            className="flex-1 h-full outline-none bg-transparent"
            style={{
              fontFamily: Fonts.primary,
              fontSize: '15px',
              color: Colors.txt,
              // Content padding from Flokk: EdgeInsets.all(Insets.m * 1.25 - 0.5).copyWith(left: 0)
              padding: `${Insets.m * 1.25 - 0.5}px 0`,
            }}
          />

          {/* Clear button - from Flokk: ColorShiftIconBtn with closeLarge, size 16 */}
          {query && (
            <button
              onClick={handleClear}
              className="flex items-center justify-center shrink-0"
              style={{
                color: Colors.grey,
                padding: 0,
                minWidth: 0,
                minHeight: 0,
                transition: `color ${Animations.button.duration} ${Animations.button.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = Colors.greyStrong}
              onMouseLeave={(e) => e.currentTarget.style.color = Colors.grey}
            >
              <ClearIcon size={16} />
            </button>
          )}

          {/* Search Icon in narrowMode - shown on right when no query */}
          {narrowMode && !query && (
            <button
              onClick={() => inputRef.current?.focus()}
              className="flex items-center justify-center shrink-0"
              style={{
                color: Colors.accent1Darker,
              }}
              tabIndex={-1}
            >
              <SearchIcon size={Sizes.iconSizeMed} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// Search Icon - sized to Sizes.iconMed (22px)
const SearchIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// Clear Icon (X) - from Flokk closeLarge
const ClearIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
