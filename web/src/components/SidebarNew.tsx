import { useState, useEffect } from 'react';
import { Colors } from '../theme';
import { Sizes, PageBreaks, Animations } from '../styles';
import { BorderButton } from './BorderButton';
import imuendoLogo from '../assets/imuendo-logo-animated.svg';

// Icons (inline SVG components for the new design)
const MenuIcon = () => (
  <svg width="35" height="25" viewBox="0 0 35 25" fill="none">
    <path d="M0 2.5H35" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <path d="M0 12.5H35" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <path d="M0 22.5H35" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="2" y="19" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
    <rect x="20" y="15" width="14" height="16" rx="1" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
    <rect x="20" y="2" width="14" height="8" rx="1" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
    <rect x="2" y="2" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
  </svg>
);

const ContactsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="10" r="6" stroke="currentColor" strokeWidth="4" fill="none"/>
    <path d="M4 28C4 20 10 16 16 16C22 16 28 20 28 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const TransfersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="10" cy="22" r="6" stroke="currentColor" strokeWidth="4"/>
    <circle cx="22" cy="22" r="6" stroke="currentColor" strokeWidth="4"/>
    <path d="M22 16L10 4M10 4L4 10M10 4L16 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FavoritesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="4"/>
    <path d="M16 6C16 6 26 12 26 16C26 20 16 26 16 26C16 26 6 20 6 16C6 12 16 6 16 6Z" stroke="currentColor" strokeWidth="4"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="4"/>
    <path d="M16 2V6M16 26V30M2 16H6M26 16H30M5.8 5.8L8.6 8.6M23.4 23.4L26.2 26.2M26.2 5.8L23.4 8.6M8.6 23.4L5.8 26.2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M12 4C8 4 4 8 4 16C4 24 8 28 12 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M14 16H28M28 16L22 10M28 16L22 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface SidebarNewProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateContribuente: () => void;
  onMenuToggle?: () => void;
}

function useSidebarVisibility() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsHidden(window.innerWidth < PageBreaks.TabletPortrait);
    };
    updateVisibility();
    window.addEventListener('resize', updateVisibility);
    return () => window.removeEventListener('resize', updateVisibility);
  }, []);

  return { isHidden };
}

export function SidebarNew({ currentView, onNavigate, onCreateContribuente: _onCreateContribuente, onMenuToggle }: SidebarNewProps) {
  const { isHidden } = useSidebarVisibility();

  if (isHidden) {
    return null;
  }

  const sidebarWidth = Sizes.sideBarCompact; // 120px

  return (
    <aside
      style={{
        width: sidebarWidth,
        height: '100%',
        backgroundColor: Colors.bg1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Menu button at top - centered horizontally */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 10,
        }}
      >
        <BorderButton
          position="top"
          icon={<MenuIcon />}
          onClick={onMenuToggle}
          title="Menu"
        />
      </div>

      {/* Logo area */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px 10px',
        }}
      >
        <img
          src={imuendoLogo}
          alt="imuendo"
          draggable={false}
          style={{
            width: 100,
            height: 'auto',
          }}
        />
      </div>

      {/* Main navigation buttons on left edge */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <BorderButton
          position="left"
          icon={<DashboardIcon />}
          onClick={() => onNavigate('dashboard')}
          isSelected={currentView === 'dashboard'}
          title="Dashboard"
        />
        <BorderButton
          position="left"
          icon={<ContactsIcon />}
          onClick={() => onNavigate('contribuenti')}
          isSelected={currentView === 'contribuenti'}
          title="Contribuenti"
        />
        <BorderButton
          position="left"
          icon={<TransfersIcon />}
          onClick={() => {}}
          title="Trasferimenti"
        />
        <BorderButton
          position="left"
          icon={<FavoritesIcon />}
          onClick={() => {}}
          title="Preferiti"
        />
        <BorderButton
          position="left"
          icon={<SettingsIcon />}
          onClick={() => {}}
          title="Impostazioni"
        />
      </div>

      {/* Logout button at bottom */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: 10,
        }}
      >
        <BorderButton
          position="bottom"
          icon={<LogoutIcon />}
          onClick={() => {}}
          title="Logout"
        />
      </div>
    </aside>
  );
}
