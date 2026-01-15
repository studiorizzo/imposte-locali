import { Colors } from '../../theme';
import { Sizes, Insets } from '../../styles';
import imuendoLogo from '../../assets/logos/imuendo_h60.svg';

export function Header() {
  return (
    <header
      className="flex items-center"
      style={{
        backgroundColor: Colors.bg1,
        height: Sizes.headerHeight,
        paddingLeft: Insets.l,
        borderBottom: '1px solid black', // TEMPORARY - debug border
      }}
    >
      <img
        src={imuendoLogo}
        alt="imuendo"
        draggable={false}
        style={{
          height: 60,
          width: 'auto',
        }}
      />
    </header>
  );
}
