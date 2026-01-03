import { useState, useEffect } from 'react';
import { Colors, Sizes, Shadows, Animations } from '../theme';

interface ContribuenteFormPanelProps {
  isOpen: boolean;
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

export function ContribuenteFormPanel({ isOpen, onClose, onSave, onDelete }: ContribuenteFormPanelProps) {
  const [formData, setFormData] = useState<ContribuenteFormData>(initialFormData);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${isAnimating ? 0.3 : 0})`,
          transition: `background-color ${Animations.panel.duration} ${Animations.panel.easing}`,
        }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full flex flex-col z-50"
        style={{
          width: Sizes.panelWidth,
          backgroundColor: Colors.surface,
          borderTopLeftRadius: Sizes.radiusMd,
          borderBottomLeftRadius: Sizes.radiusMd,
          boxShadow: Shadows.panel,
          transform: `translateX(${isAnimating ? 0 : Sizes.panelWidth}px)`,
          transition: `transform ${Animations.panel.duration} ${Animations.panel.easing}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button
            onClick={onDelete || handleClose}
            className="font-medium text-sm transition-colors"
            style={{ color: Colors.grey }}
            onMouseEnter={(e) => e.currentTarget.style.color = Colors.error}
            onMouseLeave={(e) => e.currentTarget.style.color = Colors.grey}
          >
            ELIMINA
          </button>
          <button
            onClick={handleSave}
            className="font-medium text-sm transition-colors"
            style={{ color: Colors.accent1 }}
            onMouseEnter={(e) => e.currentTarget.style.color = Colors.accent1Dark}
            onMouseLeave={(e) => e.currentTarget.style.color = Colors.accent1}
          >
            SALVA
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-1">
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              placeholder="Cognome"
              value={formData.cognome}
              onChange={(v) => handleChange('cognome', v)}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              placeholder="Nome"
              value={formData.nome}
              onChange={(v) => handleChange('nome', v)}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              }
              placeholder="Codice Fiscale"
              value={formData.codiceFiscale}
              onChange={(v) => handleChange('codiceFiscale', v.toUpperCase())}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              placeholder="Email"
              value={formData.email}
              onChange={(v) => handleChange('email', v)}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
              placeholder="Telefono"
              value={formData.telefono}
              onChange={(v) => handleChange('telefono', v)}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              placeholder="Indirizzo"
              value={formData.indirizzo}
              onChange={(v) => handleChange('indirizzo', v)}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              placeholder="Comune"
              value={formData.comune}
              onChange={(v) => handleChange('comune', v)}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              }
              placeholder="CAP"
              value={formData.cap}
              onChange={(v) => handleChange('cap', v)}
            />
            <FormField
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              placeholder="Provincia"
              value={formData.provincia}
              onChange={(v) => handleChange('provincia', v.toUpperCase())}
            />
          </div>
        </div>
      </div>
    </>
  );
}

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
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-200">
      <div style={{ color: Colors.greyWeak }}>
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none placeholder-gray-400"
        style={{ color: Colors.grey }}
      />
    </div>
  );
}
