import { useState, useRef, useEffect } from 'react';
import { Colors } from '../../theme';
import { Insets, TextStyles, Animations } from '../../styles';

export interface ExpandableTextFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  inputPlaceholder: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * ExpandableTextField - simple expandable field for single input
 * Shows placeholder text when closed, expands to show input field
 */
export function ExpandableTextField({
  icon,
  placeholder,
  inputPlaceholder,
  value,
  onChange,
}: ExpandableTextFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use ref to track value for timeout callbacks
  const valueRef = useRef(value);
  valueRef.current = value;

  const handlePromptClick = () => {
    setIsOpen(true);
  };

  const handleFocus = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    closeTimeoutRef.current = setTimeout(() => {
      if (!valueRef.current) {
        setIsOpen(false);
      }
    }, 750);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="flex items-start"
      style={{ gap: Insets.l }}
    >
      {/* Icon */}
      <div
        style={{
          color: Colors.grey,
          flexShrink: 0,
          marginTop: 4,
        }}
      >
        {icon}
      </div>
      {/* Content wrapper */}
      <div
        className="flex-1"
        style={{ paddingRight: Insets.m, minWidth: 0 }}
      >
        <div style={{ paddingRight: Insets.l * 1.5 - 2 }}>
          {!isOpen ? (
            // Closed state
            <div
              onClick={handlePromptClick}
              style={{
                ...TextStyles.body1,
                color: value ? Colors.greyStrong : Colors.greyWeak,
                paddingTop: 4,
                paddingBottom: Insets.sm,
                borderBottom: `2px solid ${Colors.greyWeak}`,
                cursor: 'pointer',
              }}
            >
              {value || placeholder}
            </div>
          ) : (
            // Open state
            <input
              type="text"
              placeholder={inputPlaceholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={(e) => {
                e.target.scrollLeft = 0;
                handleBlur();
              }}
              autoFocus
              className="w-full bg-transparent outline-none"
              style={{
                ...TextStyles.body1,
                color: Colors.greyStrong,
                paddingTop: 4,
                paddingBottom: Insets.sm,
                borderBottom: `2px solid ${isFocused ? Colors.accent1 : Colors.greyWeak}`,
                transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                caretColor: Colors.accent1,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
