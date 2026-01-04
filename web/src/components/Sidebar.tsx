import { useRef, useEffect, useState, forwardRef } from 'react';
import { Colors, Sizes, Animations, Insets, PageBreaks, TextStyles } from '../theme';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateContribuente: () => void;
}

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
  const navRef = useRef<HTMLElement | null>(null);
  const { width, isCompact, isHidden } = useSidebarWidth();

  // Update indicator position when view changes
  useEffect(() => {
    const button = buttonRefs.current[currentView];
    if (button && navRef.current) {
      const buttonRect = button.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      const y = buttonRect.top - navRect.top + (buttonRect.height / 2) - (Sizes.indicatorHeight / 2);
      setIndicatorY(y);
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
      {/*
        Button container structure from Flokk:
        .padding(all: Insets.l, bottom: Insets.m).constrained(maxWidth: 280)
        Inside: VSpace(l) + CreateBtn + VSpace(l) + Dashboard + Contacts (no gap!)
      */}
      <div
        className="flex-1"
        style={{
          padding: isCompact
            ? Insets.m
            : `${Insets.l}px ${Insets.l}px ${Insets.m}px ${Insets.l}px`,
          maxWidth: 280,
        }}
      >
        {/* VSpace(Insets.l) - initial spacing before Create button */}
        <div style={{ height: Insets.l }} />

        {/* Create Button */}
        <CreateButton
          isCompact={isCompact}
          onClick={onCreateContribuente}
        />

        {/* VSpace(Insets.l) - spacing after create button */}
        <div style={{ height: Insets.l }} />

        {/* Navigation */}
        <nav ref={navRef} className="relative">
          {/* Animated Indicator */}
          <div
            className="absolute"
            style={{
              left: -Insets.l,
              width: Sizes.indicatorWidth,
              height: Sizes.indicatorHeight,
              backgroundColor: Colors.surface,
              transform: `translateY(${indicatorY}px)`,
              transition: `transform ${Animations.indicator.duration} ${Animations.indicator.easing}`,
            }}
          />

          {/* Nav buttons - NO spacing between them (directly stacked like Flokk) */}
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
        </nav>
      </div>

      {/* Version - positioned absolute like Flokk: positioned(left: 4, bottom: 4) */}
      <div
        className="absolute"
        style={{
          left: 4,
          bottom: 4,
          color: 'rgba(255, 255, 255, 0.6)',
          ...TextStyles.caption,
        }}
      >
        {isCompact ? 'v1' : 'v1.0'}
      </div>
    </aside>
  );
}

// Create Contact Button
interface CreateButtonProps {
  isCompact: boolean;
  onClick: () => void;
}

function CreateButton({ isCompact, onClick }: CreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center text-white"
      style={{
        height: Sizes.buttonHeight,
        backgroundColor: Colors.accent1,
        // Dotted border: dashPattern [3, 5] in Flokk - CSS approximation
        border: '2px dashed rgba(255, 255, 255, 0.7)',
        borderRadius: Sizes.radiusBtn,
        paddingLeft: isCompact ? 0 : Insets.btnPaddingLeft,
        justifyContent: isCompact ? 'center' : 'flex-start',
        transition: `background-color ${Animations.button.duration} ${Animations.button.easing}`,
        ...TextStyles.btn,
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = Colors.accent1Dark}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = Colors.accent1}
      title={isCompact ? 'Crea Contribuente' : undefined}
    >
      {/* Icon with 2px padding */}
      <span style={{ padding: Sizes.iconPadding }}>
        <svg
          style={{ width: Sizes.iconSizeCreate, height: Sizes.iconSizeCreate }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </span>
      {/* Gap + Text */}
      {!isCompact && (
        <>
          <span style={{ width: Insets.btnIconTextGap }} />
          <span>CREA CONTRIBUENTE</span>
        </>
      )}
    </button>
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
    const textStyle = isSelected ? TextStyles.btnSelected : TextStyles.btn;

    return (
      <button
        ref={ref}
        onClick={onClick}
        className="w-full flex items-center text-white"
        style={{
          height: Sizes.buttonHeight,
          borderRadius: Sizes.radiusBtn,
          paddingLeft: isCompact ? 0 : Insets.btnPaddingLeft,
          justifyContent: isCompact ? 'center' : 'flex-start',
          opacity: isSelected ? 1 : 0.8,
          transition: `background-color ${Animations.button.duration} ${Animations.button.easing}, opacity ${Animations.button.duration} ${Animations.button.easing}`,
          ...textStyle,
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
        {/* Icon with 2px padding */}
        <span style={{ padding: Sizes.iconPadding }}>
          {icon}
        </span>
        {/* Gap + Text */}
        {!isCompact && (
          <>
            <span style={{ width: Insets.btnIconTextGap }} />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }
);

NavButton.displayName = 'NavButton';

// Icons - sized to iconSizeNav (22px)
const DashboardIcon = () => (
  <svg
    style={{ width: Sizes.iconSizeNav, height: Sizes.iconSizeNav }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UserIcon = () => (
  <svg
    style={{ width: Sizes.iconSizeNav, height: Sizes.iconSizeNav }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
