import { useState, useRef, useEffect } from 'react';
import { Colors, Sizes, Shadows, Insets, TextStyles, Animations } from '../theme';
import LabelIcon from '../assets/Label_form.svg';
import UserFormIcon from '../assets/User_2_form.svg';

interface ContribuenteFormPanelProps {
  onClose: () => void;
  onSave: (data: ContribuenteFormData) => void;
  onDelete?: () => void;
}

export interface ContribuenteFormData {
  tippiologie: string[];
  cognomeDenominazione: string;  // Cognome o Denominazione/Ragione sociale
  nome: string;
  sesso: string;  // 'F' or 'M' - only for persona fisica
  codiceFiscale: string;
  email: string;
  telefono: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
}

const initialFormData: ContribuenteFormData = {
  tippiologie: [],
  cognomeDenominazione: '',
  nome: '',
  sesso: '',
  codiceFiscale: '',
  email: '',
  telefono: '',
  indirizzo: '',
  comune: '',
  cap: '',
  provincia: '',
};

// Tipologia suggestions - primary options
const TIPOLOGIA_PRIMARY = ['PERSONA FISICA', 'PERSONA GIURIDICA'];

// Secondary suggestions based on primary selection
const TIPOLOGIA_SECONDARY: Record<string, string[]> = {
  'PERSONA FISICA': ['ANZIANO/DISABILE RICOVERATO', 'RESIDENTE ESTERO', 'FORZE ARMATE, POLIZIA, VVF'],
  'PERSONA GIURIDICA': ['ONLUS', 'CONDOMINIO'],
};

export function ContribuenteFormPanel({ onClose, onSave, onDelete }: ContribuenteFormPanelProps) {
  const [formData, setFormData] = useState<ContribuenteFormData>(initialFormData);

  const handleChange = (field: keyof ContribuenteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setFormData(initialFormData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: Colors.surface,
        borderTopLeftRadius: Sizes.radiusMd,
        borderBottomLeftRadius: Sizes.radiusMd,
        boxShadow: Shadows.panel,
      }}
    >
      {/* Header - from Flokk contact_edit_panel_view:
          - contact_panel.dart: padding(top: Insets.l * 0.75) = 18px
          - contact_edit_panel_view: SizedBox(height: Insets.sm) = 6px
          - Total top: 24px
          - Row padding(horizontal: Insets.l) = 24px
          - Buttons use translate offset, not padding compensation
      */}
      <div
        className="flex items-center justify-between"
        style={{
          paddingTop: Insets.l * 0.75 + Insets.sm, // 18px + 6px = 24px
          paddingBottom: Insets.m,
          paddingLeft: Insets.l,
          paddingRight: Insets.l,
        }}
      >
        <button
          onClick={onDelete || handleClose}
          className="uppercase transition-all"
          style={{
            ...TextStyles.body1,
            color: Colors.grey,
            padding: `${Insets.sm}px ${Insets.sm}px`,
            lineHeight: 1,
            minWidth: 30,
            minHeight: 30,
            borderRadius: 5, // Corners.s5
            transform: `translateX(${-Insets.sm}px)`,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = Colors.bg1;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Elimina
        </button>
        <button
          onClick={handleSave}
          className="uppercase transition-all"
          style={{
            ...TextStyles.body1,
            color: Colors.accent1,
            padding: `${Insets.sm}px ${Insets.sm}px`,
            lineHeight: 1,
            minWidth: 30,
            minHeight: 30,
            borderRadius: 5, // Corners.s5
            transform: `translateX(${Insets.sm}px)`,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = Colors.bg1;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Salva
        </button>
      </div>

      {/* Form - from Flokk contact_edit_panel_view:
          - paddingTop: Insets.sm (6px)
          - paddingHorizontal: Insets.l (24px) - BOTH sides
          - paddingBottom: Insets.m (12px)
          - spacing between fields: Insets.m (12px) via SeparatedColumn
          - Each row adds: outer 12px + inner 34px = 46px
          - Total right padding: 24px + 46px = 70px
      */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: Insets.sm,
          paddingLeft: Insets.l,
          paddingRight: Insets.l, // Form horizontal padding
          paddingBottom: Insets.m + 30,
        }}
      >
        {/* Form fields with Insets.m (12px) vertical spacing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.m }}>
          <LabelField
            icon={<img src={LabelIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
            placeholder="Aggiungi tipologia"
            values={formData.tippiologie}
            onAdd={(v) => setFormData(prev => ({ ...prev, tippiologie: [...prev.tippiologie, v] }))}
            onRemove={(v) => setFormData(prev => ({
              ...prev,
              tippiologie: prev.tippiologie.filter(t => t !== v && !TIPOLOGIA_SECONDARY[v]?.includes(t))
            }))}
            primarySuggestions={TIPOLOGIA_PRIMARY}
            secondarySuggestions={TIPOLOGIA_SECONDARY}
          />
          <NameField
            icon={<img src={UserFormIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
            tippiologie={formData.tippiologie}
            cognomeDenominazione={formData.cognomeDenominazione}
            nome={formData.nome}
            sesso={formData.sesso}
            codiceFiscale={formData.codiceFiscale}
            onChangeCognomeDenominazione={(v) => handleChange('cognomeDenominazione', v)}
            onChangeNome={(v) => handleChange('nome', v)}
            onChangeSesso={(v) => handleChange('sesso', v)}
            onChangeCodiceFiscale={(v) => handleChange('codiceFiscale', v)}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * FormField - same structure as LabelField for consistent width
 * Layout: Icon | 24px | Content.padding(right: 12px).flex-1
 *                        └── Inner.padding(right: 34px)
 *                              └── Input with underline
 * Total right padding: 12px + 34px = 46px
 */
function FormField({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="flex items-start"
      style={{ gap: Insets.l }}
    >
      {/* Icon with vertical offset like Flokk */}
      <div
        style={{
          color: Colors.grey,
          transform: `translateY(${Sizes.formIconOffset}px)`,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      {/* Content wrapper: .padding(right: 12px).flexible() */}
      <div
        className="flex-1"
        style={{ paddingRight: Insets.m, minWidth: 0 }}
      >
        {/* Inner content: .padding(right: 34px) */}
        <div style={{ paddingRight: Insets.l * 1.5 - 2 }}>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
        </div>
      </div>
    </div>
  );
}

/**
 * StyledDropdown - faithful to Flokk's StyledAutoCompleteDropdown
 * Custom dropdown with input-like appearance and overlay
 */
function StyledDropdown({
  value,
  onChange,
  options,
  placeholder,
  width = 60,
  onFocus,
  onBlur,
  isFocused: externalFocused,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  width?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
}) {
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

  // Flokk styling:
  // - Input: contentPadding right: 22, bottom: Insets.sm (6px)
  // - TextStyles.Body2 (12px Lato)
  // - Arrow: right: 4, top: 4, size 12px
  // - Dropdown: rowHeight 40, top: 26, surface bg, shadow

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
          ...TextStyles.body2,
          color: value ? Colors.greyStrong : Colors.greyWeak,
          paddingTop: 4,
          paddingBottom: Insets.sm,
          paddingRight: 22, // Space for arrow
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

      {/* Arrow icon - positioned like Flokk: right: 4, top: 4, size 12 */}
      <div
        onClick={handleToggle}
        style={{
          position: 'absolute',
          right: 4,
          top: 4,
          width: 12,
          height: 12,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(${isOpen ? 0 : 180}deg)`,
          transition: `transform ${Animations.button.duration} ${Animations.button.easing}`,
        }}
      >
        {/* Dropdown arrow - chevron pointing up when open, down when closed */}
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

      {/* Dropdown overlay - Flokk: rowHeight 40, surface bg, shadow
          Position below the underline: paddingTop(4) + lineHeight(~18) + paddingBottom(6) + border(2) = 30 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: 30,
            left: 0,
            minWidth: '100%',
            backgroundColor: Colors.surface,
            boxShadow: `0 4px 12px -2px ${Colors.accent1}40`,
            zIndex: 1000,
            overflow: 'hidden',
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
                height: 40, // Flokk rowHeight
                paddingLeft: Insets.m,
                paddingRight: Insets.m,
                ...TextStyles.caption,
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

/**
 * NameField - like Flokk's NameMiniForm, expands to show name fields
 * Shows "Aggiungi contribuente" when closed, expands to show fields based on tipologia
 */
function NameField({
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
}: {
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Use ref to track hasContent for timeout callbacks (avoids stale closure)
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

  // Handle focus on a field
  const handleFieldFocus = (field: string) => {
    // Cancel any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setFocusedField(field);
  };

  // Handle blur - close if no content and focus leaves the container
  const handleFieldBlur = () => {
    setFocusedField(null);
    // Use timeout to check if focus moved to another field within container
    // 750ms matches Flokk's expanding_miniform_container.dart
    closeTimeoutRef.current = setTimeout(() => {
      // Use ref to get current hasContent value (not stale closure)
      if (!hasContentRef.current) {
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
      {/* Icon with vertical offset like Flokk */}
      <div
        style={{
          color: Colors.grey,
          transform: `translateY(${Sizes.formIconOffset}px)`,
          flexShrink: 0,
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
            // Closed state - show prompt or summary
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
            // Open state - show all fields
            <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.sm * 0.5 }}>
              {/* Cognome / Denominazione field */}
              <input
                type="text"
                placeholder={getCognomeDenominazioneLabel()}
                value={cognomeDenominazione}
                onChange={(e) => onChangeCognomeDenominazione(e.target.value)}
                onFocus={() => handleFieldFocus('cognome')}
                onBlur={handleFieldBlur}
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
              {/* Nome + Sesso row - only if persona fisica or no selection */}
              {/* Layout from Flokk buildTextWithDropdown: Row [ input.flexible(), HSpace(12), dropdown.translate(0,3) ] */}
              {showNomeField && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: Insets.m }}>
                  {/* Nome input - flex-1 */}
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => onChangeNome(e.target.value)}
                    onFocus={() => handleFieldFocus('nome')}
                    onBlur={handleFieldBlur}
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
                  {/* Sesso dropdown - fixed width, translateY(3) per Flokk */}
                  <div style={{ transform: 'translateY(3px)' }}>
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

/**
 * LabelField - like Flokk's LabelMiniForm with suggestions dropdown
 * Shows chips inline with placeholder, supports multiple selections
 */
function LabelField({
  icon,
  placeholder,
  values,
  onAdd,
  onRemove,
  primarySuggestions,
  secondarySuggestions,
}: {
  icon: React.ReactNode;
  placeholder: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  primarySuggestions: string[];
  secondarySuggestions: Record<string, string[]>;
}) {
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
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
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

  // Auto-scroll to end when chips change (show "Aggiungi tipologia")
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
    // Don't close - keep open for secondary selections
  };

  // Determine which primary is selected (if any)
  const selectedPrimary = values.find(v => primarySuggestions.includes(v));

  // Get available suggestions
  const getAvailableSuggestions = () => {
    if (!selectedPrimary) {
      // Show primary suggestions, exclude already selected
      return primarySuggestions.filter(s => !values.includes(s));
    } else {
      // Show secondary suggestions for the selected primary, exclude already selected
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

  // Flokk LabelMiniForm structure (NO delete button, wider than regular fields):
  // Row [
  //   Icon.translate(0, 8),
  //   HSpace(Insets.l),                    // 24px
  //   Content.padding(right: 12px).flex-1  // from expanding_miniform_container
  //     └── Inner.padding(right: 34px)     // from label_miniform
  //           └── Stack [scrollable, underline]
  //           └── Suggestions (if open)
  // ]

  return (
    <div
      className="flex items-start"
      style={{ gap: Insets.l }}
    >
      {/* Icon with vertical offset like Flokk */}
      <div
        style={{
          color: Colors.grey,
          transform: `translateY(${Sizes.formIconOffset}px)`,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      {/* Content wrapper: .padding(right: 12px).flexible() from expanding_miniform_container */}
      <div
        className="flex-1"
        style={{ paddingRight: Insets.m, minWidth: 0 }}
      >
        {/* Inner content: .padding(right: 34px) from label_miniform */}
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

// =============================================================================
// Icons - 24x24px (Sizes.formIconSize)
// =============================================================================

const iconSize = Sizes.formIconSize;

const UserIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IdCardIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const EmailIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const HashIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const GlobeIcon = () => (
  <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
