import { useState, useRef, useCallback } from 'react';
import { Colors } from '../theme';
import { Sizes, Insets, TextStyles } from '../styles';
import { StyledScrollbar } from './scrolling';

// Form components
import {
  LabelMiniform,
  NameMiniform,
  DateLocationMiniform,
  AddressMiniform,
  MultiValueTextField,
  ExpandableTextField,
  TIPOLOGIA_PRIMARY,
  TIPOLOGIA_SECONDARY,
} from './form';

// Icons
import LabelIcon from '../assets/Label_form.svg';
import UserFormIcon from '../assets/User_2_form.svg';
import DateFormIcon from '../assets/Date_form.svg';
import AddressFormIcon from '../assets/Adress_form.svg';
import MailFormIcon from '../assets/Mail_form.svg';
import PhoneFormIcon from '../assets/Phone_form.svg';
import NoteFormIcon from '../assets/note_form.svg';
import LinkFormIcon from '../assets/link_form.svg';
import CancelIcon from '../assets/Cancel_form.svg';
import SaveIcon from '../assets/Save_fill.svg';

interface ContribuenteFormPanelProps {
  onClose: () => void;
  onSave: (data: ContribuenteFormData) => void;
  onDelete?: () => void;
}

export interface ContribuenteFormData {
  tippiologie: string[];
  cognomeDenominazione: string;
  nome: string;
  sesso: string;
  dataNascita: string;
  comuneNascita: string;
  provinciaNascita: string;
  codiceFiscale: string;
  emails: string[];
  telefoni: string[];
  indirizzo: string;
  civico: string;
  comune: string;
  cap: string;
  provincia: string;
  note: string;
  relazioni: string;
}

const initialFormData: ContribuenteFormData = {
  tippiologie: [],
  cognomeDenominazione: '',
  nome: '',
  sesso: '',
  dataNascita: '',
  comuneNascita: '',
  provinciaNascita: '',
  codiceFiscale: '',
  emails: [],
  telefoni: [],
  indirizzo: '',
  civico: '',
  comune: '',
  cap: '',
  provincia: '',
  note: '',
  relazioni: '',
};

export function ContribuenteFormPanel({ onClose, onSave, onDelete }: ContribuenteFormPanelProps) {
  const [formData, setFormData] = useState<ContribuenteFormData>(initialFormData);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  // Handle scroll events for custom scrollbar
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop);
      setScrollHeight(scrollRef.current.scrollHeight);
      setClientHeight(scrollRef.current.clientHeight);
    }
  }, []);

  // Handle scrollbar drag
  const handleScrollbarScroll = useCallback((newScrollTop: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = newScrollTop;
    }
  }, []);

  // Callback ref to measure on mount
  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      (scrollRef as React.MutableRefObject<HTMLDivElement>).current = node;
      setScrollHeight(node.scrollHeight);
      setClientHeight(node.clientHeight);

      const resizeObserver = new ResizeObserver(() => {
        setScrollHeight(node.scrollHeight);
        setClientHeight(node.clientHeight);
      });
      resizeObserver.observe(node);
    }
  }, []);

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
      }}
    >
      {/* Header - icon buttons like ContribuenteInfoPanel */}
      <div
        className="flex items-center justify-between"
        style={{
          paddingTop: Insets.l * 0.75,
          paddingBottom: Insets.m,
          paddingLeft: Insets.l,
          paddingRight: Insets.l,
        }}
      >
        {/* Delete/Close button - iconSizeMd, padding Insets.sm */}
        <button
          onClick={onDelete || handleClose}
          className="transition-all"
          style={{
            background: 'none',
            border: 'none',
            padding: Insets.sm,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${-Insets.sm}px)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
          }}
        >
          <img src={CancelIcon} alt="Elimina" width={Sizes.iconSizeMd} height={Sizes.iconSizeMd} style={{ display: 'block' }} />
        </button>
        {/* Save button - iconSizeMd, padding Insets.sm */}
        <button
          onClick={handleSave}
          className="transition-all"
          style={{
            background: 'none',
            border: 'none',
            padding: Insets.sm,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${Insets.sm}px)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
          }}
        >
          <img src={SaveIcon} alt="Salva" width={Sizes.iconSizeMd} height={Sizes.iconSizeMd} style={{ display: 'block' }} />
        </button>
      </div>

      {/* Form - with custom scrollbar */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          position: 'relative',
        }}
      >
        <div
          ref={handleRef}
          onScroll={handleScroll}
          className="styled-listview-scroll"
          style={{
            flex: 1,
            overflowY: 'scroll',
            paddingTop: Insets.sm,
            paddingLeft: Insets.l,
            paddingRight: Insets.l + 12 + Insets.sm,
            paddingBottom: Insets.m + 30,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.m }}>
            <LabelMiniform
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
            <NameMiniform
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
            <DateLocationMiniform
              icon={<img src={DateFormIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
              dataNascita={formData.dataNascita}
              comuneNascita={formData.comuneNascita}
              provinciaNascita={formData.provinciaNascita}
              onChangeDataNascita={(v) => handleChange('dataNascita', v)}
              onChangeComuneNascita={(v) => handleChange('comuneNascita', v)}
              onChangeProvinciaNascita={(v) => handleChange('provinciaNascita', v)}
            />
            <AddressMiniform
              icon={<img src={AddressFormIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
              indirizzo={formData.indirizzo}
              civico={formData.civico}
              comune={formData.comune}
              provincia={formData.provincia}
              onChangeIndirizzo={(v) => handleChange('indirizzo', v)}
              onChangeCivico={(v) => handleChange('civico', v)}
              onChangeComune={(v) => handleChange('comune', v)}
              onChangeProvincia={(v) => handleChange('provincia', v)}
            />
            <MultiValueTextField
              icon={<img src={MailFormIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
              placeholder="Aggiungi email"
              inputPlaceholder="Email"
              addButtonLabel="Aggiungi email"
              values={formData.emails}
              onChange={(emails) => setFormData(prev => ({ ...prev, emails }))}
            />
            <MultiValueTextField
              icon={<img src={PhoneFormIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
              placeholder="Aggiungi telefono"
              inputPlaceholder="Telefono"
              addButtonLabel="Aggiungi telefono"
              values={formData.telefoni}
              onChange={(telefoni) => setFormData(prev => ({ ...prev, telefoni }))}
            />
            <ExpandableTextField
              icon={<img src={NoteFormIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
              placeholder="Aggiungi note"
              inputPlaceholder="Note"
              value={formData.note}
              onChange={(v) => handleChange('note', v)}
            />
            <ExpandableTextField
              icon={<img src={LinkFormIcon} width={Sizes.formIconSize} height={Sizes.formIconSize} alt="" />}
              placeholder="Aggiungi relazioni"
              inputPlaceholder="Relazioni"
              value={formData.relazioni}
              onChange={(v) => handleChange('relazioni', v)}
            />
          </div>
        </div>

        {/* Custom scrollbar overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 12,
          }}
        >
          <StyledScrollbar
            size={12}
            axis="vertical"
            scrollTop={scrollTop}
            scrollHeight={scrollHeight}
            clientHeight={clientHeight}
            onScroll={handleScrollbarScroll}
            showTrack={true}
          />
        </div>
      </div>
    </div>
  );
}
