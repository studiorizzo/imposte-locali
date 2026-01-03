import { useState, useEffect } from 'react';
import { Header } from './components/layout';
import { ImmobiliStep } from './components/forms';
import { Dashboard } from './components/Dashboard';
import { RiepilogoCalcolo } from './components/RiepilogoCalcolo';
import { Sidebar } from './components/Sidebar';
import { ContribuenteFormPanel } from './components/ContribuenteFormPanel';
import type { ContribuenteFormData } from './components/ContribuenteFormPanel';
import { calcolaRiepilogoIMU, ANNO_RIFERIMENTO } from '@lib';
import type { DatiImmobile, RiepilogoIMU } from '@lib';
import './index.css';

type ViewType = 'dashboard' | 'form' | 'riepilogo' | 'contribuenti';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [immobili, setImmobili] = useState<DatiImmobile[]>([]);
  const [riepilogo, setRiepilogo] = useState<RiepilogoIMU | null>(null);
  const [isContribuentePanelOpen, setIsContribuentePanelOpen] = useState(false);
  const [contribuenti, setContribuenti] = useState<ContribuenteFormData[]>([]);

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
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contribuenti</h2>
            {contribuenti.length === 0 ? (
              <p className="text-gray-500">Nessun contribuente inserito. Clicca su "+ CREA CONTRIBUENTE" per aggiungerne uno.</p>
            ) : (
              <div className="space-y-4">
                {contribuenti.map((c, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow border">
                    <p className="font-semibold">{c.cognome} {c.nome}</p>
                    <p className="text-sm text-gray-500">{c.codiceFiscale}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f7f0]">
      {/* Header in cima a tutto */}
      <Header />

      {/* Container per sidebar + contenuto */}
      <div className="flex-1 flex">
        {/* Sidebar sotto l'header */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as ViewType)}
          onCreateContribuente={() => setIsContribuentePanelOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 w-full px-6 py-8">
          {renderContent()}
        </main>
      </div>

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
