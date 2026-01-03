import { useRef, useEffect, useState, forwardRef } from 'react';
import { Colors, Sizes, Animations, Insets, PageBreaks } from '../theme';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateContribuente: () => void;
}

type PageType = 'dashboard' | 'contribuenti';

// Hook for responsive sidebar width
function useSidebarWidth() {
  const [width, setWidth] = useState<number>(Sizes.sideBarLg);
  const [isCompact, setIsCompact] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= PageBreaks.Desktop) {
        // Desktop: full sidebar
        setWidth(Sizes.sideBarLg);
        setIsCompact(false);
        setIsHidden(false);
      } else if (screenWidth >= PageBreaks.TabletLandscape) {
        // Tablet Landscape: medium sidebar
        setWidth(Sizes.sideBarMed);
        setIsCompact(false);
        setIsHidden(false);
      } else if (screenWidth >= PageBreaks.TabletPortrait) {
        // Tablet Portrait: compact/skinny mode
        setWidth(Sizes.sideBarSm);
        setIsCompact(true);
        setIsHidden(false);
      } else {
        // Mobile: hidden (drawer mode)
        setWidth(0);
        setIsCompact(true);
        setIsHidden(true);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return { width, isCompact, isHidden };
}

export function Sidebar({ currentView, onNavigate, onCreateContribuente }: SidebarProps) {
  const [indicatorY, setIndicatorY] = useState(0);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { width, isCompact, isHidden } = useSidebarWidth();

  // Update indicator position when view changes
  useEffect(() => {
    const button = buttonRefs.current[currentView];
    if (button) {
      const rect = button.getBoundingClientRect();
      const parentRect = button.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        const y = rect.top - parentRect.top + (rect.height / 2) - (Sizes.indicatorHeight / 2);
        setIndicatorY(y);
      }
    }
  }, [currentView]);

  // Don't render if hidden (mobile)
  if (isHidden) {
    return null;
  }

  return (
    <aside
      className="flex flex-col relative"
      style={{
        width,
        backgroundColor: Colors.accent1,
        borderTopRightRadius: Sizes.radiusMd,
        transition: `width ${Animations.layout.duration} ${Animations.layout.easing}`,
      }}
    >
      {/* Create Button */}
      <div style={{ padding: isCompact ? Insets.m : `${Insets.l}px ${Insets.m}px ${Insets.m}px` }}>
        <button
          onClick={onCreateContribuente}
          className={`w-full flex items-center border-2 border-dashed text-white font-semibold text-sm rounded-lg ${
            isCompact ? 'justify-center' : 'gap-2 px-4'
          }`}
          style={{
            height: Sizes.buttonHeight,
            backgroundColor: Colors.accent1,
            borderColor: 'rgba(255, 255, 255, 0.6)',
            transition: `background-color ${Animations.button.duration} ${Animations.button.easing}`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = Colors.accent1Dark}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = Colors.accent1}
          title={isCompact ? 'Crea Contribuente' : undefined}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {!isCompact && 'CREA CONTRIBUENTE'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 relative" style={{ paddingLeft: Insets.m, paddingRight: Insets.m }}>
        {/* Animated Indicator */}
        <div
          className="absolute left-0"
          style={{
            width: Sizes.indicatorWidth,
            height: Sizes.indicatorHeight,
            backgroundColor: Colors.surface,
            transform: `translateY(${indicatorY}px)`,
            transition: `transform ${Animations.indicator.duration} ${Animations.indicator.easing}`,
          }}
        />

        <ul className="space-y-1">
          <NavButton
            ref={(el) => { buttonRefs.current['dashboard'] = el; }}
            icon={<DashboardIcon />}
            label="DASHBOARD"
            isSelected={currentView === 'dashboard'}
            isCompact={isCompact}
            onClick={() => onNavigate('dashboard')}
          />
          <NavButton
            ref={(el) => { buttonRefs.current['contribuenti'] = el; }}
            icon={<UserIcon />}
            label="CONTRIBUENTI"
            isSelected={currentView === 'contribuenti'}
            isCompact={isCompact}
            onClick={() => onNavigate('contribuenti')}
          />
        </ul>
      </nav>

      {/* Footer - version */}
      <div className="text-sm" style={{ padding: Insets.m, color: 'rgba(255, 255, 255, 0.6)' }}>
        {isCompact ? 'v1' : 'v1.0'}
      </div>
    </aside>
  );
}

// Navigation button component
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  isCompact: boolean;
  onClick: () => void;
}

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ icon, label, isSelected, isCompact, onClick }, ref) => {
    return (
      <li>
        <button
          ref={ref}
          onClick={onClick}
          className={`w-full flex items-center rounded-lg text-white text-sm ${
            isCompact ? 'justify-center' : 'gap-2 px-4'
          }`}
          style={{
            height: Sizes.buttonHeight,
            opacity: isSelected ? 1 : 0.8,
            transition: `background-color ${Animations.button.duration} ${Animations.button.easing}, opacity ${Animations.button.duration} ${Animations.button.easing}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = Colors.accent1Dark;
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.opacity = isSelected ? '1' : '0.8';
          }}
          title={isCompact ? label : undefined}
        >
          {icon}
          {!isCompact && label}
        </button>
      </li>
    );
  }
);

NavButton.displayName = 'NavButton';

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
