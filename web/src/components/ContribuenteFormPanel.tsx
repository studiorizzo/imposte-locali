import { useState } from 'react';
import { Colors, Sizes, Insets, TextStyles } from '../theme';

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
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          paddingTop: Insets.l * 0.75 + Insets.sm,
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
            borderRadius: 5,
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
            borderRadius: 5,
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

      {/* Form */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: Insets.sm,
          paddingLeft: Insets.l,
          paddingRight: Insets.l,
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
    </div>
  );
}
