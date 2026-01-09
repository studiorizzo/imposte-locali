import { useRef, useEffect, useState, forwardRef } from 'react';
import { Colors } from '../theme';
import { Sizes, Animations, Insets, PageBreaks, TextStyles, Fonts } from '../styles';
import imuendoLogo from '../assets/imuendo-logo-animated.svg';
import userAddIcon from '../assets/User_add_alt.svg';
import contribuentiIcon from '../assets/Group_contribuenti.svg';
import dashboardIcon from '../assets/Dashboard.svg';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateContribuente: () => void;
  onMenuToggle?: () => void;  // For mobile hamburger
}

// Hook for responsive sidebar width
// From Flokk main_scaffold_view.dart:
// - Desktop (≥1440): sideBarLg, skinnyMode=false → rectangular with text
// - TabletLandscape (1024-1439): sideBarMed, skinnyMode=true → circular icon only
// - TabletPortrait (768-1023): sideBarSm, skinnyMode=true → circular icon only
// - Mobile (<768): hidden (drawer mode)
function useSidebarWidth() {
  const [width, setWidth] = useState<number>(Sizes.sideBarLg);
  const [isCompact, setIsCompact] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= PageBreaks.Desktop) {
        // Desktop (≥1440): full sidebar, rectangular buttons with text
        setWidth(Sizes.sideBarLg);
        setIsCompact(false);
        setIsHidden(false);
      } else if (screenWidth >= PageBreaks.TabletLandscape) {
        // TabletLandscape (1024-1439): medium sidebar, circular buttons
        setWidth(Sizes.sideBarMed);
        setIsCompact(true);
        setIsHidden(false);
      } else if (screenWidth >= PageBreaks.TabletPortrait) {
        // TabletPortrait (768-1023): small sidebar, circular buttons
        setWidth(Sizes.sideBarSm);
        setIsCompact(true);
        setIsHidden(false);
      } else {
        // Mobile (<768): hidden (drawer mode)
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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { width, isCompact, isHidden } = useSidebarWidth();

  // Update indicator position when view changes
  // Calculate Y position relative to menu section
  useEffect(() => {
    const button = buttonRefs.current[currentView];
    if (button && menuRef.current) {
      const buttonRect = button.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      // Center indicator vertically on the button
      const y = buttonRect.top - menuRect.top + (buttonRect.height / 2) - (Sizes.indicatorHeight / 2);
      setIndicatorY(y);
    }
  }, [currentView, isCompact]);

  // Don't render if hidden (mobile)
  if (isHidden) {
    return null;
  }

  return (
    <aside
      className="h-full flex flex-col"
      style={{
        width,
        transition: `width ${Animations.layout.duration} ${Animations.layout.easing}`,
      }}
    >
      {/* ============================================ */}
      {/* HEADER SECTION - 106px, bg1 background */}
      {/* Logo always aligned left with same padding as button container */}
      {/* ============================================ */}
      <div
        className="flex items-center"
        style={{
          height: Sizes.headerHeight,
          backgroundColor: Colors.bg1,
          // Same padding as button container: Insets.l in desktop, Insets.m in compact
          paddingLeft: isCompact ? Insets.m : Insets.l,
        }}
      >
        {/* Logo - always left-aligned, width: 140px compact, 200px desktop */}
        <img
          src={imuendoLogo}
          alt="imuendo"
          style={{
            width: isCompact ? 140 : 200,
            height: 'auto',
          }}
        />
      </div>

      {/* ============================================ */}
      {/* MENU SECTION - flex-1, accent1, borderRadius topRight */}
      {/* From Flokk: StyledContainer(bgColor, borderRadius: BorderRadius.only(topRight: Corners.s10Radius)) */}
      {/* ============================================ */}
      <div
        ref={menuRef}
        className="flex-1 flex flex-col relative"
        style={{
          backgroundColor: Colors.accent1,
          borderTopRightRadius: Sizes.radiusMd,
        }}
      >
        {/* Animated Indicator - at left edge of menu section */}
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: Sizes.indicatorWidth,
            height: Sizes.indicatorHeight,
            backgroundColor: Colors.surface,
            transform: `translateY(${indicatorY}px)`,
            transition: `transform ${Animations.indicator.duration} ${Animations.indicator.easing}`,
          }}
        />

        {/*
          Button container structure from Flokk:
          .padding(all: Insets.l, bottom: Insets.m).constrained(maxWidth: 280)
          Inside: VSpace(l) + CreateBtn + VSpace(l) + Dashboard + Contacts (no gap!)
        */}
        <div
          className="flex-1 flex flex-col"
          style={{
            padding: `${Insets.l}px ${Insets.l}px ${Insets.m}px ${Insets.l}px`,
            maxWidth: isCompact ? undefined : 280,
            alignItems: 'center',
          }}
        >
          {/* VSpace(Insets.l) - initial spacing before Create button */}
          <div style={{ height: Insets.l }} />

          {/* Create Button */}
          <CreateButton
            onClick={onCreateContribuente}
          />

          {/* VSpace(Insets.l) - spacing after create button */}
          <div style={{ height: Insets.l }} />

          {/* Navigation */}
          <nav
            className="relative flex flex-col"
            style={{
              alignItems: isCompact ? 'center' : 'stretch',
              width: isCompact ? 'auto' : '100%',
            }}
          >
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
              icon={<ContribuentiIcon />}
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
      </div>
    </aside>
  );
}

// Create Contact Button - always circular with user add icon
interface CreateButtonProps {
  onClick: () => void;
}

function CreateButton({ onClick }: CreateButtonProps) {
  const buttonSize = Sizes.buttonHeight; // 60px

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-white"
      style={{
        width: buttonSize,
        height: buttonSize,
        backgroundColor: Colors.accent1,
        // Dotted border: dashPattern [3, 5] in Flokk
        border: '2px dashed rgba(255, 255, 255, 0.7)',
        borderRadius: '50%',
        transition: `background-color ${Animations.button.duration} ${Animations.button.easing}`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = Colors.accent1Dark}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = Colors.accent1}
      title="Nuovo contribuente"
    >
      <img
        src={userAddIcon}
        alt="Nuovo contribuente"
        style={{ width: Sizes.iconSizeLg, height: Sizes.iconSizeLg }}
      />
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
    const buttonSize = Sizes.buttonHeight; // 60px

    return (
      <button
        ref={ref}
        onClick={onClick}
        className="flex items-center text-white"
        style={{
          width: isCompact ? buttonSize : '100%',
          height: buttonSize,
          // Circular in compact, rounded rect in normal
          borderRadius: isCompact ? '50%' : Sizes.radiusBtn,
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
        {/* Gap + Text - only in non-compact mode */}
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

// Icons
const DashboardIcon = () => (
  <img
    src={dashboardIcon}
    alt="Dashboard"
    style={{ width: Sizes.iconSizeSm, height: Sizes.iconSizeSm }}
  />
);

const ContribuentiIcon = () => (
  <img
    src={contribuentiIcon}
    alt="Contribuenti"
    style={{ width: Sizes.iconSizeXl, height: Sizes.iconSizeXl }}
  />
);

// ============================================
// MOBILE DRAWER
// From Flokk: drawer property of Scaffold with MainSideMenu inside
// ============================================

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onCreateContribuente: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onCreateContribuente,
}: MobileDrawerProps) {
  const [indicatorY, setIndicatorY] = useState(0);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Update indicator position when view changes
  useEffect(() => {
    const button = buttonRefs.current[currentView];
    if (button && menuRef.current) {
      const buttonRect = button.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const y = buttonRect.top - menuRect.top + (buttonRect.height / 2) - (Sizes.indicatorHeight / 2);
      setIndicatorY(y);
    }
  }, [currentView, isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: `opacity ${Animations.panel.duration} ${Animations.panel.easing}`,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{
          width: Sizes.sideBarLg,
          maxWidth: '80vw',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: `transform ${Animations.panel.duration} ${Animations.panel.easing}`,
        }}
      >
        {/* HEADER SECTION - bg1, logo aligned left, rounded bottom-right */}
        <div
          className="flex items-center"
          style={{
            height: Sizes.headerHeight,
            backgroundColor: Colors.bg1,
            paddingLeft: Insets.l,
            borderBottomRightRadius: Sizes.radiusMd,
          }}
        >
          <img
            src={imuendoLogo}
            alt="imuendo"
            style={{
              width: 200,
              height: 'auto',
            }}
          />
        </div>

        {/* MENU SECTION - accent1 */}
        <div
          ref={menuRef}
          className="flex-1 flex flex-col relative"
          style={{
            backgroundColor: Colors.accent1,
            borderTopRightRadius: Sizes.radiusMd,
          }}
        >
          {/* Animated Indicator */}
          <div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: Sizes.indicatorWidth,
              height: Sizes.indicatorHeight,
              backgroundColor: Colors.surface,
              transform: `translateY(${indicatorY}px)`,
              transition: `transform ${Animations.indicator.duration} ${Animations.indicator.easing}`,
            }}
          />

          {/* Button container */}
          <div
            className="flex-1 flex flex-col"
            style={{
              padding: `${Insets.l}px ${Insets.l}px ${Insets.m}px ${Insets.l}px`,
              maxWidth: 280,
              alignItems: 'center',
            }}
          >
            <div style={{ height: Insets.l }} />

            <CreateButton onClick={onCreateContribuente} />

            <div style={{ height: Insets.l }} />

            <nav
              className="relative flex flex-col"
              style={{ width: '100%' }}
            >
              <NavButton
                ref={(el) => { buttonRefs.current['dashboard'] = el; }}
                icon={<DashboardIcon />}
                label="DASHBOARD"
                isSelected={currentView === 'dashboard'}
                isCompact={false}
                onClick={() => onNavigate('dashboard')}
              />
              <NavButton
                ref={(el) => { buttonRefs.current['contribuenti'] = el; }}
                icon={<ContribuentiIcon />}
                label="CONTRIBUENTI"
                isSelected={currentView === 'contribuenti'}
                isCompact={false}
                onClick={() => onNavigate('contribuenti')}
              />
            </nav>
          </div>

          {/* Version */}
          <div
            className="absolute"
            style={{
              left: 4,
              bottom: 4,
              color: 'rgba(255, 255, 255, 0.6)',
              ...TextStyles.caption,
            }}
          >
            v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
