import { useState, useRef, useEffect } from 'react';
import { Colors, Insets, TextStyles, Animations } from '../../../theme';
import { StyledDropdown } from '../StyledDropdown';
import { PROVINCE_OPTIONS } from '../constants';
import { MaterialDatePicker } from '../../MaterialDatePicker';
import ButtonCalendarIcon from '../../../assets/button_calendar.svg';

export interface DateLocationMiniformProps {
  icon: React.ReactNode;
  dataNascita: string;
  comuneNascita: string;
  provinciaNascita: string;
  onChangeDataNascita: (value: string) => void;
  onChangeComuneNascita: (value: string) => void;
  onChangeProvinciaNascita: (value: string) => void;
}

/**
 * DateLocationMiniform - for date and place of birth
 * Expands to show: Data di nascita, Comune (o Stato estero) di nascita, Prov.
 */
export function DateLocationMiniform({
  icon,
  dataNascita,
  comuneNascita,
  provinciaNascita,
  onChangeDataNascita,
  onChangeComuneNascita,
  onChangeProvinciaNascita,
}: DateLocationMiniformProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasContent = dataNascita || comuneNascita || provinciaNascita;

  const hasContentRef = useRef(hasContent);
  hasContentRef.current = hasContent;

  const showDatePickerRef = useRef(showDatePicker);
  showDatePickerRef.current = showDatePicker;

  const getDisplayText = () => {
    if (!hasContent) return '';
    const parts = [];
    if (dataNascita) parts.push(dataNascita);
    if (comuneNascita) parts.push(comuneNascita);
    if (provinciaNascita) parts.push(`(${provinciaNascita})`);
    return parts.join(' ');
  };

  const handlePromptClick = () => {
    setIsOpen(true);
  };

  const handleFieldFocus = (field: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setFocusedField(field);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
    closeTimeoutRef.current = setTimeout(() => {
      if (!hasContentRef.current && !showDatePickerRef.current) {
        setIsOpen(false);
      }
    }, 750);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleCalendarClick = () => {
    showDatePickerRef.current = true;
    setShowDatePicker(true);
  };

  const handleDatePickerClose = () => {
    showDatePickerRef.current = false;
    setShowDatePicker(false);
  };

  const handleDateSelect = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateStr = `${day}/${month}/${year}`;
    hasContentRef.current = dateStr;
    onChangeDataNascita(dateStr);
  };

  const parseDisplayDate = (): Date | undefined => {
    if (!dataNascita) return undefined;
    const parts = dataNascita.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return undefined;
  };

  return (
    <div
      className="flex items-start"
      style={{ gap: Insets.l }}
    >
      <div
        style={{
          color: Colors.grey,
          flexShrink: 0,
          marginTop: 4,
        }}
      >
        {icon}
      </div>
      <div
        className="flex-1"
        style={{ paddingRight: Insets.m, minWidth: 0 }}
      >
        <div style={{ paddingRight: Insets.l * 1.5 - 2 }}>
          {!isOpen ? (
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
              {hasContent ? getDisplayText() : 'Aggiungi data e luogo di nascita'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.sm * 0.5 }}>
              {/* Data di nascita + calendar button row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: Insets.m }}>
                <input
                  type="text"
                  placeholder="Data di nascita"
                  value={dataNascita}
                  onChange={(e) => onChangeDataNascita(e.target.value)}
                  onFocus={() => handleFieldFocus('data')}
                  onBlur={handleFieldBlur}
                  autoFocus
                  className="bg-transparent outline-none"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    ...TextStyles.body1,
                    color: Colors.greyStrong,
                    paddingTop: 4,
                    paddingBottom: Insets.sm,
                    borderBottom: `2px solid ${focusedField === 'data' ? Colors.accent1 : Colors.greyWeak}`,
                    transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                    caretColor: Colors.accent1,
                  }}
                />
                <button
                  type="button"
                  onClick={handleCalendarClick}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleFieldFocus('calendar');
                  }}
                  style={{
                    padding: '3px 4px',
                    backgroundColor: Colors.surface,
                    border: `2px solid ${Colors.grey}59`,
                    borderRadius: 5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: `border-color ${Animations.button.duration}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = Colors.accent1;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${Colors.grey}59`;
                  }}
                >
                  <img src={ButtonCalendarIcon} alt="Calendario" width={22} height={22} />
                </button>

                {showDatePicker && (
                  <MaterialDatePicker
                    value={parseDisplayDate()}
                    onChange={handleDateSelect}
                    onClose={handleDatePickerClose}
                    maxDate={new Date()}
                  />
                )}
              </div>
              {/* Comune + Prov. row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: Insets.m }}>
                <input
                  type="text"
                  placeholder="Comune (o Stato estero) di nascita"
                  value={comuneNascita}
                  onChange={(e) => onChangeComuneNascita(e.target.value)}
                  onFocus={() => handleFieldFocus('comune')}
                  onBlur={(e) => {
                    e.target.scrollLeft = 0;
                    handleFieldBlur();
                  }}
                  className="bg-transparent outline-none"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    ...TextStyles.body1,
                    color: Colors.greyStrong,
                    paddingTop: 4,
                    paddingBottom: Insets.sm,
                    borderBottom: `2px solid ${focusedField === 'comune' ? Colors.accent1 : Colors.greyWeak}`,
                    transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                    caretColor: Colors.accent1,
                  }}
                />
                <StyledDropdown
                  value={provinciaNascita}
                  onChange={onChangeProvinciaNascita}
                  options={PROVINCE_OPTIONS}
                  placeholder="Prov."
                  width={60}
                  onFocus={() => handleFieldFocus('provincia')}
                  onBlur={handleFieldBlur}
                  isFocused={focusedField === 'provincia'}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
