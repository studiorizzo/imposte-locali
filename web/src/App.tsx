import { useState, useEffect } from 'react';
import { ImmobiliStep } from './components/forms';
import { Dashboard } from './components/Dashboard';
import { RiepilogoCalcolo } from './components/RiepilogoCalcolo';
import { SidebarNew } from './components/SidebarNew';
import { Header } from './components/layout/Header';
import { ContribuenteFormPanel } from './components/ContribuenteFormPanel';
import type { ContribuenteFormData } from './components/ContribuenteFormPanel';
import { ImmobileFormPanel } from './components/ImmobileFormPanel';
import { ContribuentiPage, ContribuenteInfoPanel } from './components/contribuenti';
import type { ContribuenteFullData } from './components/contribuenti';
import { AliquotePage, AccertamentoPage, ImpostazioniPage, LoginPage } from './components/pages';
import { calcolaRiepilogoIMU, ANNO_RIFERIMENTO } from '@lib';
import type { DatiImmobile, RiepilogoIMU } from '@lib';
import { Colors } from './theme';
import { Sizes, Insets, PageBreaks, Animations, Durations } from './styles';
import './index.css';

type ViewType = 'dashboard' | 'form' | 'riepilogo' | 'contribuenti' | 'aliquote' | 'accertamento' | 'impostazioni' | 'login';

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
  const [isImmobilePanelOpen, setIsImmobilePanelOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isPanelAnimating, setIsPanelAnimating] = useState(false);
  const [contribuenti, setContribuenti] = useState<ContribuenteFormData[]>([]);
  const [selectedContribuente, setSelectedContribuente] = useState<ContribuenteFullData | null>(null);
  const [selectedContribuenteId, setSelectedContribuenteId] = useState<string | null>(null);
  const [isEditingContribuente, setIsEditingContribuente] = useState(false);
  const [isSearchSelected, setIsSearchSelected] = useState(false);
  const [isSearchClosing, setIsSearchClosing] = useState(false);
  const [pendingView, setPendingView] = useState<ViewType | null>(null);
  const [pendingShapeSelection, setPendingShapeSelection] = useState<'userAdd' | 'automate' | null>(null);
  // Shape selection is separate from panel open - shape waits for search to close
  const [userAddShapeSelected, setUserAddShapeSelected] = useState(false);
  const [automateShapeSelected, setAutomateShapeSelected] = useState(false);
  const isMobile = useIsMobile();
  const { panelWidth, useSingleColumn, leftMenuWidth, showLeftMenu } = usePanelLayout();

  // Handle panel open/close animations (like Flokk)
  const anyPanelOpen = isContribuentePanelOpen || isImmobilePanelOpen;
  useEffect(() => {
    if (anyPanelOpen) {
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
  }, [anyPanelOpen]);

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
    if (selectedContribuente) {
      // Editing existing - return to info panel (like Flokk)
      setIsEditingContribuente(false);
    } else {
      // Creating new - close panel entirely
      setIsContribuentePanelOpen(false);
      setUserAddShapeSelected(false);
    }
  };

  const handleCreateContribuente = () => {
    // Always open panel immediately (for shift animation and panel opening)
    setSelectedContribuente(null);
    setSelectedContribuenteId(null);
    setIsEditingContribuente(false);
    setIsContribuentePanelOpen(true);
    setIsImmobilePanelOpen(false);  // Close other panel
    setAutomateShapeSelected(false);  // Deselect other shape

    if (isSearchSelected || isSearchClosing) {
      // Search is open/closing - defer shape selection until search closes
      setPendingShapeSelection('userAdd');
      if (isSearchSelected) {
        setIsSearchClosing(true);
        setIsSearchSelected(false);
      }
    } else {
      // No search animation - activate shape immediately
      setUserAddShapeSelected(true);
    }
  };

  const handleOpenImmobileForm = () => {
    // Always open panel immediately (for shift animation and panel opening)
    setIsImmobilePanelOpen(true);
    setIsContribuentePanelOpen(false);  // Close other panel
    setUserAddShapeSelected(false);  // Deselect other shape

    if (isSearchSelected || isSearchClosing) {
      // Search is open/closing - defer shape selection until search closes
      setPendingShapeSelection('automate');
      if (isSearchSelected) {
        setIsSearchClosing(true);
        setIsSearchSelected(false);
      }
    } else {
      // No search animation - activate shape immediately
      setAutomateShapeSelected(true);
    }
  };

  const handleCloseImmobileForm = () => {
    setIsImmobilePanelOpen(false);
    setAutomateShapeSelected(false);
  };

  // Navigation handler - deselects search when navigating
  // If search is open and fully expanded, queue the navigation until closing animation completes
  const handleNavigate = (view: string) => {
    if (isSearchSelected) {
      // Search is open - close it and queue the navigation
      setPendingView(view as ViewType);
      setIsSearchClosing(true);
      setIsSearchSelected(false);
    } else if (isSearchClosing) {
      // Already closing - just update the pending view
      setPendingView(view as ViewType);
    } else {
      // No search animation in progress - navigate immediately
      setCurrentView(view as ViewType);
    }
  };

  // Search select handler - only selects, doesn't toggle (consistent with navigation buttons)
  const handleSearchToggle = () => {
    setIsSearchSelected(true);
  };

  // Search cancel handler - closes the search
  const handleSearchCancel = () => {
    setIsSearchClosing(true);
    setIsSearchSelected(false);
  };

  // Called when search closing animation completes
  const handleSearchClosingComplete = () => {
    setIsSearchClosing(false);
    // If there's a pending view, navigate to it now
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
    }
    // If there's a pending shape selection, activate it now
    if (pendingShapeSelection === 'userAdd') {
      setUserAddShapeSelected(true);
      setPendingShapeSelection(null);
    } else if (pendingShapeSelection === 'automate') {
      setAutomateShapeSelected(true);
      setPendingShapeSelection(null);
    }
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
            selectedId={selectedContribuenteId}
            onContribuenteSelect={(c) => {
              if (c === null) {
                // Deselecting - close the panel
                setSelectedContribuenteId(null);
                setIsContribuentePanelOpen(false);
              } else {
                // Convert ContribuenteListData to ContribuenteFullData
                const fullData: ContribuenteFullData = {
                  ...c,
                  emails: c.email ? [c.email] : [],
                  telefoni: c.telefono ? [c.telefono] : [],
                };
                setSelectedContribuenteId(c.id);
                setSelectedContribuente(fullData);
                setIsEditingContribuente(false);
                setIsContribuentePanelOpen(true);
              }
            }}
          />
        );
      case 'aliquote':
        return <AliquotePage />;
      case 'accertamento':
        return <AccertamentoPage />;
      case 'impostazioni':
        return <ImpostazioniPage />;
      case 'login':
        return <LoginPage />;
      default:
        return null;
    }
  };

  // Calculate if content should be hidden (single column + panel open)
  const showPanel = isPanelVisible;
  const hideContent = showPanel && useSingleColumn;

  return (
    <div className="h-screen relative overflow-hidden" style={{ backgroundColor: Colors.bg1 }}>
      {/* New Sidebar - hidden on mobile */}
      {!isMobile && (
        <div className="absolute top-0 bottom-0 left-0">
          <SidebarNew
            currentView={(isSearchSelected || isSearchClosing) ? '' : currentView}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      {/* Header - positioned above content area */}
      {!isMobile && (
        <div
          className="absolute"
          style={{
            top: 0,
            left: leftMenuWidth,
            right: 0,
            height: Sizes.headerHeight,
          }}
        >
          <Header
            onCreateContribuente={handleCreateContribuente}
            onOpenImmobileForm={handleOpenImmobileForm}
            isSearchSelected={isSearchSelected}
            onSearchToggle={handleSearchToggle}
            onSearchCancel={handleSearchCancel}
            onClosingComplete={handleSearchClosingComplete}
            isUserAddSelected={userAddShapeSelected}
            isAutomateSelected={automateShapeSelected}
            panelWidth={isPanelAnimating ? panelWidth : 0}
          />
        </div>
      )}

      {/* Content Area Stack - positioned below header */}
      <div
        className="absolute bottom-0 flex flex-col"
        style={{
          top: isMobile ? 0 : Sizes.headerHeight,
          left: leftMenuWidth,
          right: isPanelAnimating && !useSingleColumn ? panelWidth : 0,
          opacity: hideContent ? 0 : 1,
          transition: `right ${Animations.panel.duration} ${Animations.panel.easing}, opacity ${Animations.panel.duration} ${Animations.panel.easing}`,
          minWidth: 400,
        }}
      >
        {/* Main Content */}
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

      {/* Mobile drawer removed - will implement new mobile layout */}

      {/* Side Panel - Immobile or Contribuente */}
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
            {isImmobilePanelOpen ? (
              <ImmobileFormPanel
                onClose={handleCloseImmobileForm}
                onSave={handleCloseImmobileForm}
              />
            ) : selectedContribuente && !isEditingContribuente ? (
              <ContribuenteInfoPanel
                contribuente={selectedContribuente}
                onClose={() => {
                  setSelectedContribuenteId(null);
                  setIsContribuentePanelOpen(false);
                  setSelectedContribuente(null);
                }}
                onEdit={() => setIsEditingContribuente(true)}
                onStarToggle={() => {
                  setSelectedContribuente(prev =>
                    prev ? { ...prev, isStarred: !prev.isStarred } : null
                  );
                }}
              />
            ) : (
              <ContribuenteFormPanel
                onClose={() => {
                  if (selectedContribuente) {
                    // Return to info panel (like Flokk)
                    setIsEditingContribuente(false);
                  } else {
                    // Creating new - close panel entirely
                    setIsContribuentePanelOpen(false);
                  }
                }}
                onSave={handleSaveContribuente}
              />
            )}
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
            {isImmobilePanelOpen ? (
              <ImmobileFormPanel
                onClose={handleCloseImmobileForm}
                onSave={handleCloseImmobileForm}
              />
            ) : selectedContribuente && !isEditingContribuente ? (
              <ContribuenteInfoPanel
                contribuente={selectedContribuente}
                onClose={() => {
                  setSelectedContribuenteId(null);
                  setIsContribuentePanelOpen(false);
                  setSelectedContribuente(null);
                }}
                onEdit={() => setIsEditingContribuente(true)}
                onStarToggle={() => {
                  setSelectedContribuente(prev =>
                    prev ? { ...prev, isStarred: !prev.isStarred } : null
                  );
                }}
              />
            ) : (
              <ContribuenteFormPanel
                onClose={() => {
                  if (selectedContribuente) {
                    // Return to info panel (like Flokk)
                    setIsEditingContribuente(false);
                  } else {
                    // Creating new - close panel entirely
                    setIsContribuentePanelOpen(false);
                  }
                }}
                onSave={handleSaveContribuente}
              />
            )}
          </div>
        )
      )}
    </div>
  );
}

export default App;
