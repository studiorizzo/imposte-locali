import { useState } from 'react';
import { Colors, Sizes, Shadows, Insets, TextStyles, Animations } from '../theme';

interface ContribuenteFormPanelProps {
  onClose: () => void;
  onSave: (data: ContribuenteFormData) => void;
  onDelete?: () => void;
}

export interface ContribuenteFormData {
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
          - paddingHorizontal: Insets.l (24px)
          - paddingBottom: Insets.m (12px)
          - spacing between fields: Insets.m (12px) via SeparatedColumn
      */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: Insets.sm,
          paddingLeft: Insets.l,
          paddingRight: Insets.m,
          paddingBottom: Insets.m + 30, // Extra 30px for dropdown overflow like Flokk
        }}
      >
        {/* Form fields with Insets.m (12px) vertical spacing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.m }}>
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
 * - Icon size: 20px with 8px vertical offset
 * - Icon color: theme.grey
 * - Gap icon→input: Insets.l (24px)
 * - Text style: Body1 (Lato 14px)
 * - Right padding: Insets.l * 1.5 - 2 = 34px (underline ends before edge)
 * - Underline: greyWeak default, accent1 on focus
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
      {/* Input container with right padding (Insets.l * 1.5 - 2 = 34px)
          so underline ends before the edge like Flokk */}
      <div
        className="flex-1"
        style={{ paddingRight: Insets.l * 1.5 - 2 }}
      >
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
            borderBottom: `1px solid ${isFocused ? Colors.accent1 : Colors.greyWeak}`,
            transition: `border-color ${Animations.button.duration} ${Animations.button.easing}`,
            caretColor: Colors.accent1,
          }}
        />
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
