import { useState, useRef, useEffect } from 'react';
import { Colors } from '../../theme';
import { Insets, TextStyles, Animations } from '../../styles';
import CancelRingIcon from '../../assets/cancel_ring_form.svg';
import AddRingIcon from '../../assets/Add_ring_form.svg';

export interface MultiValueTextFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  inputPlaceholder: string;
  addButtonLabel: string;
  values: string[];
  onChange: (values: string[]) => void;
}

/**
 * MultiValueTextField - expandable field for multiple values (like Flokk's email/phone fields)
 * Shows placeholder when closed, expands to show multiple inputs with add/delete functionality
 * - Delete button appears on the right when a field has content
 * - Add button appears below the last field when it has content
 * - Max 8 items
 */
export function MultiValueTextField({
  icon,
  placeholder,
  inputPlaceholder,
  addButtonLabel,
  values,
  onChange,
}: MultiValueTextFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deleteHovered, setDeleteHovered] = useState<number | null>(null);
  const [addHovered, setAddHovered] = useState(false);

  // Use ref to track values for timeout callbacks
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const hasContent = values.length > 0 && values.some(v => v.trim() !== '');

  // Build display text for closed state
  const getDisplayText = () => {
    const nonEmpty = values.filter(v => v.trim() !== '');
    return nonEmpty.join(', ');
  };

  const handlePromptClick = () => {
    // Initialize with one empty value if needed
    if (values.length === 0) {
      onChange(['']);
    }
    setIsOpen(true);
  };

  const handleFocus = (index: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
    closeTimeoutRef.current = setTimeout(() => {
      // Close if all values are empty
      const hasAnyContent = valuesRef.current.some(v => v.trim() !== '');
      if (!hasAnyContent) {
        onChange([]);
        setIsOpen(false);
      }
    }, 750);
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleDelete = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    // If deleted the last one, close the field
    if (newValues.length === 0) {
      onChange([]);
      setIsOpen(false);
    } else {
      onChange(newValues);
    }
  };

  const handleAdd = () => {
    if (values.length < 8) {
      onChange([...values, '']);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Check if should show add button (last item has content and not at max)
  const lastValue = values[values.length - 1] || '';
  const showAddButton = values.length > 0 && lastValue.trim() !== '' && values.length < 8;

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
      {/* Content wrapper - paddingRight: 12px from Flokk */}
      <div
        className="flex-1"
        style={{ paddingRight: Insets.m, minWidth: 0 }}
      >
        {!isOpen ? (
          // Closed state - wrapper with paddingRight: 34px like Flokk prompt
          <div style={{ paddingRight: Insets.l * 1.5 - 2 }}>
            <div
              onClick={handlePromptClick}
              style={{
                ...TextStyles.body1,
                color: hasContent ? Colors.greyStrong : Colors.greyWeak,
                paddingTop: 4,
                paddingBottom: Insets.sm,
                borderBottom: `2px solid ${Colors.greyWeak}`,
                cursor: 'pointer',
              }}
            >
              {hasContent ? getDisplayText() : placeholder}
            </div>
          </div>
        ) : (
          // Open state - NO additional padding, delete button at edge
          <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.sm * 0.5 }}>
            {values.map((value, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-end' }}>
                {/* Input field - flexible, takes remaining space */}
                <input
                  type="text"
                  placeholder={inputPlaceholder}
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  onFocus={() => handleFocus(index)}
                  onBlur={(e) => {
                    e.target.scrollLeft = 0;
                    handleBlur();
                  }}
                  autoFocus={index === values.length - 1}
                  className="bg-transparent outline-none"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    ...TextStyles.body1,
                    color: Colors.greyStrong,
                    paddingTop: 4,
                    paddingBottom: Insets.sm,
                    borderBottom: `2px solid ${focusedIndex === index ? Colors.accent1 : Colors.greyWeak}`,
                    transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                    caretColor: Colors.accent1,
                  }}
                />
                {/* Delete button - at end of row, opacity animated */}
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  onMouseEnter={() => setDeleteHovered(index)}
                  onMouseLeave={() => setDeleteHovered(null)}
                  style={{
                    padding: Insets.sm,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // First row: show only when has content; other rows: always show
                    opacity: (index === 0 ? value.trim() !== '' : true) ? 1 : 0,
                    pointerEvents: (index === 0 ? value.trim() !== '' : true) ? 'auto' : 'none',
                    transition: `opacity ${Animations.button.duration}`,
                    filter: deleteHovered === index ? 'brightness(0.7)' : 'none',
                  }}
                >
                  <img src={CancelRingIcon} alt="Elimina" width={20} height={20} />
                </button>
              </div>
            ))}
            {/* Add button - show when last item has content */}
            {showAddButton && (
              <button
                type="button"
                onClick={handleAdd}
                onMouseEnter={() => setAddHovered(true)}
                onMouseLeave={() => setAddHovered(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: Insets.sm,
                  padding: `${Insets.sm}px`,
                  marginTop: Insets.sm * 0.5,
                  marginLeft: -4,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 5,
                  transition: `background-color ${Animations.button.duration}`,
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <img src={AddRingIcon} alt="" width={20} height={20} />
                <span
                  style={{
                    ...TextStyles.body1,
                    color: Colors.greyWeak,
                  }}
                >
                  {addButtonLabel}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
