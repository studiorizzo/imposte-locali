import { useState, useEffect, useRef } from 'react';
import { Colors, Insets, TextStyles, Animations } from '../theme';

/**
 * MaterialDatePicker - Faithful replica of Flutter Material Design DatePicker
 *
 * Specifications from Flutter/Material Design 3:
 * - Dialog width: 360px
 * - Day cell: 40×40px
 * - Grid: 7 columns
 * - Header height: 56px
 * - Border radius: 28px (dialog), 20px (selected day circle)
 * - Typography: Quicksand for header, Lato for days
 * - Animations: 250ms (fast), 350ms (medium)
 */

interface MaterialDatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
}

// Italian weekday abbreviations (starting Monday)
const WEEKDAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

// Italian month names
const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

// Helper to get days in month
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get first day of month (0 = Sunday, adjusted for Monday start)
function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert from Sunday-start (0) to Monday-start (0)
  return day === 0 ? 6 : day - 1;
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
  minDate = new Date(1900, 0, 1),
  maxDate = new Date(2100, 11, 31),
}: MaterialDatePickerProps) {
  const today = new Date();
  const initialDate = value || today;

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

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
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Navigate to previous month
  const goToPrevMonth = () => {
    if (isAnimating) return;
    setSlideDirection('right');
    setIsAnimating(true);

    setTimeout(() => {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
      setIsAnimating(false);
      setSlideDirection(null);
    }, 150);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (isAnimating) return;
    setSlideDirection('left');
    setIsAnimating(true);

    setTimeout(() => {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
      setIsAnimating(false);
      setSlideDirection(null);
    }, 150);
  };

  // Handle day selection
  const handleDayClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    if (newDate >= minDate && newDate <= maxDate) {
      setSelectedDate(newDate);
      onChange(newDate);
      onClose();
    }
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const daysInPrevMonth = getDaysInMonth(
      viewMonth === 0 ? viewYear - 1 : viewYear,
      viewMonth === 0 ? 11 : viewMonth - 1
    );

    const days: Array<{ day: number; isCurrentMonth: boolean; date: Date }> = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const month = viewMonth === 0 ? 11 : viewMonth - 1;
      const year = viewMonth === 0 ? viewYear - 1 : viewYear;
      days.push({ day, isCurrentMonth: false, date: new Date(year, month, day) });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true, date: new Date(viewYear, viewMonth, day) });
    }

    // Next month days (fill remaining cells to complete 6 rows)
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42
    for (let day = 1; day <= remainingCells; day++) {
      const month = viewMonth === 11 ? 0 : viewMonth + 1;
      const year = viewMonth === 11 ? viewYear + 1 : viewYear;
      days.push({ day, isCurrentMonth: false, date: new Date(year, month, day) });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Check if date is disabled
  const isDisabled = (date: Date): boolean => {
    return date < minDate || date > maxDate;
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

      {/* Dialog - centered */}
      <div
        ref={dialogRef}
        style={{
          position: 'relative',
          width: 360,
          backgroundColor: Colors.surface,
          borderRadius: 28,
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
          {/* Previous month button */}
          <button
            type="button"
            onClick={goToPrevMonth}
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

          {/* Month/Year display */}
          <div
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 0.7,
              color: Colors.accentTxt,
              textTransform: 'capitalize',
            }}
          >
            {MONTHS_IT[viewMonth]} {viewYear}
          </div>

          {/* Next month button */}
          <button
            type="button"
            onClick={goToNextMonth}
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

        {/* Calendar content */}
        <div style={{ padding: `${Insets.m}px ${Insets.sm}px` }}>
          {/* Weekday headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              marginBottom: 8,
            }}
          >
            {WEEKDAYS_IT.map((day) => (
              <div
                key={day}
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

          {/* Days grid */}
          <div
            ref={calendarRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              opacity: isAnimating ? 0.5 : 1,
              transform: slideDirection === 'left'
                ? 'translateX(-10px)'
                : slideDirection === 'right'
                  ? 'translateX(10px)'
                  : 'translateX(0)',
              transition: `opacity 150ms ease-out, transform 150ms ease-out`,
            }}
          >
            {calendarDays.map((dayInfo, index) => {
              const isSelected = selectedDate && isSameDay(dayInfo.date, selectedDate);
              const isTodayDate = isToday(dayInfo.date);
              const disabled = !dayInfo.isCurrentMonth || isDisabled(dayInfo.date);
              const isHovered = hoveredDay === index && !disabled;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !disabled && handleDayClick(dayInfo.day)}
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
                    border: isTodayDate && !isSelected
                      ? `2px solid ${Colors.accent1}`
                      : 'none',
                    borderRadius: 20,
                    backgroundColor: isSelected
                      ? Colors.accent1
                      : isHovered
                        ? Colors.bg1
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

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: Insets.sm,
            padding: `${Insets.m}px ${Insets.l}px`,
            borderTop: `1px solid ${Colors.bg2}`,
          }}
        >
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
              e.currentTarget.style.backgroundColor = Colors.bg1;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedDate) {
                onChange(selectedDate);
              }
              onClose();
            }}
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
              e.currentTarget.style.backgroundColor = Colors.bg1;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
