import { useState, useRef, useEffect } from 'react';
import { Colors } from '../../theme';
import { Insets, TextStyles, Animations } from '../../styles';

export interface StyledDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  width?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
}

/**
 * StyledDropdown - faithful to Flokk's StyledAutoCompleteDropdown
 * Custom dropdown with input-like appearance and overlay
 */
export function StyledDropdown({
  value,
  onChange,
  options,
  placeholder,
  width = 60,
  onFocus,
  onBlur,
  isFocused: externalFocused,
}: StyledDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalFocused, setInternalFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFocused = externalFocused !== undefined ? externalFocused : internalFocused;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setInternalFocused(false);
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onBlur]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setInternalFocused(true);
      onFocus?.();
    } else {
      setIsOpen(false);
      setInternalFocused(false);
      onBlur?.();
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    // Keep focus state for a moment to allow parent's blur timeout to work
    setTimeout(() => {
      setInternalFocused(false);
      onBlur?.();
    }, 50);
  };

  // Flokk styling (flat design, no shadows):
  // - Input: contentPadding right: 22, bottom: Insets.sm (6px)
  // - TextStyles.body1 (14px Lato)
  // - Arrow: centered vertically, size 12px
  // - Dropdown: rowHeight 40, surface bg

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        flexShrink: 0,
      }}
    >
      {/* Input-like display */}
      <div
        onClick={handleToggle}
        style={{
          ...TextStyles.body1,
          color: value ? Colors.greyStrong : Colors.greyWeak,
          paddingTop: 4,
          paddingBottom: Insets.sm,
          paddingRight: 22,
          borderBottom: `2px solid ${isFocused ? Colors.accent1 : Colors.greyWeak}`,
          transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value || placeholder}
      </div>

      {/* Arrow icon - centered vertically with text */}
      <div
        onClick={handleToggle}
        style={{
          position: 'absolute',
          right: 4,
          top: '50%',
          width: 12,
          height: 12,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(-50%) rotate(${isOpen ? 0 : 180}deg)`,
          transition: `transform ${Animations.button.duration} ${Animations.button.easing}`,
        }}
      >
        <svg
          width={12}
          height={12}
          viewBox="0 0 12 12"
          fill="none"
          style={{ color: Colors.greyStrong }}
        >
          <path
            d="M2.5 7.5L6 4L9.5 7.5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Dropdown overlay */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: 34,
            left: 0,
            minWidth: '100%',
            maxHeight: 40 * 9,
            overflowY: 'auto',
            backgroundColor: Colors.surface,
            zIndex: 1000,
          }}
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 40,
                paddingLeft: Insets.m,
                paddingRight: Insets.m,
                ...TextStyles.body1,
                color: Colors.greyWeak,
                textTransform: 'uppercase',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: `background-color ${Animations.button.duration}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = Colors.bg1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
