import { useState } from 'react';
import { Colors } from '../../theme';
import { Insets, TextStyles, AvatarSizes } from '../../styles';
import { ContribuenteAvatar } from '../ContribuenteAvatar';
import starFilledIcon from '../../assets/Star_fill.svg';
import starEmptyIcon from '../../assets/Star.svg';

// Contribuente data for the list view
export interface ContribuenteListData {
  id: string;
  cognomeDenominazione: string;
  nome: string;
  status?: string;
  telefono?: string;
  email?: string;
  isStarred?: boolean;
}

interface ContribuentiListRowProps {
  contribuente: ContribuenteListData | null; // null = header mode
  parentWidth?: number;
  isSelected?: boolean;
  isChecked?: boolean;
  showDividers?: boolean;
  onSelect?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  onStarToggle?: () => void;
}

// Styled checkbox component
function StyledCheckbox({
  checked,
  size = 18
}: {
  checked: boolean;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 3,
        border: `1.5px solid ${checked ? Colors.accent1Darker : Colors.grey}`,
        backgroundColor: checked ? Colors.accent1Darker : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 150ms ease-out',
      }}
    >
      {checked && (
        <svg width={size - 6} height={size - 6} viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

// Fading flex content for responsive columns
function FadingFlexContent({
  children,
  flex,
  isVisible,
}: {
  children: React.ReactNode;
  flex: number;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  const targetFlex = 1 + flex * 100;

  return (
    <div
      style={{
        flex: targetFlex,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'opacity 200ms ease-out, flex 200ms ease-out',
      }}
    >
      {children}
    </div>
  );
}

// One line text with ellipsis
function OneLineText({
  children,
  style
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function ContribuentiListRow({
  contribuente,
  parentWidth,
  isSelected = false,
  isChecked = false,
  showDividers = true,
  onSelect,
  onCheckedChange,
  onStarToggle,
}: ContribuentiListRowProps) {
  const [isHovering, setIsHovering] = useState(false);

  const headerMode = contribuente === null;
  const width = parentWidth || window.innerWidth;

  // Responsive column count based on width
  let colCount = 1;
  if (width > 450) colCount = 2;  // Status
  if (width > 600) colCount = 3;  // Telefono
  if (width > 1000) colCount = 4; // Email

  // Background color
  let bgColor = headerMode ? 'transparent' : Colors.surface;
  if (isSelected) {
    bgColor = `${Colors.greyWeak}59`; // 0.35 opacity
  }

  // Text styles - Flokk: headerMode = H2 + grey, dataMode = Body1.size(15)
  const textStyle: React.CSSProperties = headerMode
    ? { ...TextStyles.h2, color: Colors.grey }
    : { ...TextStyles.body1, fontSize: '15px', color: Colors.txt };

  const showCheckbox = isHovering || isChecked;

  const handleRowClick = () => {
    if (!headerMode && onSelect) {
      onSelect();
    }
  };

  const handleCheckboxAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!headerMode && onCheckedChange) {
      onCheckedChange(!isChecked);
    }
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!headerMode && onStarToggle) {
      onStarToggle();
    }
  };

  // Full name display
  const fullName = contribuente
    ? contribuente.nome
      ? `${contribuente.cognomeDenominazione} ${contribuente.nome}`
      : contribuente.cognomeDenominazione
    : '';

  return (
    <div
      onClick={handleRowClick}
      style={{
        height: headerMode ? 48 : 78,
        backgroundColor: bgColor,
        cursor: headerMode ? 'default' : 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        // Flokk: content centered in both header and data rows
        justifyContent: 'center',
      }}
    >
      {/* Top divider for data rows */}
      {!headerMode && showDividers && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: Colors.bg1,
          }}
        />
      )}

      {/* Header bottom divider - Flokk: Align(bottomLeft), 1px, grey 60% */}
      {headerMode && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: `${Colors.grey}99`, // grey #515d5a at 60% opacity
          }}
        />
      )}

      {/* Row content - Flokk: padding(left: headerMode ? 0 : Insets.m, right: Insets.m * 1.5, vertical: Insets.sm) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: headerMode ? 0 : Insets.m,
          paddingRight: Insets.m * 1.5,
          paddingTop: Insets.sm,
          paddingBottom: Insets.sm,
        }}
      >
        {/* Name column with Avatar/Checkbox */}
        <div
          style={{
            flex: 2000,
            minWidth: 300,  // Flokk: .constrained(minWidth: 300)
            display: 'flex',
            alignItems: 'center',
            gap: Insets.m,
          }}
        >
          {headerMode ? (
            <OneLineText style={textStyle}>Nome</OneLineText>
          ) : (
            <>
              {/* Avatar/Checkbox area */}
              <div
                onClick={handleCheckboxAreaClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                  width: AvatarSizes.md,
                  height: AvatarSizes.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {showCheckbox ? (
                  <StyledCheckbox checked={isChecked} size={18} />
                ) : (
                  <ContribuenteAvatar
                    cognomeDenominazione={contribuente.cognomeDenominazione}
                    nome={contribuente.nome}
                    size="md"
                    id={contribuente.id}
                  />
                )}
              </div>

              {/* Name text */}
              <OneLineText style={{ ...textStyle, flex: 1 }}>
                {fullName}
              </OneLineText>
            </>
          )}
        </div>

        {/* Status column */}
        <FadingFlexContent flex={10} isVisible={colCount > 1}>
          <OneLineText style={textStyle}>
            {headerMode ? 'Status' : contribuente?.status || '—'}
          </OneLineText>
        </FadingFlexContent>

        {/* Telefono column */}
        <FadingFlexContent flex={11} isVisible={colCount > 2}>
          <OneLineText style={textStyle}>
            {headerMode ? 'Telefono' : contribuente?.telefono || '—'}
          </OneLineText>
        </FadingFlexContent>

        {/* Email column */}
        <FadingFlexContent flex={16} isVisible={colCount > 3}>
          <OneLineText style={textStyle}>
            {headerMode ? 'Email' : contribuente?.email || '—'}
          </OneLineText>
        </FadingFlexContent>

        {/* Star toggle */}
        {!headerMode && (
          <button
            onClick={handleStarClick}
            style={{
              background: 'none',
              border: 'none',
              padding: Insets.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={contribuente?.isStarred ? starFilledIcon : starEmptyIcon}
              alt={contribuente?.isStarred ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
}
