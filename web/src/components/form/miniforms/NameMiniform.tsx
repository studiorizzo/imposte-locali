import { useState, useRef, useEffect } from 'react';
import { Colors } from '../../../theme';
import { Insets, TextStyles, Animations } from '../../../styles';
import { StyledDropdown } from '../StyledDropdown';

export interface NameMiniformProps {
  icon: React.ReactNode;
  tippiologie: string[];
  cognomeDenominazione: string;
  nome: string;
  sesso: string;
  codiceFiscale: string;
  onChangeCognomeDenominazione: (value: string) => void;
  onChangeNome: (value: string) => void;
  onChangeSesso: (value: string) => void;
  onChangeCodiceFiscale: (value: string) => void;
}

/**
 * NameMiniform - like Flokk's NameMiniForm, expands to show name fields
 * Shows "Aggiungi contribuente" when closed, expands to show fields based on tipologia
 */
export function NameMiniform({
  icon,
  tippiologie,
  cognomeDenominazione,
  nome,
  sesso,
  codiceFiscale,
  onChangeCognomeDenominazione,
  onChangeNome,
  onChangeSesso,
  onChangeCodiceFiscale,
}: NameMiniformProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine field labels based on tipologia
  const isPersonaFisica = tippiologie.includes('PERSONA FISICA');
  const isPersonaGiuridica = tippiologie.includes('PERSONA GIURIDICA');

  // First field label
  const getCognomeDenominazioneLabel = () => {
    if (isPersonaFisica) return 'Cognome';
    if (isPersonaGiuridica) return 'Denominazione o Ragione sociale';
    return 'Cognome, Denominazione o Ragione sociale';
  };

  // Show Nome field only for persona fisica or no selection
  const showNomeField = isPersonaFisica || (!isPersonaFisica && !isPersonaGiuridica);

  // Check if there's any content
  const hasContent = cognomeDenominazione || nome || sesso || codiceFiscale;

  // Use ref to track hasContent for timeout callbacks
  const hasContentRef = useRef(hasContent);
  hasContentRef.current = hasContent;

  // Build display text for closed state
  const getDisplayText = () => {
    if (!hasContent) return '';
    const parts = [];
    if (cognomeDenominazione) parts.push(cognomeDenominazione);
    if (nome && showNomeField) parts.push(nome);
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
              {hasContent ? getDisplayText() : 'Aggiungi contribuente'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.sm * 0.5 }}>
              {/* Cognome / Denominazione field */}
              <input
                type="text"
                placeholder={getCognomeDenominazioneLabel()}
                value={cognomeDenominazione}
                onChange={(e) => onChangeCognomeDenominazione(e.target.value)}
                onFocus={() => handleFieldFocus('cognome')}
                onBlur={(e) => {
                  e.target.scrollLeft = 0;
                  handleFieldBlur();
                }}
                autoFocus
                className="w-full bg-transparent outline-none"
                style={{
                  ...TextStyles.body1,
                  color: Colors.greyStrong,
                  paddingTop: 4,
                  paddingBottom: Insets.sm,
                  borderBottom: `2px solid ${focusedField === 'cognome' ? Colors.accent1 : Colors.greyWeak}`,
                  transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                  caretColor: Colors.accent1,
                }}
              />
              {/* Nome + Sesso row */}
              {showNomeField && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: Insets.m }}>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => onChangeNome(e.target.value)}
                    onFocus={() => handleFieldFocus('nome')}
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
                      borderBottom: `2px solid ${focusedField === 'nome' ? Colors.accent1 : Colors.greyWeak}`,
                      transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                      caretColor: Colors.accent1,
                    }}
                  />
                  <StyledDropdown
                    value={sesso}
                    onChange={onChangeSesso}
                    options={['F', 'M']}
                    placeholder="Sesso"
                    width={60}
                    onFocus={() => handleFieldFocus('sesso')}
                    onBlur={handleFieldBlur}
                    isFocused={focusedField === 'sesso'}
                  />
                </div>
              )}
              {/* Codice Fiscale field */}
              <input
                type="text"
                placeholder="Codice Fiscale"
                value={codiceFiscale}
                onChange={(e) => onChangeCodiceFiscale(e.target.value.toUpperCase())}
                onFocus={() => handleFieldFocus('cf')}
                onBlur={handleFieldBlur}
                className="w-full bg-transparent outline-none"
                style={{
                  ...TextStyles.body1,
                  color: Colors.greyStrong,
                  paddingTop: 4,
                  paddingBottom: Insets.sm,
                  borderBottom: `2px solid ${focusedField === 'cf' ? Colors.accent1 : Colors.greyWeak}`,
                  transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                  caretColor: Colors.accent1,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
