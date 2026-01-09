import { useState, useRef, useCallback } from 'react';
import { Colors } from '../../theme';
import { Sizes, Insets, TextStyles } from '../../styles';
import { ContribuenteAvatar } from '../ContribuenteAvatar';
import { StyledScrollbar } from '../scrolling';
import type { ContribuenteListData } from './ContribuentiListRow';

// Icons - same as ContribuenteFormPanel
import UserFormIcon from '../../assets/User_2_form.svg';
import DateFormIcon from '../../assets/Date_form.svg';
import AddressFormIcon from '../../assets/Adress_form.svg';
import MailFormIcon from '../../assets/Mail_form.svg';
import PhoneFormIcon from '../../assets/Phone_form.svg';
import NoteFormIcon from '../../assets/note_form.svg';
import LinkFormIcon from '../../assets/link_form.svg';
import starFilledIcon from '../../assets/Star_fill.svg';
import starEmptyIcon from '../../assets/Star.svg';
import CancelIcon from '../../assets/Cancel_form.svg';
import EditIcon from '../../assets/switch_to_input.svg';

// Extended data for full contribuente info (matches ContribuenteFormData)
export interface ContribuenteFullData extends ContribuenteListData {
  tippiologie?: string[];
  sesso?: string;
  dataNascita?: string;
  comuneNascita?: string;
  provinciaNascita?: string;
  codiceFiscale?: string;
  emails?: string[];
  telefoni?: string[];
  indirizzo?: string;
  civico?: string;
  comune?: string;
  cap?: string;
  provincia?: string;
  note?: string;
  relazioni?: string;
  // Immobili associated with this contribuente
  immobili?: Array<{
    id: string;
    tipo: string;
    indirizzo: string;
    comune: string;
  }>;
}

interface ContribuenteInfoPanelProps {
  contribuente: ContribuenteFullData;
  onClose: () => void;
  onEdit: () => void;
  onStarToggle?: () => void;
}

// Tab type
type TabType = 'dettagli' | 'immobili';

// Info row component - displays a single field with icon
function InfoRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: string;
  label: string;
  value: string | string[] | undefined;
  onClick?: () => void;
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  const values = Array.isArray(value) ? value : [value];

  return (
    <div
      style={{
        display: 'flex',
        gap: Insets.m,
        paddingTop: Insets.m,
        paddingBottom: Insets.m,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <img
        src={icon}
        width={Sizes.formIconSize}
        height={Sizes.formIconSize}
        alt=""
        style={{ opacity: 0.7 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: Insets.xs }}>
        <span style={{ ...TextStyles.caption, color: Colors.grey }}>{label}</span>
        {values.map((v, i) => (
          <span
            key={i}
            style={{
              ...TextStyles.body1,
              color: onClick ? Colors.accent1 : Colors.txt,
            }}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

// Tab bar component
function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'dettagli', label: 'DETTAGLI' },
    { key: 'immobili', label: 'IMMOBILI' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        borderBottom: `1px solid ${Colors.greyWeak}40`,
        marginBottom: Insets.m,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            ...TextStyles.t1,
            flex: 1,
            padding: `${Insets.m}px ${Insets.l}px`,
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === tab.key ? Colors.accent1 : Colors.grey,
            borderBottom: `2px solid ${activeTab === tab.key ? Colors.accent1 : 'transparent'}`,
            cursor: 'pointer',
            transition: 'all 200ms ease-out',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Details tab content - same fields as ContribuenteFormPanel but read-only
function DetailsTabContent({ contribuente }: { contribuente: ContribuenteFullData }) {
  const fullAddress = [
    contribuente.indirizzo,
    contribuente.civico,
    contribuente.comune,
    contribuente.cap,
    contribuente.provincia,
  ]
    .filter(Boolean)
    .join(', ');

  const birthInfo = [
    contribuente.dataNascita,
    contribuente.comuneNascita,
    contribuente.provinciaNascita,
  ]
    .filter(Boolean)
    .join(' - ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <InfoRow
        icon={UserFormIcon}
        label="Codice Fiscale"
        value={contribuente.codiceFiscale}
      />
      <InfoRow
        icon={DateFormIcon}
        label="Data e Luogo di Nascita"
        value={birthInfo || undefined}
      />
      <InfoRow
        icon={MailFormIcon}
        label="Email"
        value={contribuente.emails || (contribuente.email ? [contribuente.email] : undefined)}
        onClick={
          contribuente.emails?.[0] || contribuente.email
            ? () => window.open(`mailto:${contribuente.emails?.[0] || contribuente.email}`)
            : undefined
        }
      />
      <InfoRow
        icon={PhoneFormIcon}
        label="Telefono"
        value={contribuente.telefoni || (contribuente.telefono ? [contribuente.telefono] : undefined)}
        onClick={
          contribuente.telefoni?.[0] || contribuente.telefono
            ? () => window.open(`tel:${contribuente.telefoni?.[0] || contribuente.telefono}`)
            : undefined
        }
      />
      <InfoRow
        icon={AddressFormIcon}
        label="Indirizzo"
        value={fullAddress || undefined}
        onClick={
          fullAddress
            ? () => window.open(`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`)
            : undefined
        }
      />
      <InfoRow icon={NoteFormIcon} label="Note" value={contribuente.note} />
      <InfoRow icon={LinkFormIcon} label="Relazioni" value={contribuente.relazioni} />
    </div>
  );
}

// Immobili tab content
function ImmobiliTabContent({ contribuente }: { contribuente: ContribuenteFullData }) {
  const immobili = contribuente.immobili || [];

  if (immobili.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Insets.xl,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: Insets.l }}>🏠</div>
        <span style={{ ...TextStyles.t1, color: Colors.grey }}>
          NESSUN IMMOBILE
        </span>
        <span
          style={{
            ...TextStyles.body1,
            color: Colors.grey,
            marginTop: Insets.sm,
            maxWidth: 300,
          }}
        >
          Non ci sono immobili associati a questo contribuente.
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.sm }}>
      {immobili.map((immobile) => (
        <div
          key={immobile.id}
          style={{
            padding: Insets.m,
            backgroundColor: Colors.bg1,
            borderRadius: Sizes.radiusSm,
          }}
        >
          <div style={{ ...TextStyles.t1, color: Colors.txt, marginBottom: Insets.xs }}>
            {immobile.tipo}
          </div>
          <div style={{ ...TextStyles.body2, color: Colors.grey }}>
            {immobile.indirizzo}, {immobile.comune}
          </div>
        </div>
      ))}
    </div>
  );
}

// Copied from ContribuenteFormPanel structure
export function ContribuenteInfoPanel({
  contribuente,
  onClose,
  onEdit,
  onStarToggle,
}: ContribuenteInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dettagli');
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

  // Full name
  const fullName = contribuente.nome
    ? `${contribuente.cognomeDenominazione} ${contribuente.nome}`
    : contribuente.cognomeDenominazione;

  return (
    // Same container as ContribuenteFormPanel
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: Colors.surface,
        borderTopLeftRadius: Sizes.radiusMd,
        borderBottomLeftRadius: Sizes.radiusMd,
      }}
    >
      {/* Header - icon buttons like Flokk contact_info_panel */}
      <div
        className="flex items-center justify-between"
        style={{
          paddingTop: Insets.l * 0.75,
          paddingBottom: Insets.m,
          paddingLeft: Insets.l,
          paddingRight: Insets.l,
        }}
      >
        {/* Close button - size 16, color grey, padding Insets.sm */}
        <button
          onClick={onClose}
          className="transition-opacity"
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
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <img src={CancelIcon} alt="Chiudi" width={16} height={16} style={{ display: 'block' }} />
        </button>
        {/* Edit button - size 22, color accent1Dark, padding Insets.sm */}
        <button
          onClick={onEdit}
          className="transition-opacity"
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
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <img src={EditIcon} alt="Modifica" width={22} height={22} style={{ display: 'block' }} />
        </button>
      </div>

      {/* Content - same structure as ContribuenteFormPanel but with custom scrollbar */}
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
            paddingRight: Insets.l + 12 + Insets.sm, // Space for scrollbar (barSize + Insets.sm)
            paddingBottom: Insets.m + 30,
          }}
        >
          {/* Header card: Avatar + Name + Star + Labels */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: Insets.m,
              paddingBottom: Insets.l,
            }}
          >
            {/* Avatar */}
            <ContribuenteAvatar
              cognomeDenominazione={contribuente.cognomeDenominazione}
              nome={contribuente.nome}
              size="xl"
              id={contribuente.id}
            />

            {/* Name + Star */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: Insets.sm,
                marginTop: Insets.m,
              }}
            >
              <h1
                style={{
                  ...TextStyles.t1,
                  fontSize: '18px',
                  color: Colors.txt,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {fullName}
              </h1>
              {onStarToggle && (
                <button
                  onClick={onStarToggle}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: Insets.xs,
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <img
                    src={contribuente.isStarred ? starFilledIcon : starEmptyIcon}
                    alt={contribuente.isStarred ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                    style={{ width: 20, height: 20 }}
                  />
                </button>
              )}
            </div>

            {/* Labels/Tipologie */}
            {contribuente.tippiologie && contribuente.tippiologie.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: Insets.xs,
                  marginTop: Insets.m,
                  justifyContent: 'center',
                }}
              >
                {contribuente.tippiologie.map((tip) => (
                  <span
                    key={tip}
                    style={{
                      ...TextStyles.caption,
                      color: Colors.accent1Dark,
                      backgroundColor: `${Colors.accent1}20`,
                      padding: `${Insets.xs}px ${Insets.sm}px`,
                      borderRadius: Sizes.radiusBtn,
                    }}
                  >
                    {tip}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tab bar */}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab content - same fields structure as ContribuenteFormPanel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: Insets.m }}>
            {activeTab === 'dettagli' ? (
              <DetailsTabContent contribuente={contribuente} />
            ) : (
              <ImmobiliTabContent contribuente={contribuente} />
            )}
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
