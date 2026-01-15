import { Colors } from '../theme';
import { Sizes, Insets } from '../styles';

// Icons
import CancelIcon from '../assets/Cancel_form.svg';
import SaveIcon from '../assets/Save_fill.svg';

interface ImmobileFormPanelProps {
  onClose: () => void;
  onSave: () => void;
}

export function ImmobileFormPanel({ onClose, onSave }: ImmobileFormPanelProps) {
  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: Colors.surface,
        borderTopLeftRadius: Sizes.radiusMd,
        borderBottomLeftRadius: Sizes.radiusMd,
      }}
    >
      {/* Header - icon buttons */}
      <div
        className="flex items-center justify-between"
        style={{
          paddingTop: Insets.l * 0.75,
          paddingBottom: Insets.m,
          paddingLeft: Insets.l,
          paddingRight: Insets.l,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
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
          <img src={CancelIcon} alt="Chiudi" width={Sizes.iconSizeMd} height={Sizes.iconSizeMd} style={{ display: 'block' }} />
        </button>
        {/* Save button */}
        <button
          onClick={onSave}
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

      {/* Content area - placeholder */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: Colors.greyWeak,
        }}
      >
        Immobile Form (coming soon)
      </div>
    </div>
  );
}
