import { BorderButton } from './BorderButton';
import { Colors } from '../theme';
import { Sizes } from '../styles';

// Import icons
import signInIcon from '../assets/buttons/sign_in.svg';
import dashboardIcon from '../assets/buttons/dashboard.svg';
import userIcon from '../assets/buttons/user.svg';
import viewIcon from '../assets/buttons/view.svg';
import comuniIcon from '../assets/buttons/comuni.svg';
import settingIcon from '../assets/buttons/setting.svg';

interface SidebarNewProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

/**
 * New Sidebar component for desktop/tablet
 *
 * Structure (matching Figma design):
 * - Width: 120px
 * - Background: bg1 (light)
 * - Green strip on left edge (20px) connecting buttons
 * - BorderButton top: sign_in at top edge
 * - BorderButton left: dashboard, contribuenti, empty
 */
export function SidebarNew({ currentView, onNavigate }: SidebarNewProps) {
  return (
    <aside
      className="h-full relative"
      style={{
        width: Sizes.sideBarCompact,
        backgroundColor: Colors.bg1,
        borderRight: '1px solid black', // TEMPORARY - debug border
      }}
    >

      {/* Header area - BorderButton top at screen edge */}
      <div
        style={{
          position: 'absolute',
          top: 0, // Flush with screen edge
          left: 0, // Flush with left edge
        }}
      >
        <BorderButton
          position="top"
          icon={<img src={signInIcon} alt="Sign In" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('login')}
          isSelected={currentView === 'login'}
          title="Accedi"
        />
      </div>

      {/* Menu buttons - positioned on left edge */}
      <div
        style={{
          position: 'absolute',
          top: Sizes.headerHeight + 20, // Gap after header
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0, // No gap - buttons stack directly
        }}
      >
        <BorderButton
          position="left"
          icon={<img src={dashboardIcon} alt="Dashboard" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('dashboard')}
          isSelected={currentView === 'dashboard'}
          title="Dashboard"
        />

        <BorderButton
          position="left"
          icon={<img src={userIcon} alt="Contribuenti" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('contribuenti')}
          isSelected={currentView === 'contribuenti'}
          title="Contribuenti"
        />

        <BorderButton
          position="left"
          icon={<img src={viewIcon} alt="Accertamento" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('accertamento')}
          isSelected={currentView === 'accertamento'}
          title="Accertamento"
        />

        <BorderButton
          position="left"
          icon={<img src={comuniIcon} alt="Aliquote" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('aliquote')}
          isSelected={currentView === 'aliquote'}
          title="Aliquote"
        />

        <BorderButton
          position="left"
          icon={<img src={settingIcon} alt="Impostazioni" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('impostazioni')}
          isSelected={currentView === 'impostazioni'}
          title="Impostazioni"
        />
      </div>
    </aside>
  );
}
