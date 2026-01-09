import { useState, useEffect } from 'react';
import { ImmobiliStep } from './components/forms';
import { Dashboard } from './components/Dashboard';
import { RiepilogoCalcolo } from './components/RiepilogoCalcolo';
import { Sidebar, MobileDrawer } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { ContribuenteFormPanel } from './components/ContribuenteFormPanel';
import type { ContribuenteFormData } from './components/ContribuenteFormPanel';
import { ContribuentiPage } from './components/contribuenti';
import { calcolaRiepilogoIMU, ANNO_RIFERIMENTO } from '@lib';
import type { DatiImmobile, RiepilogoIMU } from '@lib';
import { Colors } from './theme';
import { Sizes, Insets, PageBreaks, Animations, Durations } from './styles';
import imuendoLogo from './assets/imuendo-logo-animated.svg';
import './index.css';

type ViewType = 'dashboard' | 'form' | 'riepilogo' | 'contribuenti';

// Convert pixels to inches (assuming 96 DPI standard)
const pxToInches = (px: number) => px / 96;

// Hook to detect mobile mode (sidebar hidden)
// Mobile (<768): sidebar hidden, drawer mode
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < PageBreaks.TabletPortrait);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Layout state type
interface PanelLayoutState {
  panelWidth: number;
  useSingleColumn: boolean;
  leftMenuWidth: number;
  showLeftMenu: boolean;
}

// Hook to calculate panel layout (from Flokk main_scaffold_view.dart)
function usePanelLayout() {
  const [layout, setLayout] = useState<PanelLayoutState>({
    panelWidth: Sizes.panelWidthBase,
    useSingleColumn: true,
    leftMenuWidth: Sizes.sideBarLg,
    showLeftMenu: true,
  });

  useEffect(() => {
    const calculateLayout = () => {
      const widthPx = window.innerWidth;
      const widthInches = pxToInches(widthPx);

      // Calculate panel width: 400 + (widthInches - 8) * 12 for screens > 8"
      let panelWidth = Sizes.panelWidthBase;
      if (widthInches > Sizes.panelGrowthThreshold) {
        panelWidth += (widthInches - Sizes.panelGrowthThreshold) * Sizes.panelWidthGrowthFactor;
      }

      // Single column mode for screens < 10 inches
      const useSingleColumn = widthInches < Sizes.singleColumnThreshold;

      // Calculate left menu width (matching Sidebar logic)
      let leftMenuWidth: number = Sizes.sideBarSm;
      const showLeftMenu = widthPx >= PageBreaks.TabletPortrait;

      if (widthPx >= PageBreaks.Desktop) {
        leftMenuWidth = Sizes.sideBarLg;
      } else if (widthPx >= PageBreaks.TabletLandscape) {
        leftMenuWidth = Sizes.sideBarMed;
      }

      setLayout({
        panelWidth,
        useSingleColumn,
        leftMenuWidth: showLeftMenu ? leftMenuWidth : Insets.mGutter,
        showLeftMenu,
      });
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, []);

  return layout;
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [immobili, setImmobili] = useState<DatiImmobile[]>([]);
  const [riepilogo, setRiepilogo] = useState<RiepilogoIMU | null>(null);
  const [isContribuentePanelOpen, setIsContribuentePanelOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isPanelAnimating, setIsPanelAnimating] = useState(false);
  const [contribuenti, setContribuenti] = useState<ContribuenteFormData[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const isMobile = useIsMobile();
  const { panelWidth, useSingleColumn, leftMenuWidth, showLeftMenu } = usePanelLayout();

  // Handle panel open/close animations (like Flokk)
  useEffect(() => {
    if (isContribuentePanelOpen) {
      setIsPanelVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsPanelAnimating(true);
        });
      });
    } else {
      setIsPanelAnimating(false);
      const timer = setTimeout(() => {
        setIsPanelVisible(false);
      }, Durations.slow);
      return () => clearTimeout(timer);
    }
  }, [isContribuentePanelOpen]);

  // Scroll to top quando cambia la vista
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleAddImmobile = (immobile: DatiImmobile) => {
    setImmobili((prev) => [...prev, immobile]);
  };

  const handleRemoveImmobile = (id: string) => {
    setImmobili((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGoToForm = () => {
    setCurrentView('form');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleCalcolaIMU = () => {
    const result = calcolaRiepilogoIMU(
      ANNO_RIFERIMENTO,
      '', // Contribuente vuoto per ora
      immobili
    );
    setRiepilogo(result);
    setCurrentView('riepilogo');
  };

  const handleReset = () => {
    setCurrentView('dashboard');
    setImmobili([]);
    setRiepilogo(null);
  };

  const handleSaveContribuente = (data: ContribuenteFormData) => {
    setContribuenti(prev => [...prev, data]);
    setIsContribuentePanelOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            immobili={immobili}
            onAddImmobile={handleGoToForm}
            onRemoveImmobile={handleRemoveImmobile}
            onCalcolaIMU={handleCalcolaIMU}
          />
        );
      case 'form':
        return (
          <div>
            <div className="mb-4">
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Torna alla dashboard
              </button>
            </div>
            <ImmobiliStep
              immobili={immobili}
              onAddImmobile={(imm) => {
                handleAddImmobile(imm);
                handleBackToDashboard();
              }}
              onRemoveImmobile={handleRemoveImmobile}
            />
          </div>
        );
      case 'riepilogo':
        return riepilogo ? (
          <div>
            <div className="mb-4">
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Torna alla dashboard
              </button>
            </div>
            <RiepilogoCalcolo riepilogo={riepilogo} onReset={handleReset} />
          </div>
        ) : null;
      case 'contribuenti':
        return (
          <ContribuentiPage
            onContribuenteSelect={(c) => {
              console.log('Selected contribuente:', c);
              // TODO: Open contribuente detail panel
            }}
          />
        );
      default:
        return null;
    }
  };

  // Handle search (placeholder - will integrate with actual search later)
  const handleSearch = (query: string) => {
    console.log('Searching:', query);
    // TODO: Implement actual search functionality
  };

  // Close drawer on resize to non-mobile
  useEffect(() => {
    if (!isMobile && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [isMobile, isDrawerOpen]);

  // Calculate if content should be hidden (single column + panel open)
  const showPanel = isPanelVisible;
  const hideContent = showPanel && useSingleColumn;
  const contentRightOffset = showPanel && !useSingleColumn ? panelWidth : 0;

  return (
    <div className="h-screen relative overflow-hidden" style={{ backgroundColor: Colors.bg1 }}>
      {/* Sidebar - full height with header area inside (hidden on mobile) */}
      <div className="absolute top-0 bottom-0 left-0">
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as ViewType)}
          onCreateContribuente={() => setIsContribuentePanelOpen(true)}
        />
      </div>

      {/* Content Area Stack - positioned like Flokk */}
      <div
        className="absolute top-0 bottom-0 flex flex-col"
        style={{
          left: leftMenuWidth,
          right: isPanelAnimating && !useSingleColumn ? panelWidth : 0,
          opacity: hideContent ? 0 : 1,
          transition: `right ${Animations.panel.duration} ${Animations.panel.easing}, opacity ${Animations.panel.duration} ${Animations.panel.easing}`,
          minWidth: 400,
        }}
      >
        {/* TopBar - from Flokk: topBarHeight = 60, padding = Insets.l (Insets.m on mobile) */}
        <div
          className="flex items-center relative flex-shrink-0"
          style={{
            height: Sizes.topBarHeight,
            paddingLeft: isMobile ? Insets.mGutter : Insets.lGutter,
            paddingRight: isMobile ? Insets.mGutter : Insets.lGutter,
            marginTop: Insets.l,
          }}
        >
          {/* Hamburger button on mobile - same color as imuendo (headerTitle) */}
          {isMobile && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center mr-3"
              style={{
                width: 40,
                height: 40,
                color: Colors.headerTitle,
                transition: `color ${Animations.button.duration} ${Animations.button.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = Colors.accent1Dark}
              onMouseLeave={(e) => e.currentTarget.style.color = Colors.headerTitle}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Centered logo on mobile - width 200px */}
          {isMobile && !isSearchActive && (
            <img
              src={imuendoLogo}
              alt="imuendo"
              className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
              style={{
                width: 200,
                height: 'auto',
                zIndex: 10,
              }}
            />
          )}

          {/* SearchBar */}
          <SearchBar
            onSearch={handleSearch}
            onActiveChange={setIsSearchActive}
            placeholder="Cerca contribuenti"
            narrowMode={isMobile}
          />
        </div>

        {/* Main Content - with top padding for spacing after SearchBar */}
        {/* For 'contribuenti' view: no overflow here, ContribuentiPage handles its own scroll */}
        <main
          className={`flex-1 ${currentView !== 'contribuenti' ? 'overflow-auto' : 'overflow-hidden'}`}
          style={{
            display: currentView === 'contribuenti' ? 'flex' : undefined,
            flexDirection: currentView === 'contribuenti' ? 'column' : undefined,
            minHeight: 0,  // Critical for flex scroll - allows shrinking below content height
            paddingLeft: currentView !== 'contribuenti' ? (isMobile ? Insets.mGutter : Insets.lGutter) : 0,
            paddingRight: currentView !== 'contribuenti' ? Insets.mGutter : 0,
            paddingTop: currentView !== 'contribuenti' ? Insets.l : 0,
            paddingBottom: currentView !== 'contribuenti' ? Insets.l : 0,
          }}
        >
          {renderContent()}
        </main>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view as ViewType);
          setIsDrawerOpen(false);
        }}
        onCreateContribuente={() => {
          setIsContribuentePanelOpen(true);
          setIsDrawerOpen(false);
        }}
      />

      {/* Contribuente Form Panel - Positioned like Flokk */}
      {isPanelVisible && (
        useSingleColumn ? (
          // Single column mode: panel fills width minus left menu
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: leftMenuWidth,
              right: 0,
              transform: `translateX(${isPanelAnimating ? 0 : '100%'})`,
              transition: `transform ${Animations.panel.duration} ${Animations.panel.easing}`,
            }}
          >
            <ContribuenteFormPanel
              onClose={() => setIsContribuentePanelOpen(false)}
              onSave={handleSaveContribuente}
            />
          </div>
        ) : (
          // Dual column mode: panel has fixed width on the right
          <div
            className="absolute top-0 bottom-0"
            style={{
              right: 0,
              width: panelWidth,
              transform: `translateX(${isPanelAnimating ? 0 : panelWidth}px)`,
              transition: `transform ${Animations.panel.duration} ${Animations.panel.easing}`,
            }}
          >
            <ContribuenteFormPanel
              onClose={() => setIsContribuentePanelOpen(false)}
              onSave={handleSaveContribuente}
            />
          </div>
        )
      )}
    </div>
  );
}

export default App;
