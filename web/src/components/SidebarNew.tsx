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
 * Structure (matching Figma design):
 * - Width: 120px
 * - Background: bg1 (light)
 * - Green strip on left edge (20px) connecting buttons
 * - BorderButton top: sign_in at top edge
 * - BorderButton left: dashboard, contribuenti, empty
 */
export function SidebarNew({ currentView, onNavigate, onSignIn }: SidebarNewProps) {
  const stripWidth = 20; // Width of the green connector strip on the left

  return (
    <aside
      className="h-full relative"
      style={{
        width: Sizes.sideBarCompact,
        backgroundColor: Colors.bg1,
      }}
    >
      {/* Green connector strip on the left edge (from header to bottom) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: Sizes.headerHeight,
          bottom: 0,
          width: stripWidth,
          backgroundColor: Colors.accent1,
        }}
      />

      {/* Header area - BorderButton top positioned at bottom of header */}
      <div
        style={{
          position: 'absolute',
          top: Sizes.headerHeight - 80, // Position so button bottom aligns with header bottom
          left: (Sizes.sideBarCompact - 100) / 2, // Center horizontally (100 = button width)
        }}
      >
        <BorderButton
          position="top"
          icon={<img src={signInIcon} alt="Sign In" style={{ width: 60, height: 60 }} />}
          onClick={onSignIn}
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
          icon={null}
          title="Coming soon"
        />
      </div>
    </aside>
  );
}
