import { useState, useRef, useEffect } from 'react';
import { Colors, Sizes, Shadows, Insets, TextStyles, Animations } from '../theme';
import LabelIcon from '../assets/Label_form.svg';

interface ContribuenteFormPanelProps {
  onClose: () => void;
  onSave: (data: ContribuenteFormData) => void;
  onDelete?: () => void;
}

export interface ContribuenteFormData {
  tippiologie: string[];
  cognome: string;
  nome: string;
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
  cognome: '',
  nome: '',
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
          <FormField
            icon={<UserIcon />}
            placeholder="Cognome"
            value={formData.cognome}
            onChange={(v) => handleChange('cognome', v)}
          />
          <FormField
            icon={<UserIcon />}
            placeholder="Nome"
            value={formData.nome}
            onChange={(v) => handleChange('nome', v)}
          />
          <FormField
            icon={<IdCardIcon />}
            placeholder="Codice Fiscale"
            value={formData.codiceFiscale}
            onChange={(v) => handleChange('codiceFiscale', v.toUpperCase())}
          />
          <FormField
            icon={<EmailIcon />}
            placeholder="Email"
            value={formData.email}
            onChange={(v) => handleChange('email', v)}
          />
          <FormField
            icon={<PhoneIcon />}
            placeholder="Telefono"
            value={formData.telefono}
            onChange={(v) => handleChange('telefono', v)}
          />
          <FormField
            icon={<LocationIcon />}
            placeholder="Indirizzo"
            value={formData.indirizzo}
            onChange={(v) => handleChange('indirizzo', v)}
          />
          <FormField
            icon={<BuildingIcon />}
            placeholder="Comune"
            value={formData.comune}
            onChange={(v) => handleChange('comune', v)}
          />
          <FormField
            icon={<HashIcon />}
            placeholder="CAP"
            value={formData.cap}
            onChange={(v) => handleChange('cap', v)}
          />
          <FormField
            icon={<GlobeIcon />}
            placeholder="Provincia"
            value={formData.provincia}
            onChange={(v) => handleChange('provincia', v.toUpperCase())}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * FormField - styled like Flokk's ExpandingMiniformContainer + BaseMiniForm
 * Layout structure from Flokk:
 *   Row (crossAxisAlignment: start)
 *   ├── Icon (20px, offset 8px)
 *   ├── HSpace(Insets.l) = 24px
 *   └── Content.flexible().padding(right: Insets.m)  ← outer padding 12px
 *       └── Row
 *           ├── Input.flexible().padding(right: Insets.l * 1.5 - 2)  ← inner padding 34px
 *           ├── HSpace(Insets.m) = 12px
 *           └── DeleteButton (32px: 20px icon + 6px padding each side)
 * Total right space: 12px outer + 34px inner + 12px gap + 32px delete = 90px
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
      {/* Content wrapper with outer padding (Insets.m = 12px) */}
      <div
        className="flex-1"
        style={{ paddingRight: Insets.m }}
      >
        {/* Row containing input and delete button space */}
        <div className="flex items-start" style={{ gap: Insets.m }}>
          {/* Input container with inner padding (Insets.l * 1.5 - 2 = 34px) */}
          <div className="flex-1" style={{ paddingRight: Insets.l * 1.5 - 2 }}>
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
                paddingBottom: 8,
                borderBottom: `2px solid ${isFocused ? Colors.accent1 : Colors.greyWeak}`,
                transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                caretColor: Colors.accent1,
              }}
            />
          </div>
          {/* Delete button placeholder (invisible but reserves space like Flokk) */}
          <div
            style={{
              width: 32, // 20px icon + 6px padding each side
              height: 32,
              flexShrink: 0,
              opacity: 0,
            }}
          />
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
      {/* Content wrapper with outer padding (Insets.m = 12px) */}
      <div
        className="flex-1"
        style={{ paddingRight: Insets.m }}
      >
        {/* Row containing input and delete button space */}
        <div className="flex items-start" style={{ gap: Insets.m }}>
          {/* Input container with inner padding */}
          <div className="flex-1" style={{ paddingRight: Insets.l * 1.5 - 2 }}>
            {/* Container with fixed underline - width stays constant */}
            <div
              style={{
                borderBottom: `2px solid ${isFocused ? Colors.accent1 : Colors.greyWeak}`,
                transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
                display: 'flex',
                alignItems: 'center',
                gap: Insets.sm,
                overflow: 'hidden', // Keep fixed width
              }}
            >
              {/* Scrollable chips area - only this part scrolls */}
              {values.length > 0 && (
                <div
                  ref={scrollContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: Insets.sm,
                    paddingBottom: 8,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    flexShrink: 1,
                    minWidth: 0, // Allow shrinking below content size
                  }}
                  className="hide-scrollbar"
                >
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
                </div>
              )}
              {/* Placeholder input - always visible, doesn't scroll */}
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
                  paddingBottom: 8,
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
          {/* Delete button placeholder (invisible but reserves space like Flokk) */}
          <div
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              opacity: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Icons - 20x20px (Sizes.formIconSize)
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
