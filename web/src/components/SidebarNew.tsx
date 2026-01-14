import { BorderButton } from './BorderButton';
import { Colors } from '../theme';
import { Sizes } from '../styles';

// Import icons
import signInIcon from '../assets/new/sign_in.svg';
import dashboardIcon from '../assets/new/dashboard.svg';
import userIcon from '../assets/new/user.svg';

interface SidebarNewProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onSignIn?: () => void;
}

/**
 * New Sidebar component for desktop/tablet
 *
 * Structure:
 * - Width: 120px (compact mode for all breakpoints)
 * - Header: 100px height with BorderButton top (sign_in)
 * - Menu: flex-1 with 3 BorderButton left (dashboard, contribuenti, empty)
 */
export function SidebarNew({ currentView, onNavigate, onSignIn }: SidebarNewProps) {
  return (
    <aside
      className="h-full flex flex-col"
      style={{
        width: Sizes.sideBarCompact,
      }}
    >
      {/* Header section - 100px height, bg1 background */}
      <div
        className="flex items-end justify-center"
        style={{
          height: Sizes.headerHeight,
          backgroundColor: Colors.bg1,
        }}
      >
        {/* BorderButton top - sign_in */}
        <BorderButton
          position="top"
          icon={<img src={signInIcon} alt="Sign In" style={{ width: 60, height: 60 }} />}
          onClick={onSignIn}
          title="Accedi"
        />
      </div>

      {/* Menu section - accent1 background, rounded top-right */}
      <div
        className="flex-1 flex flex-col"
        style={{
          backgroundColor: Colors.accent1,
          borderTopRightRadius: Sizes.radiusMd,
          paddingTop: 20, // Space before first button
        }}
      >
        {/* BorderButton left - Dashboard */}
        <BorderButton
          position="left"
          icon={<img src={dashboardIcon} alt="Dashboard" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('dashboard')}
          isSelected={currentView === 'dashboard'}
          title="Dashboard"
        />

        {/* BorderButton left - Contribuenti */}
        <BorderButton
          position="left"
          icon={<img src={userIcon} alt="Contribuenti" style={{ width: 60, height: 60 }} />}
          onClick={() => onNavigate('contribuenti')}
          isSelected={currentView === 'contribuenti'}
          title="Contribuenti"
        />

        {/* BorderButton left - Empty (placeholder for future) */}
        <BorderButton
          position="left"
          icon={null}
          title="Coming soon"
        />
      </div>
    </aside>
  );
}
