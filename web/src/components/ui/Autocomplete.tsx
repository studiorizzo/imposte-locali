import { useState, useRef, useEffect } from 'react';

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps<T extends AutocompleteOption> {
  label?: string;
  placeholder?: string;
  options: T[];
  value: T | null;
  onChange: (option: T | null) => void;
  error?: string;
  hint?: string;
  maxResults?: number;
  minCharsPrefix?: number;    // Minimo caratteri per cercare all'inizio (default 2)
  minCharsContains?: number;  // Minimo caratteri per cercare ovunque (default 3)
}

export function Autocomplete<T extends AutocompleteOption>({
  label,
  placeholder = 'Cerca...',
  options,
  value,
  onChange,
  error,
  hint,
  maxResults = 10,
  minCharsPrefix = 2,
  minCharsContains = 3,
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState(value?.label || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = (() => {
    const query = inputValue.trim().toLowerCase();
    const len = query.length;

    if (len < minCharsPrefix) return [];

    // Con almeno minCharsPrefix caratteri: cerca all'inizio
    // Con almeno minCharsContains caratteri: cerca anche all'interno
    return options
      .filter((opt) => {
        const labelLower = opt.label.toLowerCase();
        if (len >= minCharsContains) {
          return labelLower.includes(query);
        }
        return labelLower.startsWith(query);
      })
      .slice(0, maxResults);
  })();

  useEffect(() => {
    setInputValue(value?.label || '');
  }, [value]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (!newValue.trim()) {
      onChange(null);
    }
  };

  const handleSelect = (option: T) => {
    onChange(option);
    setInputValue(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredOptions.length === 0) {
      if (e.key === 'ArrowDown' && inputValue.trim()) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay to allow click on option
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
      // Reset to selected value if input doesn't match
      if (value && inputValue !== value.label) {
        setInputValue(value.label);
      } else if (!value && inputValue) {
        setInputValue('');
      }
    }, 150);
  };

  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full relative">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue.trim() && setIsOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
        `}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`
                px-3 py-2 cursor-pointer
                ${index === highlightedIndex ? 'bg-primary-100 text-primary-900' : 'hover:bg-gray-100'}
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
