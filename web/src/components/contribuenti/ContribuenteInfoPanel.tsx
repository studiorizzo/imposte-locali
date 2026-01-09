import { useState, useRef, useCallback, useEffect } from 'react';
import { Colors, Shadows } from '../../theme';
import { Sizes, Insets, TextStyles, Durations } from '../../styles';
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
import CancelIcon from '../../assets/Cancel_form.svg';
import starFilledIcon from '../../assets/Star_fill.svg';
import starEmptyIcon from '../../assets/Star.svg';

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

type TabType = 'dettagli' | 'immobili';

// Edit icon SVG inline (from Flokk StyledIcons.edit)
function EditIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// ColorShiftIconBtn - icon button with hover color shift (from Flokk)
function ColorShiftIconBtn({
  icon,
  size: _size = 16,
  color: _color,
  onPressed,
}: {
  icon: React.ReactNode;
  size?: number;
  color: string;
  onPressed?: () => void;
}) {
  void _size;
  void _color;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onPressed}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        padding: Insets.sm,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isHovered ? 0.7 : 1,
        transition: 'opacity 150ms ease-out',
      }}
    >
      {icon}
    </button>
  );
}

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

// Tab bar component (from Flokk StyledTabBar)
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
    // Flokk: .padding(top: Insets.m * 1.5, bottom: 50)
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      paddingTop: Insets.m * 1.5,
      paddingBottom: 50,
    }}>
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

// Header card component (from Flokk contact_info_header_card.dart)
function ContribuenteInfoHeaderCard({
  contribuente,
  onStarToggle,
}: {
  contribuente: ContribuenteFullData;
  onStarToggle?: () => void;
}) {
  const fullName = contribuente.nome
    ? `${contribuente.cognomeDenominazione} ${contribuente.nome}`
    : contribuente.cognomeDenominazione;

  // Flokk: SeparatedColumn with separatorBuilder: () => SizedBox(height: Insets.m * .5)
  const separatorHeight = Insets.m * 0.5;

  return (
    // Flokk: .translate(offset: Offset(0, -Insets.m))
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${-Insets.m}px)`,
      }}
    >
      {/* VSpace(Insets.sm - 1) */}
      <div style={{ height: Insets.sm - 1 }} />

      {/* Avatar - size: 110 */}
      <ContribuenteAvatar
        cognomeDenominazione={contribuente.cognomeDenominazione}
        nome={contribuente.nome}
        size="xl"
        id={contribuente.id}
      />

      {/* Separator */}
      <div style={{ height: separatorHeight }} />

      {/* Name + Star Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Insets.sm * 0.5,
        }}
      >
        {/* OneLineText with H1 style */}
        <span
          style={{
            ...TextStyles.h1,
            color: Colors.txt,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {fullName}
        </span>
        {onStarToggle && (
          <ColorShiftIconBtn
            icon={
              <img
                src={contribuente.isStarred ? starFilledIcon : starEmptyIcon}
                alt=""
                style={{
                  width: 20,
                  height: 20,
                  filter: contribuente.isStarred
                    ? 'none'
                    : 'grayscale(100%)',
                }}
              />
            }
            color={contribuente.isStarred ? Colors.accent1 : Colors.grey}
            onPressed={onStarToggle}
          />
        )}
      </div>

      {/* Separator */}
      <div style={{ height: separatorHeight }} />

      {/* Labels/Tipologie (Wrap) */}
      {contribuente.tippiologie && contribuente.tippiologie.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: Insets.sm * 0.5,
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
                textTransform: 'uppercase',
              }}
            >
              {tip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Main component (from Flokk contact_info_panel.dart + contact_panel.dart)
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

  // Fade animation state (from Flokk)
  const [contentOpacity, setContentOpacity] = useState(0);
  const prevContactIdRef = useRef<string | null>(null);

  // Fade in when contact changes (from Flokk startFadeIfContactsHaveChanged)
  useEffect(() => {
    if (contribuente.id !== prevContactIdRef.current) {
      setContentOpacity(0);
      // Use microtask to trigger animation
      queueMicrotask(() => setContentOpacity(1));
      prevContactIdRef.current = contribuente.id;
    }
  }, [contribuente.id]);

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

  return (
    // Container with shadow (from Flokk contact_panel.dart StyledContainer)
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: Colors.surface,
        borderTopLeftRadius: Sizes.radiusMd,
        borderBottomLeftRadius: Sizes.radiusMd,
        boxShadow: Shadows.panel, // FIX #1: Added shadow
        paddingTop: Insets.l * 0.75, // FIX: padding from contact_panel.dart
      }}
    >
      {/* Top Icon Row (from Flokk contact_info_panel.dart lines 57-63) */}
      {/* FIX #2: Icons instead of text */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: Insets.l,
          paddingRight: Insets.l,
        }}
      >
        <ColorShiftIconBtn
          icon={<img src={CancelIcon} alt="Chiudi" style={{ width: 16, height: 16 }} />}
          size={16}
          color={Colors.grey}
          onPressed={onClose}
        />
        <ColorShiftIconBtn
          icon={<EditIcon size={22} color={Colors.accent1Dark} />}
          size={22}
          color={Colors.accent1Dark}
          onPressed={onEdit}
        />
      </div>

      {/* Content with fade animation (from Flokk lines 67-91) */}
      {/* FIX #3: Fade animation */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          position: 'relative',
          opacity: contentOpacity,
          transition: contentOpacity === 0 ? 'none' : `opacity ${Durations.medium}ms ease-out`,
        }}
      >
        <div
          ref={handleRef}
          onScroll={handleScroll}
          className="styled-listview-scroll"
          style={{
            flex: 1,
            overflowY: 'scroll',
            paddingLeft: Insets.l,
            paddingRight: Insets.l + 12 + Insets.sm,
          }}
        >
          {/* VSpace(2) */}
          <div style={{ height: 2 }} />

          {/* Header Card (FIX #4, #5, #6: translate offset, H1 style, separators) */}
          <ContribuenteInfoHeaderCard
            contribuente={contribuente}
            onStarToggle={onStarToggle}
          />

          {/* VSpace(Insets.l) */}
          <div style={{ height: Insets.l }} />

          {/* Tab bar */}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab content (FIX #7: correct padding in details) */}
          {activeTab === 'dettagli' ? (
            <DetailsTabContent contribuente={contribuente} />
          ) : (
            <ImmobiliTabContent contribuente={contribuente} />
          )}
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
