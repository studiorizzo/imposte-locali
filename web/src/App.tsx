import { useState, useEffect } from 'react';
import { ImmobiliStep } from './components/forms';
import { Dashboard } from './components/Dashboard';
import { RiepilogoCalcolo } from './components/RiepilogoCalcolo';
import { Sidebar, MobileDrawer } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { ContribuenteFormPanel } from './components/ContribuenteFormPanel';
import type { ContribuenteFormData } from './components/ContribuenteFormPanel';
import { calcolaRiepilogoIMU, ANNO_RIFERIMENTO } from '@lib';
import type { DatiImmobile, RiepilogoIMU } from '@lib';
import { Colors, Sizes, Insets, PageBreaks, Fonts, Animations } from './theme';
import './index.css';

type ViewType = 'dashboard' | 'form' | 'riepilogo' | 'contribuenti';

// Hook to detect mobile mode
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

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [immobili, setImmobili] = useState<DatiImmobile[]>([]);
  const [riepilogo, setRiepilogo] = useState<RiepilogoIMU | null>(null);
  const [isContribuentePanelOpen, setIsContribuentePanelOpen] = useState(false);
  const [contribuenti, setContribuenti] = useState<ContribuenteFormData[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

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
          <div className="space-y-4">
            {contribuenti.map((c, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow border">
                <p className="font-semibold">{c.cognome} {c.nome}</p>
                <p className="text-sm text-gray-500">{c.codiceFiscale}</p>
              </div>
            ))}
          </div>
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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: Colors.bg1 }}>
      {/* Sidebar - full height with header area inside (hidden on mobile) */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as ViewType)}
        onCreateContribuente={() => setIsContribuentePanelOpen(true)}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar - from Flokk: topBarHeight = 60, padding = Insets.l (Insets.m on mobile) */}
        <div
          className="flex items-center"
          style={{
            height: Sizes.topBarHeight,
            paddingLeft: isMobile ? Insets.mGutter : Insets.lGutter,
            paddingRight: isMobile ? Insets.mGutter : Insets.lGutter,
            marginTop: Insets.l,
          }}
        >
          {/* Hamburger button on mobile - from Flokk: left: Insets.m, top: Insets.m */}
          {isMobile && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center mr-3"
              style={{
                width: 40,
                height: 40,
                color: Colors.accent1,
                transition: `color ${Animations.button.duration} ${Animations.button.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = Colors.accent1Dark}
              onMouseLeave={(e) => e.currentTarget.style.color = Colors.accent1}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Centered logo on mobile - from Flokk: FlokkLogo(40, theme.accent1) */}
          {isMobile && (
            <div
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                fontFamily: Fonts.heading,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: Colors.accent1,
              }}
            >
              imuendo
            </div>
          )}

          {/* SearchBar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Cerca contribuenti..."
            narrowMode={isMobile}
          />
        </div>

        {/* Main Content - with top padding for spacing after SearchBar */}
        <main
          className="flex-1 overflow-auto"
          style={{
            paddingLeft: isMobile ? Insets.mGutter : Insets.lGutter,
            paddingRight: Insets.mGutter,
            paddingTop: Insets.l,
            paddingBottom: Insets.l,
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

      {/* Contribuente Form Panel */}
      <ContribuenteFormPanel
        isOpen={isContribuentePanelOpen}
        onClose={() => setIsContribuentePanelOpen(false)}
        onSave={handleSaveContribuente}
      />
    </div>
  );
}

export default App;
