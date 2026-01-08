import { Colors } from '../../theme';
import { Insets, TextStyles, Animations } from '../../styles';
import trashIcon from '../../assets/Cancel_form.svg';

type CheckboxValue = 'none' | 'partial' | 'all';

interface BulkContribuenteEditBarProps {
  checkedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onDelete: () => void;
}

// Master checkbox with three states
function MasterCheckbox({
  value,
  onChange,
  size = 18
}: {
  value: CheckboxValue;
  onChange: () => void;
  size?: number;
}) {
  const isChecked = value === 'all';
  const isPartial = value === 'partial';

  return (
    <button
      onClick={onChange}
      style={{
        width: size,
        height: size,
        borderRadius: 3,
        border: `1.5px solid ${isChecked || isPartial ? Colors.accent1Darker : Colors.grey}`,
        backgroundColor: isChecked || isPartial ? Colors.accent1Darker : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {isChecked && (
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
      {isPartial && (
        <svg width={size - 6} height={size - 6} viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6H10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

export function BulkContribuenteEditBar({
  checkedCount,
  totalCount,
  onSelectAll,
  onSelectNone,
  onDelete,
}: BulkContribuenteEditBarProps) {
  const isVisible = checkedCount > 0;

  // Determine checkbox value
  const getCheckboxValue = (): CheckboxValue => {
    if (checkedCount === 0) return 'none';
    if (checkedCount === totalCount) return 'all';
    return 'partial';
  };

  const handleCheckboxChange = () => {
    const currentValue = getCheckboxValue();
    if (currentValue === 'all') {
      onSelectNone();
    } else {
      onSelectAll();
    }
  };

  // Text button style
  const textBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    ...TextStyles.body2,
    color: Colors.accent1,
    padding: 0,
  };

  return (
    <div
      style={{
        height: 48,
        backgroundColor: Colors.bg1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: Insets.l,
        paddingRight: Insets.l,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.98)',
        transition: `opacity ${Animations.button.duration} ${Animations.button.easing}, transform ${Animations.button.duration} ${Animations.button.easing}`,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Left side: checkbox, select text, all/none buttons, delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: Insets.m }}>
        <MasterCheckbox
          value={getCheckboxValue()}
          onChange={handleCheckboxChange}
        />

        <span style={{ ...TextStyles.body2, fontWeight: 700, color: Colors.txt }}>
          Seleziona
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: Insets.sm * 0.5 }}>
          <button onClick={onSelectAll} style={textBtnStyle}>
            Tutti
          </button>
          <span style={{ ...TextStyles.body2, color: Colors.txt }}>/</span>
          <button onClick={onSelectNone} style={textBtnStyle}>
            Nessuno
          </button>
        </div>

        <button
          onClick={onDelete}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: Insets.xs,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            ...TextStyles.body2,
            color: Colors.error,
            padding: `${Insets.xs}px ${Insets.sm}px`,
          }}
        >
          <img
            src={trashIcon}
            alt="Elimina"
            style={{
              width: 16,
              height: 16,
              filter: 'brightness(0) saturate(100%) invert(14%) sepia(89%) saturate(5996%) hue-rotate(358deg) brightness(94%) contrast(117%)', // error red
            }}
          />
          Elimina
        </button>
      </div>

      {/* Right side: count */}
      <span style={{ ...TextStyles.body2, fontWeight: 700, color: Colors.txt }}>
        {checkedCount} Selezionati
      </span>
    </div>
  );
}
