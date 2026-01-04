import { useState, useRef, useEffect } from 'react';
import { Colors, Sizes, Insets, Animations, TextStyles, Fonts, Shadows } from '../theme';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onContribuenteSelect?: (contribuente: ContribuenteResult) => void;
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

export function SearchBar({
  onSearch,
  onContribuenteSelect: _onContribuenteSelect,  // Will be used when implementing search results
  placeholder = 'Cerca contribuenti...',
  narrowMode = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Height from Flokk: topBarHeight - 5 = 55px
  const barHeight = Sizes.topBarHeight - 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className="relative flex items-center"
      style={{
        height: barHeight,
        maxWidth: narrowMode ? '100%' : 500,
        width: '100%',
      }}
    >
      {/* Search container */}
      <div
        className="flex items-center w-full"
        style={{
          height: '100%',
          backgroundColor: Colors.surface,
          borderRadius: Sizes.radiusMd,
          boxShadow: isFocused ? Shadows.md : Shadows.sm,
          border: `1px solid ${isFocused ? Colors.accent1 : 'transparent'}`,
          transition: `box-shadow ${Animations.button.duration} ${Animations.button.easing}, border-color ${Animations.button.duration} ${Animations.button.easing}`,
          overflow: 'hidden',
        }}
      >
        {/* Search Icon */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: '100%',
            color: isFocused ? Colors.accent1 : Colors.greyWeak,
            transition: `color ${Animations.button.duration} ${Animations.button.easing}`,
          }}
        >
          <SearchIcon />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 h-full outline-none"
          style={{
            fontFamily: Fonts.primary,
            fontSize: '15px',
            color: Colors.txt,
            backgroundColor: 'transparent',
          }}
        />

        {/* Clear button - only show when there's text */}
        {query && (
          <button
            onClick={handleClear}
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: '100%',
              color: Colors.greyWeak,
              transition: `color ${Animations.button.duration} ${Animations.button.easing}`,
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = Colors.grey}
            onMouseLeave={(e) => e.currentTarget.style.color = Colors.greyWeak}
          >
            <ClearIcon />
          </button>
        )}

        {/* Right padding */}
        <div style={{ width: query ? 8 : 16 }} />
      </div>
    </div>
  );
}

// Search Icon
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
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

// Clear Icon
const ClearIcon = () => (
  <svg
    width="16"
    height="16"
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
