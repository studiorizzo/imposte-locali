import { useState, useRef, useEffect } from 'react';
import { Colors, Insets, TextStyles, Animations } from '../../../theme';

export interface LabelMiniformProps {
  icon: React.ReactNode;
  placeholder: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  primarySuggestions: string[];
  secondarySuggestions: Record<string, string[]>;
}

/**
 * LabelMiniform - like Flokk's LabelMiniForm with suggestions dropdown
 * Shows chips inline with placeholder, supports multiple selections
 */
export function LabelMiniform({
  icon,
  placeholder,
  values,
  onAdd,
  onRemove,
  primarySuggestions,
  secondarySuggestions,
}: LabelMiniformProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag-to-scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Auto-scroll to end when chips change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [values]);

  const handleFocus = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 750);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onAdd(suggestion);
  };

  // Determine which primary is selected (if any)
  const selectedPrimary = values.find(v => primarySuggestions.includes(v));

  // Get available suggestions
  const getAvailableSuggestions = () => {
    if (!selectedPrimary) {
      return primarySuggestions.filter(s => !values.includes(s));
    } else {
      const secondary = secondarySuggestions[selectedPrimary] || [];
      return secondary.filter(s => !values.includes(s));
    }
  };

  const availableSuggestions = getAvailableSuggestions();

  // Chip style (StyledGroupLabel)
  const chipStyle = {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 0,
    backgroundColor: `${Colors.bg2}59`,
    color: Colors.grey,
    paddingLeft: Insets.m,
    paddingRight: Insets.sm,
    paddingTop: Insets.sm,
    paddingBottom: Insets.sm,
    borderRadius: 5,
    gap: Insets.sm,
    userSelect: 'none' as const,
    cursor: 'default',
  };

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
          {/* Scrollable content + underline */}
          <div
            ref={scrollContainerRef}
            onMouseDown={values.length > 0 ? handleMouseDown : undefined}
            onMouseMove={values.length > 0 ? handleMouseMove : undefined}
            onMouseUp={values.length > 0 ? handleMouseUp : undefined}
            onMouseLeave={values.length > 0 ? handleMouseUp : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: Insets.sm,
              paddingBottom: Insets.sm,
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: values.length > 0 && isDragging ? 'grabbing' : values.length > 0 ? 'grab' : 'default',
              borderBottom: `2px solid ${isFocused ? Colors.accent1 : Colors.greyWeak}`,
              transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
            }}
            className="hide-scrollbar"
          >
            {/* Chips */}
            {values.map((v) => (
              <div
                key={v}
                className="inline-flex items-center"
                style={{ ...chipStyle, flexShrink: 0 }}
              >
                <span>{v}</span>
                <button
                  onClick={() => onRemove(v)}
                  className="flex items-center justify-center"
                  style={{
                    width: 16,
                    height: 16,
                    color: Colors.grey,
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>
                </button>
              </div>
            ))}
            {/* Placeholder input */}
            <input
              type="text"
              placeholder={placeholder}
              value=""
              readOnly
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="bg-transparent outline-none cursor-pointer"
              style={{
                ...TextStyles.body1,
                color: Colors.greyStrong,
                flexShrink: 0,
                paddingTop: 4,
              }}
            />
          </div>
          {/* Suggestions dropdown */}
          {isOpen && availableSuggestions.length > 0 && (
            <div style={{ marginTop: Insets.m }}>
              <div
                style={{
                  ...TextStyles.caption,
                  color: Colors.grey,
                  paddingBottom: Insets.m,
                  textTransform: 'uppercase',
                }}
              >
                Suggerimenti
              </div>
              <div className="flex flex-wrap" style={{ gap: Insets.sm, rowGap: Insets.sm * 1.5 }}>
                {availableSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="transition-colors"
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0,
                      backgroundColor: `${Colors.bg2}59`,
                      color: Colors.grey,
                      paddingLeft: Insets.m,
                      paddingRight: Insets.m,
                      paddingTop: Insets.sm,
                      paddingBottom: Insets.sm,
                      borderRadius: 5,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = Colors.accent1;
                      e.currentTarget.style.color = Colors.accentTxt;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${Colors.bg2}59`;
                      e.currentTarget.style.color = Colors.grey;
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
