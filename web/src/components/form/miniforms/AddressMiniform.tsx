import { useState, useRef, useEffect } from 'react';
import { Colors, Insets, TextStyles, Animations } from '../../../theme';
import { StyledDropdown } from '../StyledDropdown';
import { PROVINCE_OPTIONS } from '../constants';

export interface AddressMiniformProps {
  icon: React.ReactNode;
  indirizzo: string;
  civico: string;
  comune: string;
  provincia: string;
  onChangeIndirizzo: (value: string) => void;
  onChangeCivico: (value: string) => void;
  onChangeComune: (value: string) => void;
  onChangeProvincia: (value: string) => void;
}

/**
 * AddressMiniform - expandable field for fiscal domicile address
 * Shows "Aggiungi domicilio fiscale" when closed, expands to show address fields
 */
export function AddressMiniform({
  icon,
  indirizzo,
  civico,
  comune,
  provincia,
  onChangeIndirizzo,
  onChangeCivico,
  onChangeComune,
  onChangeProvincia,
}: AddressMiniformProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasContent = indirizzo || civico || comune || provincia;

  const hasContentRef = useRef(hasContent);
  hasContentRef.current = hasContent;

  const getDisplayText = () => {
    if (!hasContent) return '';
    const parts = [];
    if (indirizzo) parts.push(indirizzo);
    if (civico) parts.push(civico);
    if (comune) parts.push(comune);
    if (provincia) parts.push(`(${provincia})`);
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
      if (!hasContentRef.current) {
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
              {hasContent ? getDisplayText() : 'Aggiungi domicilio fiscale'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.sm * 0.5 }}>
              {/* Indirizzo + Civico row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: Insets.m }}>
                <input
                  type="text"
                  placeholder="Indirizzo"
                  value={indirizzo}
                  onChange={(e) => onChangeIndirizzo(e.target.value)}
                  onFocus={() => handleFieldFocus('indirizzo')}
                  onBlur={(e) => {
                    e.target.scrollLeft = 0;
                    handleFieldBlur();
                  }}
                  autoFocus
                  className="bg-transparent outline-none"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    ...TextStyles.body1,
                    color: Colors.greyStrong,
                    paddingTop: 4,
                    paddingBottom: Insets.sm,
                    borderBottom: `2px solid ${focusedField === 'indirizzo' ? Colors.accent1 : Colors.greyWeak}`,
                    transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                    caretColor: Colors.accent1,
                  }}
                />
                <input
                  type="text"
                  placeholder="Civico"
                  value={civico}
                  onChange={(e) => onChangeCivico(e.target.value)}
                  onFocus={() => handleFieldFocus('civico')}
                  onBlur={handleFieldBlur}
                  className="bg-transparent outline-none"
                  style={{
                    width: 60,
                    ...TextStyles.body1,
                    color: Colors.greyStrong,
                    paddingTop: 4,
                    paddingBottom: Insets.sm,
                    borderBottom: `2px solid ${focusedField === 'civico' ? Colors.accent1 : Colors.greyWeak}`,
                    transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                    caretColor: Colors.accent1,
                  }}
                />
              </div>
              {/* Comune + Prov. row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: Insets.m }}>
                <input
                  type="text"
                  placeholder="Comune"
                  value={comune}
                  onChange={(e) => onChangeComune(e.target.value)}
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
                  value={provincia}
                  onChange={onChangeProvincia}
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
