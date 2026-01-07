import { useState, useEffect, useRef } from 'react';
import { Colors, Insets, Sizes, TextStyles, Animations } from '../theme';

/**
 * MaterialDatePicker - Custom date picker inspired by Material Design
 *
 * Features:
 * - 6-row calendar grid
 * - Year selector dropdown (100 years back)
 * - Month navigation arrows on right
 */

interface MaterialDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
}

// Calculate default min year (100 years ago) - function to ensure runtime evaluation
function getDefaultMinDate(): Date {
  return new Date(new Date().getFullYear() - 100, 0, 1);
}

// Italian weekday abbreviations (starting Monday)
const WEEKDAYS_IT = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

// Italian month names
const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

// Helper to get days in month
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get first day of month (0 = Monday, 6 = Sunday)
function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7; // Convert Sunday=0 to Sunday=6, Monday=1 to Monday=0
}

// Helper to check if two dates are the same day
function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
}

// Helper to check if a date is today
function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function MaterialDatePicker({
  value,
  onChange,
  onClose,
  minDate,
  maxDate = new Date(2100, 11, 31),
}: MaterialDatePickerProps) {
  // Use provided minDate or calculate default (100 years ago)
  const effectiveMinDate = minDate ?? getDefaultMinDate();
  const today = new Date();
  const initialDate = value || today;

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showYearSelector) {
          setShowYearSelector(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showYearSelector]);

  // Scroll to current year when year selector opens
  useEffect(() => {
    if (showYearSelector && yearListRef.current) {
      const selectedYearButton = yearListRef.current.querySelector(`[data-year="${viewYear}"]`);
      if (selectedYearButton) {
        selectedYearButton.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [showYearSelector, viewYear]);

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Handle day selection
  const handleDayClick = (day: number, monthOffset: number = 0) => {
    let targetMonth = viewMonth + monthOffset;
    let targetYear = viewYear;

    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear--;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear++;
    }

    const newDate = new Date(targetYear, targetMonth, day);
    if (newDate >= effectiveMinDate && newDate <= maxDate) {
      setSelectedDate(newDate);
    }
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setShowYearSelector(false);
  };

  // Generate calendar grid (6 rows = 42 cells)
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const daysInPrevMonth = getDaysInMonth(
      viewMonth === 0 ? viewYear - 1 : viewYear,
      viewMonth === 0 ? 11 : viewMonth - 1
    );

    const days: Array<{ day: number; monthOffset: number; date: Date }> = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const month = viewMonth === 0 ? 11 : viewMonth - 1;
      const year = viewMonth === 0 ? viewYear - 1 : viewYear;
      days.push({ day, monthOffset: -1, date: new Date(year, month, day) });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, monthOffset: 0, date: new Date(viewYear, viewMonth, day) });
    }

    // Next month days (fill remaining cells to complete 6 rows = 42 cells)
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const month = viewMonth === 11 ? 0 : viewMonth + 1;
      const year = viewMonth === 11 ? viewYear + 1 : viewYear;
      days.push({ day, monthOffset: 1, date: new Date(year, month, day) });
    }

    return days.slice(0, 42); // Ensure exactly 42 cells
  };

  // Generate years for selector
  const generateYears = () => {
    const minYear = effectiveMinDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    const years: number[] = [];

    for (let year = minYear; year <= maxYear; year++) {
      years.push(year);
    }

    return years;
  };

  const calendarDays = generateCalendarDays();
  const years = generateYears();

  // Check if date is disabled
  const isDisabled = (date: Date): boolean => {
    return date < effectiveMinDate || date > maxDate;
  };

  // Handle OK
  const handleOk = () => {
    if (selectedDate) {
      onChange(selectedDate);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        style={{
          position: 'relative',
          width: 360,
          backgroundColor: Colors.surface,
          borderRadius: Sizes.radiusLg,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 56,
            backgroundColor: Colors.accent1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${Insets.m}px`,
          }}
        >
          {/* Month/Year dropdown button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowYearSelector(!showYearSelector);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: `${Insets.xs}px ${Insets.sm}px`,
              borderRadius: 4,
              transition: `background-color ${Animations.button.duration}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 0.7,
                color: Colors.accentTxt,
              }}
            >
              {MONTHS_IT[viewMonth]} {viewYear}
            </span>
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              style={{
                color: Colors.accentTxt,
                transform: showYearSelector ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: `transform ${Animations.button.duration}`,
              }}
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Navigation arrows (both on right) - hidden in year selector */}
          {!showYearSelector && (
            <div style={{ display: 'flex', gap: 0 }}>
              <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevMonth();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
                color: Colors.accentTxt,
                transition: `background-color ${Animations.button.duration}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNextMonth();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
                color: Colors.accentTxt,
                transition: `background-color ${Animations.button.duration}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              </button>
            </div>
          )}
        </div>

        {/* Calendar or Year selector content */}
        {showYearSelector ? (
          /* Year selector grid */
          <>
            <div
              ref={yearListRef}
              style={{
                padding: `${Insets.m}px`,
                height: 336,
                boxSizing: 'border-box',
                overflowY: 'auto',
                backgroundColor: Colors.bg1,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: Insets.sm,
                }}
              >
                {years.map((year) => {
                  const isSelected = year === viewYear;
                  const isHovered = hoveredYear === year;
                  const isCurrentYear = year === today.getFullYear();

                  return (
                    <button
                      key={year}
                      type="button"
                      data-year={year}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleYearSelect(year);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseEnter={() => setHoveredYear(year)}
                      onMouseLeave={() => setHoveredYear(null)}
                      style={{
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected
                          ? Colors.accent1
                          : isHovered
                            ? Colors.bg2
                            : 'transparent',
                        border: 'none',
                        borderRadius: 20,
                        cursor: 'pointer',
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 14,
                        fontWeight: isSelected || isCurrentYear ? 600 : 400,
                        color: isSelected
                          ? Colors.accentTxt
                          : isCurrentYear
                            ? Colors.accent1
                            : Colors.greyStrong,
                        transition: `background-color ${Animations.button.duration}`,
                      }}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Pencil icon area for year selector - same position as calendar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: `${Insets.m}px ${Insets.l}px`,
                backgroundColor: Colors.bg1,
              }}
            >
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 20,
                  cursor: 'pointer',
                  color: Colors.accent1,
                  transition: `background-color ${Animations.button.duration}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = Colors.bg2;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* Calendar grid */
          <div style={{ padding: `${Insets.m}px ${Insets.sm}px`, height: 336, boxSizing: 'border-box', backgroundColor: Colors.bg1 }}>
            {/* Weekday headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                marginBottom: 8,
              }}
            >
              {WEEKDAYS_IT.map((day, index) => (
                <div
                  key={index}
                  style={{
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...TextStyles.body2,
                    color: Colors.grey,
                    fontWeight: 400,
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid (5 rows) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
              }}
            >
              {calendarDays.map((dayInfo, index) => {
                const isSelected = selectedDate && isSameDay(dayInfo.date, selectedDate);
                const isTodayDate = isToday(dayInfo.date);
                const isCurrentMonth = dayInfo.monthOffset === 0;
                const disabled = !isCurrentMonth || isDisabled(dayInfo.date);
                const isHovered = hoveredDay === index && !disabled;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!disabled) handleDayClick(dayInfo.day, dayInfo.monthOffset);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseEnter={() => !disabled && setHoveredDay(index)}
                    onMouseLeave={() => setHoveredDay(null)}
                    disabled={disabled}
                    style={{
                      width: 40,
                      height: 40,
                      margin: '2px auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isTodayDate && !isSelected && isCurrentMonth
                        ? `2px solid ${Colors.accent1}`
                        : 'none',
                      borderRadius: 20,
                      backgroundColor: isSelected
                        ? Colors.accent1
                        : isHovered
                          ? Colors.bg2
                          : 'transparent',
                      cursor: disabled ? 'default' : 'pointer',
                      transition: `background-color ${Animations.button.duration} ${Animations.button.easing}`,
                      ...TextStyles.body1,
                      color: isSelected
                        ? Colors.accentTxt
                        : disabled
                          ? Colors.greyWeak
                          : isTodayDate
                            ? Colors.accent1
                            : Colors.greyStrong,
                      fontWeight: isTodayDate || isSelected ? 600 : 400,
                    }}
                  >
                    {dayInfo.day}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons - hidden in year selector */}
        {!showYearSelector && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: `${Insets.m}px ${Insets.l}px`,
              backgroundColor: Colors.bg1,
            }}
          >
            {/* Pencil icon for manual entry */}
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
                color: Colors.accent1,
                transition: `background-color ${Animations.button.duration}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = Colors.bg2;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: Insets.sm }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1.75,
                  textTransform: 'uppercase',
                  color: Colors.grey,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 5,
                  padding: `${Insets.sm}px ${Insets.m}px`,
                  cursor: 'pointer',
                  transition: `background-color ${Animations.button.duration}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = Colors.bg2;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleOk}
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1.75,
                  textTransform: 'uppercase',
                  color: Colors.accent1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 5,
                  padding: `${Insets.sm}px ${Insets.m}px`,
                  cursor: 'pointer',
                  transition: `background-color ${Animations.button.duration}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = Colors.bg2;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
