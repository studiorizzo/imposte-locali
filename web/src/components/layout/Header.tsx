import { Colors } from '../../theme';
import { Sizes } from '../../styles';
import { BorderButton } from '../BorderButton';
import imuendoLogo from '../../assets/logos/imuendo_h60.svg';
import searchIcon from '../../assets/buttons/search.svg';
import userAddIcon from '../../assets/buttons/user_add.svg';
import automateIcon from '../../assets/buttons/automate.svg';

interface HeaderProps {
  onCreateContribuente?: () => void;
  onOpenImmobileForm?: () => void;
  isSearchSelected?: boolean;
  onSearchToggle?: () => void;
}

export function Header({ onCreateContribuente, onOpenImmobileForm, isSearchSelected, onSearchToggle }: HeaderProps) {
  return (
    <header
      className="flex items-center relative"
      style={{
        backgroundColor: Colors.bg1,
        height: Sizes.headerHeight,
        paddingLeft: 10,
        borderBottom: '1px solid black', // TEMPORARY - debug border
      }}
    >
      {/* Logo */}
      <img
        src={imuendoLogo}
        alt="imuendo"
        draggable={false}
        style={{
          height: 50,
          width: 'auto',
        }}
      />

      {/* Search BorderButton - 10px after logo, aligned to top */}
      <div style={{ marginLeft: 10, alignSelf: 'flex-start' }}>
        <BorderButton
          position="top"
          icon={<img src={searchIcon} alt="Search" style={{ width: 60, height: 60 }} />}
          onClick={onSearchToggle}
          isSelected={isSearchSelected}
          title="Cerca"
        />
      </div>

      {/* Right side BorderButtons - positioned absolute */}
      <div
        className="absolute flex"
        style={{
          right: 0,
          top: 0,
          gap: 0,
        }}
      >
        <BorderButton
          position="top"
          icon={<img src={userAddIcon} alt="Nuovo contribuente" style={{ width: 60, height: 60 }} />}
          onClick={onCreateContribuente}
          title="Nuovo contribuente"
        />
        <BorderButton
          position="top"
          icon={<img src={automateIcon} alt="Automate" style={{ width: 60, height: 60 }} />}
          onClick={onOpenImmobileForm}
          title="Automate"
        />
      </div>
    </header>
  );
}
